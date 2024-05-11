const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Taxi = require("../models/taxi.js");
const User = require("../models/user.js");
const {
  checkAuthenticated,
  checkNotAuthenticated,
} = require("../controllers/check-authentication");

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

module.exports = router;
