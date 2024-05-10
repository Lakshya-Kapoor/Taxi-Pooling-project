const express = require("express");
const router = express.Router();

router.get("/", checkAuthenticated, (req, res) => {
  res.render("account.ejs");
});

router.delete("/", checkAuthenticated, (req, res) => {
  req.logOut((err) => {
    if (err) {
      console.error(err);
      res.redirect("/account");
    } else {
      res.redirect("/login");
    }
  });
});

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

module.exports = router;
