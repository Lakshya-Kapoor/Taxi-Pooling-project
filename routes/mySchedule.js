const express = require("express");
const router = express.Router();
const {
  checkAuthenticated,
  checkNotAuthenticated,
} = require("../controllers/check-authentication");

router.get("/", checkAuthenticated, (req, res) => {
  res.render("mySchedule.ejs");
});

module.exports = router;
