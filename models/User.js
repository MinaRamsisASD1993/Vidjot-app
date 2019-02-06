const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: String,
  email: String,
  password: String,
  date: {
    type: Date,
    default: Date.now()
  }
});

mongoose.model("User", UserSchema, "users");
