const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Taxi = require("../models/taxi.js");
const User = require("../models/user.js");

router.patch("/", checkAuthenticated, async (req, res) => {
  let taxiId = req.body.taxiId;
  await Taxi.findOneAndUpdate(
    { _id: taxiId },
    { $push: { people: req.user._id } }
  );
  await User.findOneAndUpdate(
    { _id: req.user._id },
    { $push: { scheduledTaxis: taxiId } }
  );
  res.redirect("/mySchedule");
});

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

module.exports = router;
