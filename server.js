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

const initializePassport = require("./passport-config.js");
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

// signup route
const signupRouter = require("./routes/signup.js");
app.use("/signup", signupRouter);

// login route
const loginRouter = require("./routes/login.js");
app.use("/login", loginRouter);

// my schedule route
const myScheduleRouter = require("./routes/mySchedule.js");
app.use("/mySchedule", myScheduleRouter);

// taxipooling route
const taxiPoolingRouter = require("./routes/taxiPooling.js");
app.use("/taxiPooling", taxiPoolingRouter);

// about us route
const aboutUsRouter = require("./routes/aboutUs.js");
app.use("/aboutUs", aboutUsRouter);

// account route
const accountRouter = require("./routes/account.js");
app.use("/account", accountRouter);

// taxi data retreival route
const taxiDataRouter = require("./routes/taxi-data.js");
app.use("/taxi-data", taxiDataRouter);

// scheduling new taxi route
const newTaxiRouter = require("./routes/scheduleNewTaxi.js");
app.use("/schedule-new-taxi", newTaxiRouter);

// Join a taxi pool route
const joinRouter = require("./routes/joinTaxiPool.js");
app.use("/join-taxi-pool", joinRouter);

// cancel taxi route
const cancelRouter = require("./routes/cancelBooking.js");
app.use("/cancel-booking", cancelRouter);

app.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`);
});
