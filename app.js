 if (process.env.NODE_ENV !== "production") {
 require("dotenv").config();
 }
 console.log(process.env.SECRET);



const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const session= require("express-session");
const MongoStore = require("connect-mongo");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy= require("passport-local");
const User= require("./models/user.js");




const app = express();
const dbUrl=process.env.ATLASTDB_URL;

// Utils & schemas
const ExpressError = require("./utils/ExpressError.js");

// Routers
const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter= require("./routes/user.js");


// Middleware & setup
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
async function main() {
    await mongoose.connect(dbUrl);
}
main()
    .then(() => console.log(" Connected to MongoDB"))
    .catch(err => console.error("MongoDB connection error:", err));

// Views setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto: {
        secret : process.env.SECRET,
   
  },
   touchAfter: 24 * 3600, 
})
store.on("error", ()=>{
    console.log("ERROR in MONGO SESSION STORE ", err);
})

const sessionOptions={
    store,
    secret : process.env.SECRET,
    resave  : false,
      saveUninitialized: false,
     cookie : {
    exprires : Date.now() + 7*24 *60*60*1000,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  httpOnly: true
     }
}
// // Root route
// app.get("/", (req, res) => {
//     res.send("Hi, I am root");
// });



app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req , res, next)=>{
    res.locals.success= req.flash("success");
     res.locals.error= req.flash("error");
    res.locals.currUser= req.user;
    next();

})

// app.get("/demouser", async(req, res)=>{
//    let fakeUser = new User({
//     email: "student@getMaxListeners.com",  
//     username: "delta-student"
// });
//     const rigisteredUser= await  User.register(fakeUser, "helloworld")
//     res.send(rigisteredUser);

// })



// -- ROUTES --

// Listings routes
app.use("/listings", listingsRouter);

// Reviews routes (must pass mergeParams in router)
app.use("/listings/:id/reviews", reviewsRouter);
//user Router
app.use("/",userRouter);

// -- ERROR HANDLING --

// Handle all unknown routes
app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

// Error handling middleware
app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong!" } = err;
    res.status(statusCode).render("error.ejs", { message });
});

// Start server
app.listen(8080, () => {
    console.log(" Server is listening on port 8080");
});
