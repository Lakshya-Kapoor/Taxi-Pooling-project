const express = require("express");
const router = express.Router();
const passport = require("passport");

const {
  checkAuthenticated,
  checkNotAuthenticated,
} = require("../controllers/check-authentication");

router.get("/", checkNotAuthenticated, (req, res) => {
  res.render("login.ejs");
});

router.post(
  "/",
  checkNotAuthenticated,
  passport.authenticate("local", {
    successRedirect: "/mySchedule",
    failureRedirect: "/login",
    failureFlash: true, // Error message in config files shall be displayed
  })
);

module.exports = router;
