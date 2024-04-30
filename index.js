if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const PORT = 3000;
const path = require("path");
const bodyParser = require("body-parser");
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
initializePassport(
  passport,
  async (rollNo) => await User.findOne({ rollNo: rollNo }),
  async (id) => await User.findById(id)
);

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
    successRedirect: "/mySchedule",
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

app.get(
  "/taxi-data-day-wise/:day/:month/:year",
  checkAuthenticated,
  async (req, res) => {
    let queryDate = new Date(
      Number(req.params.year),
      Number(req.params.month),
      Number(req.params.day)
    );
    queryDate.setHours(0, 0, 0, 0);
    let queryDateEnd = new Date(queryDate);
    queryDateEnd.setHours(23, 59, 59, 999);
    const noOfTaxis = await Taxi.countDocuments({
      $and: [
        {date: { $gte: queryDate, $lte: queryDateEnd }},
        { people: { $nin: [req.user._id] } }
      ]
    });
    res.send(`${noOfTaxis}`);
  }
);

app.get(
  "/taxi-data-hour-wise/:day/:month/:year/:hour",
  checkAuthenticated,
  async (req, res) => {
    let queryDate = new Date(
      Number(req.params.year),
      Number(req.params.month),
      Number(req.params.day)
    );
    queryDate.setHours(0, 0, 0, 0);
    let queryDateEnd = new Date(queryDate);
    queryDateEnd.setHours(23, 59, 59, 999);

    let queryTime = Number(req.params.hour);
    const noOfTaxis = await Taxi.countDocuments({
      $and: [
        { date: { $gte: queryDate, $lte: queryDateEnd } },
        { hours: queryTime },
        { people: { $nin: [req.user._id] } }
      ],
    });
    res.send(`${noOfTaxis}`);
  }
);

app.post("/schedule-new-taxi", checkAuthenticated, async (req, res) => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const day = Number(req.body.day);
  const month = months.indexOf(req.body.month);
  const year = Number(req.body.year);
  const hour = Number(req.body.hour);
  const minutes = Number(req.body.minutes);
  const capacity = Number(req.body.capacity);
  const user = req.user;

  let date = new Date(year, month, day);
  let ISOdate = date.toISOString();

  const newTaxi = new Taxi({
    date: ISOdate,
    capacity: capacity,
    hours: hour,
    minutes: minutes,
  });

  newTaxi.people.push(user._id);

  await newTaxi.save()
  await User.findOneAndUpdate({_id: user._id}, {$push: {scheduledTaxis: newTaxi._id}});
  res.redirect("/mySchedule");
});

app.get(
  "/booked-taxis/:day/:month/:year/:hour",
  checkAuthenticated,
  async (req, res) => {
    let queryDate = new Date(
      Number(req.params.year),
      Number(req.params.month),
      Number(req.params.day)
    );
    queryDate.setHours(0, 0, 0, 0);
    let queryDateEnd = new Date(queryDate);
    queryDateEnd.setHours(23, 59, 59, 999);
    let queryTime = Number(req.params.hour);

    const taxis = await Taxi.find(
      {
        $and: [
          { date: { $gte: queryDate, $lte: queryDateEnd } },
          { hours: queryTime },
          { people: { $nin: [req.user._id] } }
        ],
      },
      { people: 1, hours: 1, minutes: 1 }
    );

    const taxiData = [];

    for (const taxi of taxis) {
      const peopleData = [];
      for (const person of taxi.people) {
        peopleData.push({
          name: (await User.findById(person, { name: 1, _id: 0 })).name,
          phoneNo: (await User.findById(person, { phoneNo: 1, _id: 0 })).phoneNo,
        });
      }
      taxiData.push({
        uniqueId: taxi._id,
        time: String(taxi.hours) + ":" + String(taxi.minutes),
        people: peopleData,
      });
    }
    const jsonString = JSON.stringify(taxiData);
    res.send(jsonString);
  }
);

app.patch("/join-taxi-pool", checkAuthenticated, async (req, res) => {
  let taxiId = req.body.taxiId;
  await Taxi.findOneAndUpdate({_id: taxiId}, {$push: {people: req.user._id}});
  await User.findOneAndUpdate({_id: req.user._id}, {$push: {scheduledTaxis: taxiId}});
  res.redirect("/mySchedule");
});

app.get("/my-taxis", checkAuthenticated, async (req, res) => {
  const user = req.user;
  const taxis = await Taxi.find({people: { $in: [user._id]}}, {capacity: 0});
  
  const taxiData = [];
  for (const taxi of taxis) {
    const peopleData = [];
    for (const person of taxi.people) {
      peopleData.push({
        name: (await User.findById(person, { name: 1, _id: 0 })).name,
        phoneNo: (await User.findById(person, { phoneNo: 1, _id: 0 })).phoneNo,
      });
    }
    const date = String(new Date(taxi.date)).substring(0, 10);
    taxiData.push({
      uniqueId: taxi._id,
      date: date,
      time: String(taxi.hours) + ":" + String(taxi.minutes),
      people: peopleData,
    });
  }
  const jsonString = JSON.stringify(taxiData);
  res.send(jsonString);
});

app.patch("/cancel-booking", checkAuthenticated, async (req, res) => {
  const user = req.user;
  const taxiId = req.body.taxiId;
  await Taxi.findByIdAndUpdate(taxiId, { $pull: { people: user._id}});
  const noOfPeopleInTaxi = ((await Taxi.findById(taxiId, {people: 1, _id:0})).people).length;
  if (noOfPeopleInTaxi == 0)
    await Taxi.findByIdAndDelete(taxiId);
  res.redirect("/mySchedule");
})

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/mySchedule");
  }
  next();
}

app.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`);
});
