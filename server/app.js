// ✅ Load environment variables (make sure .env is in the root or adjust path)
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: "./server/.env" });
}
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const methodOverride = require("method-override");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const { cloudinary } = require("./cloudConfig.js"); // ✅ make sure this is at the top
const multer = require("multer");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const User = require("./models/user.js");
const { storage } = require("./cloudConfig.js");
const upload = multer({ storage });
const app = express();

/* ---------------------------------- MIDDLEWARE ---------------------------------- */

app.use(
  cors({
    origin: "http://localhost:5173", // your React app’s origin
    credentials: true, // ✅ allow cookies for auth
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

/* ---------------------------------- SESSION ---------------------------------- */

const sessionOptions = {
  secret: process.env.SECRET || "fallbackSecretKey", // ✅ from .env
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // ✅ only secure on HTTPS
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  },
};

app.use(session(sessionOptions));

/* ---------------------------------- PASSPORT ---------------------------------- */

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

/* ---------------------------------- DATABASE ---------------------------------- */

const MONGO_URL =
  process.env.MONGO_URL || "mongodb://127.0.0.1:27017/Wanderlust";

mongoose
  .connect(MONGO_URL)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

/* ---------------------------------- MIDDLEWARES ---------------------------------- */

const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    return res.status(401).json({
      success: false,
      message: "You must be logged in to perform this action.",
    });
  }
  next();
};

/* ---------------------------------- ROUTES ---------------------------------- */

// ✅ Get all listings
app.get(
  "/listings",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.json(allListings);
  })
);

// ✅ Get a single listing (with reviews + owner)
app.get(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id)
      .populate({
        path: "reviews",
        populate: { path: "author", select: "username" },
      })
      .populate("owner", "username");

    if (!listing) return res.status(404).json({ message: "Listing not found" });
    res.json(listing);
  })
);

// ✅ Create new listing
app.post(
  "/listings",
  isLoggedIn,
  upload.single("listing[image]"),
  wrapAsync(async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "Image upload is required" });
    }

    const { path: url, filename } = req.file; // ✅ use correct property name
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename }; // ✅ match schema exactly

    await newListing.save();

    res.status(201).json({
      success: true,
      message: "New listing added!",
      listing: newListing,
    });
  })
);

// update listing
app.put(
  "/listings/:id",
  isLoggedIn,
  upload.single("listing[image]"), // ✅ allows image upload
  wrapAsync(async (req, res) => {
    const { id } = req.params;

    // find listing
    const listing = await Listing.findById(id);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    // authorization check
    if (!listing.owner.equals(req.user._id)) {
      return res
        .status(403)
        .json({ message: "Not authorized to edit this listing" });
    }

    // update text fields
    listing.title = req.body.listing.title;
    listing.description = req.body.listing.description;
    listing.price = req.body.listing.price;
    listing.location = req.body.listing.location;
    listing.country = req.body.listing.country;

    // ✅ handle new image upload
    if (req.file) {
      if (listing.image && listing.image.filename) {
        try {
          await cloudinary.uploader.destroy(listing.image.filename);
        } catch (err) {
          console.error("Cloudinary deletion failed:", err.message);
        }
      }
      // 🆕 set new image data
      listing.image.url = req.file.path;
      listing.image.filename = req.file.filename;
    }

    await listing.save();

    res.json({
      success: true,
      message: "Listing updated successfully!",
      listing,
    });
  })
);

// ✅ Delete listing
app.delete(
  "/listings/:id",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const deleted = await Listing.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Listing not found" });
    res.json({ success: true, message: "Listing deleted", deleted });
  })
);

// ✅ Add review
app.post(
  "/listings/:id/reviews",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const { review } = req.body;

    if (!review || !review.comment || !review.rating)
      return res.status(400).json({ error: "All fields required" });

    const listing = await Listing.findById(id);
    if (!listing) return res.status(404).json({ error: "Listing not found" });

    const newReview = new Review({
      comment: review.comment.trim(),
      rating: review.rating,
      author: req.user._id,
    });

    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    await newReview.populate("author", "username");

    res.status(201).json({ message: "Review added", review: newReview });
  })
);

// ✅ Delete review
app.delete(
  "/listings/:id/reviews/:reviewID",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    const { id, reviewID } = req.params;

    const review = await Review.findById(reviewID);
    if (!review) return res.status(404).json({ error: "Review not found" });
    if (!review.author.equals(req.user._id))
      return res.status(403).json({ error: "Not authorized" });

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewID } });
    await Review.findByIdAndDelete(reviewID);
    res.json({ message: "Review deleted" });
  })
);

/* ---------------------------------- AUTH ROUTES ---------------------------------- */

// ✅ Check current user
app.get("/check-auth", (req, res) => {
  res.json({
    isAuthenticated: !!req.isAuthenticated(),
    user: req.user || null,
  });
});

// ✅ Signup
app.post(
  "/signup",
  wrapAsync(async (req, res, next) => {
    const { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);

    req.login(registeredUser, (err) => {
      if (err) return next(err);
      res.status(201).json({
        success: true,
        message: "Signup successful!",
        user: { username: registeredUser.username },
      });
    });
  })
);

// ✅ Login
app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user)
      return res.status(401).json({
        success: false,
        message: info?.message || "Invalid credentials",
      });

    req.logIn(user, (err) => {
      if (err) return next(err);
      const redirectUrl = req.session.redirectUrl || "/listings";
      req.session.redirectUrl = null;

      res.json({
        success: true,
        message: "Logged in successfully",
        user: { username: user.username },
        redirectUrl,
      });
    });
  })(req, res, next);
});

// ✅ Logout
app.get("/logout", (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(400).json({
      success: false,
      message: "You are not logged in.",
    });
  }

  req.logout((err) => {
    if (err) return next(err);
    res.json({ success: true, message: "Logged out successfully" });
  });
});

/* ---------------------------------- DEPLOYMENT (for Render) ---------------------------------- */
const path = require("path");

// ✅ Serve frontend build when in production
if (process.env.NODE_ENV === "production") {
  const __dirname1 = path.resolve();
  app.use(express.static(path.join(__dirname1, "/client/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname1, "client", "dist", "index.html"));
  });
}

// ✅ Use Render or local port
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
