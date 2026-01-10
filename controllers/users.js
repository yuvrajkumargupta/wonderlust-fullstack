const User = require('../models/user');

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
};

module.exports.signup = async (req, res, next) => { // 'next' is important
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);

        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to Wanderlust!");
            res.redirect("/listings");
        });
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
};


module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};



module.exports.login = (req, res) => {
    req.flash("success", "Welcome back!");
    const redirectUrl = req.session.redirectUrl || "/listings";
    delete req.session.redirectUrl;
    res.redirect(redirectUrl);
};


module.exports.logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);  // agar logout me error aaye
        }
        req.flash("success", "Logged you out!");
        res.redirect("/login");
    });
};



module.exports.renderProfile = async (req, res) => {
    // Assuming you have a way to get user listings. If not, we might need to import Listing model.
    // Let's import Listing at top if not present, but for now assuming it's needed.
    // Wait, Listing is not imported in users.js. I should fix that first.
    // Actually, let's just do it here.
    const Listing = require('../models/listing');
    const listings = await Listing.find({ owner: req.user._id });
    res.render("users/profile.ejs", { user: req.user, listings });
};
