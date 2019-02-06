const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const IdeaSchema = new Schema({
  title: String,
  details: String,
  date: {
    type: Date,
    default: Date.now()
  },
  userID: String
});

mongoose.model("Idea", IdeaSchema, "ideas");
