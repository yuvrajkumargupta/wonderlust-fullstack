const Booking = require("../models/booking");
const Listing = require("../models/listing");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy');

module.exports.createCheckoutSession = async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }

    const { checkIn, checkOut } = req.body;
    
    if(!checkIn || !checkOut) {
        req.flash("error", "Please provide Check-in and Check-out dates.");
        return res.redirect(`/listings/${listing._id}`);
    }

    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);
    const diffTime = endDate - startDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if(diffDays <= 0) {
        req.flash("error", "Check-out date must be strictly after Check-in date.");
        return res.redirect(`/listings/${listing._id}`);
    }

    const totalPrice = listing.price * diffDays;

    if (!process.env.STRIPE_SECRET_KEY) {
        req.flash("error", "Developer Mode: STRIPE_SECRET_KEY is missing in .env");
        return res.redirect(`/listings/${listing._id}`);
    }

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            customer_email: req.user && req.user.email ? req.user.email : undefined,
            client_reference_id: req.params.id,
            line_items: [
                {
                    price_data: {
                        currency: 'inr',
                        product_data: {
                            name: listing.title,
                            description: `Booking from ${startDate.toDateString()} to ${endDate.toDateString()}`,
                            images: listing.image && listing.image.url ? [listing.image.url] : [],
                        },
                        unit_amount: totalPrice * 100, // INR paise
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${req.protocol}://${req.get('host')}/listings/${listing._id}/bookings/success?session_id={CHECKOUT_SESSION_ID}&checkIn=${checkIn}&checkOut=${checkOut}&total=${totalPrice}`,
            cancel_url: `${req.protocol}://${req.get('host')}/listings/${listing._id}/bookings/cancel`,
        });

        res.redirect(303, session.url);
    } catch (e) {
        console.error("Stripe Error:", e);
        req.flash("error", e.message);
        res.redirect(`/listings/${listing._id}`);
    }
};

module.exports.success = async (req, res) => {
    const { session_id, checkIn, checkOut, total } = req.query;
    const listingId = req.params.id;

    if (!session_id) {
        req.flash("error", "Invalid session.");
        return res.redirect(`/listings/${listingId}`);
    }

    const booking = new Booking({
        listing: listingId,
        user: req.user._id,
        checkIn: new Date(checkIn),
        checkOut: new Date(checkOut),
        totalPrice: total,
        stripeSessionId: session_id,
        status: 'paid'
    });

    await booking.save();

    const listing = await Listing.findById(listingId);
    listing.bookings.push(booking._id);
    await listing.save();

    req.flash("success", `Payment successful! Your stay is confirmed. Check-in on ${new Date(checkIn).toDateString()}`);
    res.redirect(`/listings/${listing._id}`);
};

module.exports.cancel = async (req, res) => {
    req.flash("error", "Payment cancelled.");
    res.redirect(`/listings/${req.params.id}`);
};
