const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const router = express.Router();

// Load User Model
require("../models/User");
const User = mongoose.model("User");

// Load local strategy
require("../config/passport");

// '/users/login' Route
router.get("/login", (req, res) => {
  res.render("users/login");
});

// '/users/register' Route
router.get("/register", (req, res) => {
  res.render("users/register");
});

// POST '/users/register' Req.
router.post("/register", (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  let misMatchError;
  if (password !== confirmPassword) {
    misMatchError = "Password & Confirm Passwords are not matched!";
  }
  if (typeof misMatchError !== "undefined") {
    res.render("users/register", {
      misMatchError,
      name,
      email,
      password,
      confirmPassword
    });
  } else {
    const newUser = {
      name,
      email,
      password
    };
    // Check if there is already a user with this email
    User.findOne({ email: newUser.email }).then(user => {
      if (user) {
        console.log("There is a user with this email");
        req.flash("errorMsg", "There is already a user with this email");
        res.redirect("/users/register");
      } else {
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            // Reset PWD
            newUser.password = hash;
            const user = new User(newUser);
            user.save().then(() => {
              req.flash("successMsg", "Now You Can Login!");
              res.redirect("/users/login");
            });
          });
        });
      }
    });
  }
});

// POST '/users/login' Req.
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/ideas",
    failureRedirect: "/users/login",
    failureFlash: true
  })
);

router.get("/logout", (req, res) => {
  req.logout();
  req.flash("successMsg", "You are now logged out!");
  res.redirect("/users/login");
});

module.exports = router;
