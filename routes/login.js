const express = require("express");
const router = express.Router();
const passport = require("passport");

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

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/mySchedule");
  }
  next();
}

module.exports = router;
