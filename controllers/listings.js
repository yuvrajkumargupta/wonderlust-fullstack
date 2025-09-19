const Listing=require('../models/listing')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken= process.env.MAP_TOCKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index=async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
}
// Render new form
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new");
};



module.exports.showListing = async (req, res) => {
  const listing = await Listing.findById(req.params.id)
    .populate("owner")
    .populate({
      path: "reviews",
      populate: { path: "author" },
    });

  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }

  res.render("listings/show", { listing });
};


//
module.exports.createListing = async (req, res) => {
  try {
    // 1. Geocode location using Mapbox
    let response = await geocodingClient
      .forwardGeocode({
        query: req.body.listing.location,
        limit: 1
      })
      .send();
      


    // 2. Create new listing
    const newListing = new Listing(req.body.listing);

    // 3. Set GeoJSON coordinates
    newListing.geometry = response.body.features[0].geometry;

    // 4. Set owner
    newListing.owner = req.user._id;

    // 5. If image uploaded, attach Cloudinary info
    if (req.file) {
      newListing.image = {
        url: req.file.path,
        filename: req.file.filename
      };
    }

    // 6. Save to DB
   let saved_listing= await newListing.save();
console.log(saved_listing);
    // 7. Success
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
  } catch (err) {
    console.log(err);
    req.flash("error", "Something went wrong while creating listing.");
    res.redirect("/listings/new");
  }
};


//Ediot
module.exports.renderEditForm=(async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }

let originalImageUrl = listing.image.url;
// Example: make it 300px wide, auto height, crop smart
let smallImageUrl = originalImageUrl.replace(
  "/upload/",
  "/upload/w_300,h_200,c_fill/"
);

res.render("listings/edit", { listing, smallImageUrl });



});

//update listing 
module.exports.UpdateListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  
  if (req.file) {
    listing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
    await listing.save();
  }

  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};



module.exports.destroyedListing=(async (req, res) => {
    await Listing.findByIdAndDelete(req.params.id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
});