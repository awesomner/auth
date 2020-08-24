var express = require('express'),
  mongoose = require("mongoose"),
  passport = require("passport"),
  bodyParser = require("body-parser"),
  User = require("./models/user"),
  Page = require("./models/page"),
  LocalStrategy = require("passport-local"),
  passportLocalMongoose = require("passport-local-mongoose");
mongoose.connect("mongodb://localhost/auth", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});

var app = express();
app.use(require("express-session")({
  secret: "This is top secret!",
  resave: false,
  saveUninitialized: false
}));
app.set('view engine', 'ejs');
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({
  extended: true
}));

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//========================================
// ROUTES

app.get('/', function(req, res) {
  res.render("home");
});

app.get('/secret', isLoggedIn, function(req, res) {
  res.render("secret");
});

app.get('/register', function(req, res) {
  res.render("register");
});


// PAGE
app.get('/page', function(req, res) {
  res.render("page");
});

app.post('/page', passport.authenticate("local", {
  successRedirect: "/secret",
  failureRedirect: "/page"
}), function(req, res) {});

// REGISTER
app.post('/register', function(req, res) {
  req.body.username
  req.body.password
  User.register(new User({
    username: req.body.username
  }), req.body.password, function(err, user) {
    if (err) {
      console.log(err);
      return res.render("register");
    }
    passport.authenticate("local")(req, res, function() {
      res.redirect("/page");
    });
  });
});

// LOGIN

app.get("/login", function(req, res) {
  res.render("login");
});

app.post("/login", passport.authenticate("local", {
  successRedirect: "/page",
  failureRedirect: "/login"
}), function(req, res) {});

app.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  };
  res.redirect("/login");
};

app.listen(3000, function() {
  console.log("Server is up on port 3000");
});