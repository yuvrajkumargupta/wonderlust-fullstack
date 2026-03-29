const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn } = require("../middleware.js");
const bookingController = require("../controllers/bookings.js");

router.post("/", isLoggedIn, wrapAsync(bookingController.createCheckoutSession));
router.get("/success", isLoggedIn, wrapAsync(bookingController.success));
router.get("/cancel", isLoggedIn, wrapAsync(bookingController.cancel));

module.exports = router;
