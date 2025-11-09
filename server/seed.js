// const mongoose = require("mongoose");
// const Listing = require("./models/listing");
// const Review = require("./models/review");
// const User = require("./models/user");

// // Sample data
// const listingsData = [
//   {
//     title: "Cozy Cottage in Goa",
//     description:
//       "Relax in this charming beachside cottage. Perfect for a laid-back getaway with stunning sea views.",
//     image: {
//       filename: "listingimage",
//       url: "https://images.unsplash.com/photo-1587583778891-2b9eabaf46e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
//     },
//     price: 2500,
//     location: "Goa",
//     country: "India",
//   },
//   {
//     title: "Modern Apartment in Mumbai",
//     description:
//       "Stay in the heart of Mumbai in this sleek, modern apartment close to shopping and nightlife.",
//     image: {
//       filename: "listingimage",
//       url: "https://images.unsplash.com/photo-1572120360610-d971b9c8c1c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
//     },
//     price: 3000,
//     location: "Mumbai",
//     country: "India",
//   },
//   {
//     title: "Himalayan Retreat in Manali",
//     description:
//       "Escape to the mountains in this cozy cabin surrounded by pine forests and fresh mountain air.",
//     image: {
//       filename: "listingimage",
//       url: "https://images.unsplash.com/photo-1582719478174-7f973e79c3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
//     },
//     price: 3500,
//     location: "Manali",
//     country: "India",
//   },
//   {
//     title: "Luxury Villa in Udaipur",
//     description:
//       "Experience royal living in this beautiful villa overlooking the picturesque lakes of Udaipur.",
//     image: {
//       filename: "listingimage",
//       url: "https://images.unsplash.com/photo-1572119862289-845ef13d2c82?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
//     },
//     price: 5000,
//     location: "Udaipur",
//     country: "India",
//   },
//   {
//     title: "Treehouse Stay in Coorg",
//     description:
//       "Live among the treetops in this unique eco-friendly treehouse surrounded by coffee plantations.",
//     image: {
//       filename: "listingimage",
//       url: "https://images.unsplash.com/photo-1560347876-aeef00ee58a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
//     },
//     price: 2800,
//     location: "Coorg",
//     country: "India",
//   },
//   {
//     title: "Beachfront Apartment in Kovalam",
//     description:
//       "Wake up to the sound of waves in this beachfront apartment with breathtaking views of the Arabian Sea.",
//     image: {
//       filename: "listingimage",
//       url: "https://images.unsplash.com/photo-1590490359237-82a7467f9b3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
//     },
//     price: 2000,
//     location: "Kovalam",
//     country: "India",
//   },
//   {
//     title: "Historic Haveli in Jaipur",
//     description:
//       "Experience the rich culture of Rajasthan by staying in this beautifully restored historic haveli.",
//     image: {
//       filename: "listingimage",
//       url: "https://images.unsplash.com/photo-1584680236815-8482f062aa34?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
//     },
//     price: 4000,
//     location: "Jaipur",
//     country: "India",
//   },
//   {
//     title: "Mountain Cabin in Shimla",
//     description:
//       "Cozy up in this mountain cabin with stunning views of the Himalayan ranges and peaceful surroundings.",
//     image: {
//       filename: "listingimage",
//       url: "https://images.unsplash.com/photo-1592440499734-ec67c6c03b03?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
//     },
//     price: 3000,
//     location: "Shimla",
//     country: "India",
//   },
//   {
//     title: "Riverside Cottage in Rishikesh",
//     description:
//       "Enjoy a serene stay by the river with yoga and meditation opportunities in the Himalayas.",
//     image: {
//       filename: "listingimage",
//       url: "https://images.unsplash.com/photo-1571127233535-801f7477b55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
//     },
//     price: 2200,
//     location: "Rishikesh",
//     country: "India",
//   },
//   {
//     title: "Luxury Apartment in Bangalore",
//     description:
//       "Stay in a modern apartment in the tech hub of India, close to shopping, dining, and business districts.",
//     image: {
//       filename: "listingimage",
//       url: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
//     },
//     price: 3200,
//     location: "Bangalore",
//     country: "India",
//   },
// ];

// // Connect to MongoDB
// mongoose
//   .connect("mongodb://127.0.0.1:27017/Wanderlust")
//   .then(() => console.log("✅ MongoDB connected"))
//   .catch((err) => console.error(err));

// const seedDB = async () => {
//   try {
//     // Clear old listings and reviews only
//     await Review.deleteMany({});
//     await Listing.deleteMany({});

//     // Find an existing user to own listings
//     let user = await User.findOne({});
//     if (!user) {
//       user = new User({ username: "admin", email: "admin@example.com" });
//       await User.register(user, "password123"); // only if no user exists
//       console.log("✅ Admin user created");
//     } else {
//       console.log(`✅ Using existing user: ${user.username}`);
//     }

//     // Create listings and associate with the user
//     for (let data of listingsData) {
//       const listing = new Listing({ ...data, owner: user._id });
//       await listing.save();

//       // Optional: Add sample review for each listing
//       const review = new Review({
//         comment: "Amazing place, highly recommend!",
//         rating: 5,
//         author: user._id,
//       });
//       await review.save();

//       listing.reviews.push(review._id);
//       await listing.save();
//     }

//     console.log("✅ Database seeded successfully!");
//   } catch (err) {
//     console.error("❌ Error seeding database:", err);
//   } finally {
//     mongoose.connection.close();
//   }
// };

// seedDB();
