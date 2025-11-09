const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (timestamp) => {
        if (!timestamp) return "N/A";
        const d = new Date(timestamp);
        const day = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
        const year = d.getFullYear();
        return `${day}-${month}-${year}`; // DD-MM-YYYY format
      },
    },
  },
  { toJSON: { getters: true }, toObject: { getters: true } }
);

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
