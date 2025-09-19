const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const MONGO_URL = "mongodb://localhost:27017/wanderlust";

main()
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch(err => console.error("MongoDB connection error:", err));

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    await Listing.deleteMany({});

    // create a new array with owners added
    const dataWithOwner = initData.data.map((obj) => ({
        ...obj,
        owner: "68c2b623f2ce434d906a66c5"   // <-- must be ObjectId later
    }));

    await Listing.insertMany(dataWithOwner);
    console.log("Data was initialized");
};

initDB();
