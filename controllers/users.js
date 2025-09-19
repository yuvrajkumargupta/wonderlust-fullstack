const User=require('../models/user');

module.exports.renderSignupForm=(req, res) => {
    res.render("users/signup.ejs");
};

module.exports.signup= async(req, res) => {
    try {
        let { username, email, password } = req.body;

        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);

        console.log(registeredUser);
        req.login(registeredUser, (err)=>{
            if(err){
                return next(err);
            }
        req.flash("success", "Welcome to Wanderlust!");

      return   res.redirect("/listings");
        })

       
    } catch (err) {
        req.flash("error", err.message);
     return    res.redirect("/signup");
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


module.exports.logout= (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);  // agar logout me error aaye
        }
        req.flash("success", "Logged you out!");
        res.redirect("/login");
    });
};