const Listing = require("./models/listing");
const Review = require("./models/review");
const { listingSchema, reviewSchema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");

//  Check if user is logged in
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) { // Passport method to check login
    req.session.redirectUrl = req.originalUrl; // Save original URL for redirect after login
    req.flash("error", "You must be logged in to access this page!");
    return res.redirect("/login");
  }
  next();
};

//  Save redirect URL (to use after login)
module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl; // store it in locals for access in templates
  }
  next();
};

//  Check if logged-in user is the owner of the listing
module.exports.isOwner = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) { 
    req.flash("error", "Listing you requested does not exist!");
    return res.redirect("/listings");
  }

  if (!listing.owner.equals(req.user._id)) {
    req.flash("error", "You don’t have permission to modify this listing!");
    return res.redirect(`/listings/${id}`);
  }

  req.listing = listing; 
  next();
};

//  Validate listing input data using Joi (user-friendly flash)
module.exports.validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(", ");
    req.flash("error", msg || "Invalid listing data. Please check your input.");
    return res.redirect("back"); // go back to form
  }
  next();
};

//  Validate review input data using Joi (user-friendly flash)

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(", ");
        req.flash("error", msg);

        // Redirect user back to the listing page
        const { id } = req.params; 
        return res.redirect(`/listings/${id}`);
    }
    next();
};

//  Check if logged-in user is the author of the review
module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);

  if (!review) {
    req.flash("error", "Review not found!");
    return res.redirect(`/listings/${id}`);
  }

  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You don’t have permission to edit/delete this review!");
    return res.redirect(`/listings/${id}`);
  }

  req.review = review;
  next();
};
