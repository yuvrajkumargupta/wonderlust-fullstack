const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");   
const wrapAsync = require("../utils/wrapAsync.js"); 
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");  
const ListingController = require("../controllers/listings.js");
const multer = require("multer");
const {storage}= require("../cloudConfig.js")
const upload =multer({storage})

router
.route("/")
  .get(wrapAsync(ListingController.index))   // Show all listings
  .post(isLoggedIn,
     validateListing, 
     upload.single("listing[image]"),
     wrapAsync(ListingController.createListing));  // Add new listing


router.get("/new", isLoggedIn, ListingController.renderNewForm);

router.route("/:id")
  .get(wrapAsync(ListingController.showListing))   // Show one listing
  .put(isLoggedIn, upload.single("listing[image]"),isOwner, wrapAsync(ListingController.UpdateListing)) // Update
  .delete(isLoggedIn, isOwner, wrapAsync(ListingController.destroyedListing)); // Delete

router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(ListingController.renderEditForm));

module.exports = router;
