const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user.js");

router.get("/", checkNotAuthenticated, (req, res) => {
  res.render("signup.ejs");
});

router.post("/", checkNotAuthenticated, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({
      rollNo: req.body.rollNo,
      name: req.body.name,
      phoneNo: req.body.phoneNo,
      password: hashedPassword,
    });
    res.redirect("/login");
  } catch {
    res.redirect("/signup");
  }
});

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/mySchedule");
  }
  next();
}

module.exports = router;
