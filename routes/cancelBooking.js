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
  const user = req.user;
  const taxiId = req.body.taxiId;
  await User.findByIdAndUpdate(user._id, { $pull: { scheduledTaxis: taxiId } });
  await Taxi.findByIdAndUpdate(taxiId, { $pull: { people: user._id } });
  const noOfPeopleInTaxi = (await Taxi.findById(taxiId, { people: 1, _id: 0 }))
    .people.length;
  if (noOfPeopleInTaxi == 0) await Taxi.findByIdAndDelete(taxiId);
  res.redirect("/mySchedule");
});

module.exports = router;
