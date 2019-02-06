const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

// Load Idea Model
require("../models/Idea");
const Idea = mongoose.model("Idea");
// Load isAuth To check for auth
const isAuth = require("../helpers/isAuth");

// '/ideas/add'
router.get("/add", isAuth.checkAuthentication, (req, res) => {
  res.render("ideas/add");
});
// '/ideas' Route
router.get("/", isAuth.checkAuthentication, (req, res) => {
  Idea.find({ userID: req.user.id })
    .sort({ date: "desc" })
    .then(ideas => {
      res.render("ideas/index", {
        ideas
      });
    });
});
// '/ideas/edit/:id' Route
router.get("/edit/:id", isAuth.checkAuthentication, (req, res) => {
  const ideaID = req.params.id;
  Idea.findById(ideaID)
    .then(idea => {
      const { _id, title, details } = idea;
      res.render("ideas/edit", {
        _id,
        title,
        details
      });
    })
    .catch(err => console.log(err));
});

// POST '/ideas' + Server Validation
router.post("/", isAuth.checkAuthentication, (req, res) => {
  // console.log(req.user.id);
  const { title, details } = req.body;
  let errors = [];

  if (!title) {
    errors.push({ text: "Title field is missing" });
  }
  if (!details) {
    errors.push({ text: "Details field is missing" });
  }
  //   Check if there are Errors
  if (errors.length > 0) {
    res.render("ideas/add", {
      errors,
      title,
      details
    });
  } else {
    const newIdea = {
      title,
      details,
      userID: req.user.id
    };
    const idea = new Idea(newIdea);
    idea
      .save()
      .then(() => {
        // res.render("ideas/index");
        req.flash("successMsg", "New Video Idea added successfully");
        res.redirect("/ideas");
      })
      .catch(err => {
        console.log(err);
      });
  }
});

// PUT '/ideas/edit/:id'
router.put("/edit/:id", isAuth.checkAuthentication, (req, res) => {
  const editedIdea = {
    title: req.body.title,
    details: req.body.details
  };
  Idea.findByIdAndUpdate(req.params.id, {
    $set: { title: editedIdea.title, details: editedIdea.details }
  })
    .then(() => {
      res.redirect("/ideas");
    })
    .catch(err => console.log(err));
});

// DELETE '/ideas/:id'
router.delete("/:id", isAuth.checkAuthentication, (req, res) => {
  Idea.findByIdAndDelete(req.params.id)
    .then(() => {
      req.flash("errorMsg", "Video Idea is now deleted!");
      res.redirect("/ideas");
    })
    .catch(err => console.log(err));
});

module.exports = router;
