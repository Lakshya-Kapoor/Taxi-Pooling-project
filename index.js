if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const PORT = 3000;
const path = require("path");
const bcrypt = require("bcrypt");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const User = require("./models/user.js");
const Taxi = require("./models/taxi.js");

main()
  .then(() => {
    console.log("Connection successful");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/realTaxi");
}

const initializePassport = require("./passport-config");
initializePassport(passport);

app.set("view-engine", "ejs");
app.use(express.static(path.join(__dirname, "/public/styles")));
app.use(express.static(path.join(__dirname, "/public/scripts")));
app.use(express.static(path.join(__dirname, "/public/images")));
app.use(express.urlencoded({ extended: true }));
app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));

app.get("/signup", checkNotAuthenticated, (req, res) => {
  res.render("signup.ejs");
});

app.post("/signup", checkNotAuthenticated, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({
      rollNo: req.body.rollNo,
      name: req.body.name,
      phoneNo: req.body.phoneNo,
      password: hashedPassword,
    });
    res.redirect("/login");
  } catch {
    res.redirect("/signup");
  }
});

app.get("/login", checkNotAuthenticated, (req, res) => {
  res.render("login.ejs");
});

app.post(
  "/login",
  checkNotAuthenticated,
  passport.authenticate("local", {
    successRedirect: "/taxiPooling",
    failureRedirect: "/login",
    failureFlash: true, // Error message in config files shall be displayed
  })
);

app.get("/mySchedule", checkAuthenticated, (req, res) => {
  res.render("mySchedule.ejs");
});

app.get("/taxiPooling", checkAuthenticated, (req, res) => {
  res.render("taxiPooling.ejs");
});

app.get("/aboutUs", checkAuthenticated, (req, res) => {
  res.render("aboutUs.ejs");
});

app.get("/account", checkAuthenticated, (req, res) => {
  res.render("account.ejs");
});

app.delete("/account", checkAuthenticated, (req, res) => {
  req.logOut((err) => {
    if (err) {
      console.error(err);
      res.redirect("/account");
    } else {
      res.redirect("/login");
    }
  });
});

app.get("/taxi-data-day-wise/:day/:month/:year", checkAuthenticated, async (req, res) => {
  let queryDate = new Date(
    Number(req.params.year),
    Number(req.params.month),
    Number(req.params.day)
  );
  queryDate.setHours(0, 0, 0, 0);
  let queryDateEnd = new Date(queryDate);
  queryDateEnd.setHours(23, 59, 59, 999);
  const noOfTaxis = await Taxi.countDocuments({ date: {$gte: queryDate, $lte: queryDateEnd}});
  res.send(`${noOfTaxis}`);
});

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/taxiPooling");
  }
  next();
}

app.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`);
});
