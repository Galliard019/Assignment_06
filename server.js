const HTTP_PORT = process.env.PORT || 8080;

const express = require("express");
const app = express();
app.use(express.static("public"));  // css files
app.set("view engine", "ejs");      //ejs
app.use(express.urlencoded({ extended: true })); //forms


// setup sessions
const session = require('express-session')
app.use(session({
   secret: "the quick brown fox jumped over the lazy dog 1234567890",  // random string, used for configuring the session
   resave: false,
   saveUninitialized: true
}))

require("dotenv").config()   
const mongoose = require('mongoose')

const MONGO_URI = process.env.MONGO_CONNECTION_STRING;

const popCarsIfEmpty = require("./popCars");



// TODO: Put your model and schemas here

const User = require("./models/User.js");
const Car = require("./models/Car.js");

function ensureLoggedIn(req, res, next) {
  if (!req.session.user) return res.redirect("/");
  next();
}

app.get("/", async (req, res) => {  
    return res.render("login.ejs", {error: null})
})
app.post("/login", async (req, res)=>{
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        const newUser = new User({ email, password });
        await newUser.save();
        req.session.user = newUser;
        return res.redirect("/cars");
    }

    if (user.password === password) {
        req.session.user = user;
        return res.redirect("/cars");
    }

    res.render("login", { error: "Invalid password" });
})

app.get("/logout", async (req,res) => {
    req.session.destroy(() => {
    return res.redirect("/");
  });
})

app.post("/return/:id", ensureLoggedIn, async (req, res) => {
  await Car.findByIdAndUpdate(req.params.id, {
    returnDate: "",
    rentedBy: null
  });
  return res.redirect("/cars");
});


app.get("/cars", async (req, res) => {  
    const cars = await Car.find().populate("rentedBy");
    return res.render("cars", { cars, user: req.session.user });
})

app.get("/book/:id", ensureLoggedIn, async (req,res)=>{
    const car = await Car.findById(req.params.id);
    return res.render("bookingForm", { car });
})

app.post("/book/:id", ensureLoggedIn, async (req,res)=>{
    // get booking form data 
    const { returnDate } = req.body;
    await Car.findByIdAndUpdate(req.params.id, {
        returnDate,
        rentedBy: req.session.user._id
    });
    return res.redirect("/cars");
})


async function startServer() {
    try {    
        // TODO: Update this
        await mongoose.connect(process.env.MONGO_CONNECTION_STRING)

        console.log("SUCCESS connecting to MONGO database")
        console.log("STARTING Express web server")
        
        await popCarsIfEmpty();
        
        app.listen(HTTP_PORT, () => {     
            console.log(`server listening on: http://localhost:${HTTP_PORT}`) 
        })    
    }
    catch (err) {        
        console.log("ERROR: connecting to MONGO database")        
        console.log(err)
        console.log("Please resolve these errors and try again.")
    }
}
startServer()



