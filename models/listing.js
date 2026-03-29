const mongoose = require("mongoose");
const { listingSchema } = require("../schema"); // (only needed if you’re using Joi validation)
const Review = require("./review");
const Booking = require("./booking");
const Schema = mongoose.Schema;

const ListingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
image: {
  url : String,
  filename : String,
  
},

  price: {
    type: Number,
    required: true,
    min: 0,
  },
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  bookings: [
    {
      type: Schema.Types.ObjectId,
      ref: "Booking",
    },
  ],
  owner : {
    type  : Schema.Types.ObjectId,
    ref : "User",
  },
   geometry: {
    type: {
      type: String,
      enum: ["Point"], // Only points for now
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  category: {
    type: String,
    enum: [
      "Trending",
      "Rooms",
      "Beach",
      "Mountains",
      "Cabins",
      "City",
      "Camping",
      "Pools",
      "Pet Friendly",
      "Villas",
      "Castles",
      "Tiny Homes",
      "Unique Stays"
    ],
    default: "Trending",
  }


});


ListingSchema.post("findOneAndDelete", async function (listing) {
  if (listing) {
    await Review.deleteMany({
      _id: { $in: listing.reviews },
    });
    if (listing.bookings && listing.bookings.length) {
      await Booking.deleteMany({
        _id: { $in: listing.bookings },
      });
    }
  }
});

const Listing = mongoose.model("Listing", ListingSchema);
module.exports = Listing;
