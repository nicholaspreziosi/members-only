// app.js
const express = require("express");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/user");
const Post = require("./models/post");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();
const asyncHandler = require("express-async-handler");

const mongoDb = process.env.MONGODB_URI;
mongoose.connect(mongoDb);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static("public"));

app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

// Redirect to posts page
app.get("/", (req, res) => {
  res.redirect("/posts");
});

// Handle get request on posts page
app.get("/posts", async (req, res) => {
  const posts = await Post.find({}, "title message time author")
    .sort({ time: -1 })
    .populate("author")
    .exec();

  res.render("index", { user: req.user, posts: posts });
});

// Handle get request on sign up page
app.get("/sign-up", (req, res) => {
  if (req.user) {
    res.redirect("posts");
  } else {
    res.render("sign-up-form");
  }
});

// Handle post request on sign up page
app.post("/sign-up", async (req, res, next) => {
  bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
    // if err, do something
    if (err) {
      res.redirect("/sign-up");
      return;
    }
    // otherwise, store hashedPassword in DB
    else {
      try {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
          res.redirect("/sign-up");
          return;
        } else {
          try {
            const user = new User({
              first_name: req.body.first_name,
              last_name: req.body.last_name,
              email: req.body.email,
              password: hashedPassword,
              member: false,
              admin: false,
            });
            const result = await user.save();
            res.redirect("/posts");
          } catch (err) {
            return next(err);
          }
        }
      } catch (err) {
        return done(err);
      }
    }
  });
});

// Set up passport local strategy
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email: email });
        if (!user) {
          return done(null, false, { message: "Incorrect username" });
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          return done(null, false, { message: "Incorrect password" });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// PassportJS functions
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

// Handle get request on account page
app.get("/account", (req, res) => {
  res.render("account", { user: req.user });
});

// Handle get request on create post page
app.get("/posts/create", (req, res, next) => {
  res.render("post-form", { user: req.user });
});

// Handle post request on sign up page
app.post("/posts/create", async (req, res, next) => {
  try {
    const post = new Post({
      title: req.body.title,
      message: req.body.message,
      time: Date.now(),
      author: req.user.id,
    });
    const result = await post.save();
    res.redirect("/posts");
  } catch (err) {
    return next(err);
  }
});

// Handle post request on account page for first name update
app.post("/update/first-name", async (req, res, next) => {
  const user = await User.findById(req.user.id);
  user.first_name = req.body.first_name;
  await user.save();
  res.redirect("/account");
});

// Handle post request on account page for last name update
app.post("/update/last-name", async (req, res, next) => {
  const user = await User.findById(req.user.id);
  user.last_name = req.body.last_name;
  await user.save();
  res.redirect("/account");
});

// Handle post request on account page for change password upate
app.post("/update-password", async (req, res, next) => {});

// Handle post request on account page for member update
app.post("/member", async (req, res, next) => {
  const user = await User.findById(req.user.id);
  var isTrue = req.body.member === "true";
  if (isTrue === false) {
    user.admin = false;
  }
  user.member = isTrue;
  await user.save();
  res.redirect("/account");
});

// Handle post request on admin update
app.post("/admin", async (req, res, next) => {
  const user = await User.findById(req.user.id);
  var isTrue = req.body.admin === "true";
  user.admin = isTrue;
  await user.save();
  res.redirect("/account");
});

// Handle log in
app.post(
  "/log-in",
  passport.authenticate("local", {
    successRedirect: "/posts",
    failureRedirect: "/posts",
  })
);

// Handle log out
app.get("/log-out", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

module.exports = app;
