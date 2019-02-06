const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

// Load User Model
require("../models/User");
const User = mongoose.model("User");

passport.use(
  new LocalStrategy(
    {
      usernameField: "email"
    },
    (email, password, done) => {
      //   console.log(email);
      //   console.log(password);
      User.findOne({ email: email }, (err, user) => {
        // console.log(user);
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, { message: "Incorrect Email." });
        }
        // Decrypt password of that user
        bcrypt.compare(password, user.password).then(res => {
          if (res) {
            return done(null, user);
          } else {
            return done(null, false, { message: "Incorrect password." });
          }
        });
      });
    }
  )
);

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});
