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
const { body, validationResult } = require("express-validator");
require("dotenv").config();
const compression = require("compression");
const helmet = require("helmet");
const RateLimit = require("express-rate-limit");

const mongoDb = process.env.MONGODB_URI;
mongoose.connect(mongoDb);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));

const app = express();

// Compress all routes
app.use(compression());

// Add helmet to the middleware chain.
app.use(helmet());
app.use(helmet.crossOriginEmbedderPolicy({ policy: "credentialless" }));
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    originAgentCluster: true,
  })
);
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      "img-src": ["'self'", "https:", "data:", "blob:"],
    },
  })
);

// Set up rate limiter: maximum of twenty requests per minute
const limiter = RateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 200,
  validate: { xForwardedForHeader: false },
});
// Apply rate limiter to all requests
app.use(limiter);
app.set("trust proxy", 1);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static("public"));

app.use(
  session({
    secret: process.env.SESSIONS_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

// Redirect to posts page
app.get("/", (req, res) => {
  res.redirect("/posts");
});

// Handle get request on posts page
app.get("/posts", async (req, res) => {
  if (req.user) {
    const posts = await Post.find({}, "title message time author")
      .sort({ time: -1 })
      .populate("author")
      .exec();

    res.render("index", { user: req.user, posts: posts });
  } else {
    res.render("index", { user: req.user });
  }
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
app.post("/sign-up", [
  // Validate fields
  body("first_name", "First name must contain at least 2 characters")
    .trim()
    .isLength({ min: 2, max: 35 })
    .escape(),
  body("last_name", "Last name must contain at least 2 characters")
    .trim()
    .isLength({ min: 2, max: 35 })
    .escape(),
  body("email", "Email must be in valid format (Ex. email@website.com)")
    .isEmail()
    .escape(),
  body(
    "password",
    "Password must be at least 8 characters and have one uppercase letter, one lowercase letter, one number, and one special character"
  ).matches(/^(?=.{8,})(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d@$.!%*#?&]/),
  body(
    "confirm",
    "Passwords don't match... Please check password fields"
  ).custom((value, { req, loc, path }) => {
    if (value !== req.body.password) {
      // trow error if passwords do not match
      throw new Error("Passwords don't match... Please check password fields");
    } else {
      return value;
    }
  }),

  async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);
    const userExists = await User.findOne({ email: req.body.email });
    if (!errors.isEmpty()) {
      if (userExists) {
        res.render("sign-up-form", {
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          email: req.body.email,
          errors: errors.array(),
          userExists: userExists,
        });
        return;
      } else {
        res.render("sign-up-form", {
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          email: req.body.email,
          errors: errors.array(),
        });
        return;
      }
    }
    if (userExists) {
      res.render("sign-up-form", {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        userExists: userExists,
      });
      return;
    }

    bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
      // if err, do something
      if (err) {
        res.redirect("/sign-up");
        return;
      }
      // otherwise, store hashedPassword in DB
      else {
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
          return done(err);
        }
      }
    });
  },
]);

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
          return done(null, false, {
            message: "Incorrect username... Please try again",
          });
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          return done(null, false, {
            message: "Incorrect password... Please try again",
          });
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
app.post("/posts/create", [
  // Validate and sanitize the fields.
  body(
    "title",
    "Title must contain at least 2 characters and no more than 200 characters"
  )
    .trim()
    .isLength({ min: 2, max: 200 })
    .escape(),
  body(
    "message",
    "Message must contain at least 2 characters and no more than 1000 characters"
  )
    .trim()
    .isLength({ min: 2, max: 1000 })
    .escape(),

  async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render("post-form", {
        user: req.user,
        title: req.body.title,
        message: req.body.message,
        errors: errors.array(),
      });
    } else {
      const post = new Post({
        title: req.body.title,
        message: req.body.message,
        time: Date.now(),
        author: req.user.id,
      });
      const result = await post.save();
      res.redirect("/posts");
    }
  },
]);

// Handle post request on account page for first name update
app.post("/update/first-name", [
  // Validate and sanitize the first name field.
  body("first_name", "First name must contain at least 2 characters")
    .trim()
    .isLength({ min: 2, max: 35 })
    .escape(),

  async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("account", {
        user: req.user,
        firstNameErrors: errors.array(),
      });
      return;
    } else {
      const user = await User.findById(req.user.id);
      user.first_name = req.body.first_name;
      await user.save();
      res.redirect("/account");
    }
  },
]);

