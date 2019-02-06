const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const mongoose = require("mongoose");
const app = express();

const keys = require("./config/keys");

const ideasRoute = require("./routes/ideas");
const usersRoute = require("./routes/users");

mongoose
  .connect(keys.mongoURI, { useNewUrlParser: true })
  .then(() => console.log("MongoDB is now Connected..."))
  .catch(err => console.log(err));

//Express Handlebars Middlwware
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// bodyParser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Method-Override Middleware
app.use(methodOverride("_method"));

// Session Middlware
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true
  })
);
// Connect-Flash Middlware
app.use(flash());
// Public Dir
app.use(express.static(__dirname + "/public"));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Set Global Variables
app.use((req, res, next) => {
  res.locals.successMsg = req.flash("successMsg");
  res.locals.errorMsg = req.flash("errorMsg");
  // error for Passport Msgs
  res.locals.error = req.flash("error");
  // LoggedIn User (if there)
  res.locals.user = req.user;
  next();
});

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/about", (req, res) => {
  res.render("About");
});

// Routes of '/ideas'
app.use("/ideas", ideasRoute);
// Routes of '/users'
app.use("/users", usersRoute);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`App is now listening to port ${port}`);
});
