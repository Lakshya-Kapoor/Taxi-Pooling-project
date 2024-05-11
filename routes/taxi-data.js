const express = require("express");
const router = express.Router();
const {
  checkAuthenticated,
  checkNotAuthenticated,
} = require("../controllers/check-authentication");
const {
  get_day_wise,
  get_hour_wise,
  get_booked_taxis,
  get_my_taxis,
} = require('../controllers/taxi-data.js');

router.get("/day-wise/:day/:month/:year", checkAuthenticated, get_day_wise);

router.get("/hour-wise/:day/:month/:year/:hour", checkAuthenticated, get_hour_wise);

router.get("/booked/:day/:month/:year/:hour", checkAuthenticated, get_booked_taxis);

router.get("/my-taxis", checkAuthenticated, get_my_taxis);

module.exports = router;
