const express = require("express");
const router = express.Router();
const {
  checkAuthenticated,
  checkNotAuthenticated,
} = require("../controllers/check-authentication");

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

module.exports = router;
