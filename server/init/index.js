const mongoose = require("mongoose");
const initData = require("./data");
const Listing = require("../models/listing");

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/Wanderlust");
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({ ...obj, owner: "690a16afc0eb34259ec67599" }));
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

main()
  .then(async () => {
    console.log("connected");
    await initDB();
  })
  .catch((err) => {
    console.log(err);
  });
