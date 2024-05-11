const mongoose = require("mongoose");
const Taxi = require("../models/taxi.js");
const User = require("../models/user.js");
const scheduleNew = async (req, res) => {
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

  await newTaxi.save();
  await User.findOneAndUpdate(
    { _id: user._id },
    { $push: { scheduledTaxis: newTaxi._id } }
  );
  res.redirect("/mySchedule");
};

module.exports = { scheduleNew };