// Handle post request on account page for last name update
app.post("/update/last-name", [
  // Validate and sanitize the last name field.
  body("last_name", "Last name must contain at least 2 characters")
    .trim()
    .isLength({ min: 2, max: 35 })
    .escape(),

  async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("account", {
        user: req.user,
        lastNameErrors: errors.array(),
      });
      return;
    } else {
      const user = await User.findById(req.user.id);
      user.last_name = req.body.last_name;
      await user.save();
      res.redirect("/account");
    }
  },
]);

// Handle post request on account page for change password upate
app.post("/update-password", [
  body(
    "newPassword",
    "New password must be at least 8 characters and have one uppercase letter, one lowercase letter, one number, and one special character"
  ).matches(/^(?=.{8,})(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d@$.!%*#?&]/),
  body(
    "confirm",
    "Passwords don't match... Please check new password and confirm fields"
  ).custom((value, { req, loc, path }) => {
    if (value !== req.body.newPassword) {
      // trow error if passwords do not match
      throw new Error(
        "Passwords don't match... Please check new password and confirm fields"
      );
    } else {
      return value;
    }
  }),

  async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    const user = await User.findById(req.user.id);
    const match = await bcrypt.compare(req.body.password, user.password);

    if (errors.isEmpty() && match) {
      bcrypt.hash(req.body.newPassword, 10, async (err, hashedPassword) => {
        // if err, do something
        if (err) {
          res.redirect("/sign-up");
          return;
        }
        // otherwise, store hashedPassword in DB
        else {
          try {
            user.password = hashedPassword;
            await user.save();
            res.redirect("/account");
          } catch (err) {
            return done(err);
          }
        }
      });
      return;
    } else {
      res.render("account", {
        user: req.user,
        passwordErrors: errors.array(),
        passwordMatch: match,
      });
    }
  },
]);

// Handle post request on account page for member update
app.post("/account/member", [
  // Validate and sanitize the member password field.
  body(
    "member-password",
    "Incorrect member password... Please try again"
  ).equals(process.env.MEMBER_PASSWORD),
  async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("account", {
        user: req.user,
        memberErrors: errors.array(),
      });
      return;
    } else {
      const user = await User.findById(req.user.id);
      var isTrue = req.body.member === "true";
      if (isTrue === false) {
        user.admin = false;
      }
      user.member = isTrue;
      await user.save();
      res.redirect("/account");
    }
  },
]);

// Handle post request on admin update
app.post("/account/admin", [
  // Validate and sanitize the admin password field.
  body("admin-password", "Incorrect admin password... Please try again").equals(
    process.env.ADMIN_PASSWORD
  ),

  async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("account", {
        user: req.user,
        adminErrors: errors.array(),
      });
      return;
    } else {
      const user = await User.findById(req.user.id);
      var isTrue = req.body.admin === "true";
      user.admin = isTrue;
      await user.save();
      res.redirect("/account");
    }
  },
]);

// Handle post request on post delete
app.post("/delete/:id", [
  // Validate and sanitize the admin password field.
  body(
    "delete-password",
    "Incorrect admin password... Please try again"
  ).equals(process.env.ADMIN_PASSWORD),
  async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    const posts = await Post.find({}, "title message time author")
      .sort({ time: -1 })
      .populate("author")
      .exec();

    if (!errors.isEmpty()) {
      res.render("index", {
        user: req.user,
        posts: posts,
        formOpen: true,
        deleteErrors: errors.array(),
      });
    } else {
      const post = await Post.findByIdAndDelete(req.params.id);
      res.redirect("/posts");
    }
  },
]);

// Handle log in on get
app.get("/log-in", (req, res) => {
  res.redirect("/posts");
});

// Handle log in on post
app.post("/log-in", (req, res) => {
  passport.authenticate(
    "local",
    { successRedirect: "/posts", failureRedirect: "/posts" },
    async function (err, user, options) {
      if (!user) {
        res.render("index", {
          user: req.user,
          email: req.body.email,
          loginErrors: options,
        });
        return;
      } else {
        req.login(user, async function (err) {
          if (err) {
            return next(err);
          }
          return res.redirect("/posts");
        });
      }
    }
  )(req, res);
});

// Handle log out on get
app.get("/log-out", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

module.exports = app;
