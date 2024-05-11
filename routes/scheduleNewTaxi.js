const express = require("express");
const router = express.Router();
const { scheduleNew } = require("../controllers/schedule-new-taxi");
const {
  checkAuthenticated,
  checkNotAuthenticated,
} = require("../controllers/check-authentication");

router.post("/", checkAuthenticated, scheduleNew);

module.exports = router;
