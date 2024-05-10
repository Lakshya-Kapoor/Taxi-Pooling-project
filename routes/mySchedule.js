const express = require("express");
const { route } = require("./signup");
const router = express.Router();

router.get("/", checkAuthenticated, (req, res) => {
  res.render("mySchedule.ejs");
});

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

module.exports = router;
