// server.js
// where your node app starts

// init project
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const Users = require("./models/usersSchema");
var session = require("express-session");
//const findOrCreate = require('mongoose-findorcreate')

//Google Authentication
var passport = require("passport");
var GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL:
        "https://" +
        process.env.PROJECT_DOMAIN +
        ".glitch.me/login/google/return",
      scope: "https://www.googleapis.com/auth/plus.login"
    },
    function(accessToken, refreshToken, profile, done) {
      // Users.findOrCreate({ User_name: profile.id }, function (err, user) {
      // return done(err, user);
      // });
      return done(null, profile);
    }
  )
);
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

//mongodb
const mongoDB =
  "mongodb+srv://" +
  process.env.USERNAME +
  ":" +
  process.env.PASSWORD +
  "@" +
  process.env.HOST +
  "/" +
  process.env.DATABASE;
mongoose.connect(mongoDB, { useNewUrlParser: true, retryWrites: true });

const app = express();
//use the static files in the public folder

app.use(express.static("public"));

//tell express where to get your views and which template engine to use
app.set("views", __dirname + "/views/");
app.set("view engine", "ejs");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(passport.initialize());
//app.use(passport.session());
app.use(
  session({
    secret: "Hello World, this is a session",
    resave: false,
    saveUninitialized: false
  })
);
// var uuidv4 = require('uuid/v4');
// app.use(session({
//    secret:"Hello World, this is a session",
//    resave: false,
//   saveUninitialized: false,
//   genid: function(req) {
//   	return uuidv4()
//   }
// }))
app.use(function(req, res, next) {
  res.locals.user = req.session.userId;
  res.locals.role = req.session.Role;
  next();
});
app.get("/logoff", function(req, res, next) {
  if (req.session) {
    // delete session object
    req.session.destroy(function(err) {
      if (err) {
        return next(err);
      } else {
        return res.redirect("/");
      }
    });
  }
});
// app.get('/auth/google', passport.authenticate('google',{scope:['profile']}));
// app.get('/login/google/return',
//   passport.authenticate('google',
//     { successRedirect: '/setcookie', failureRedirect: '/' }
//   )
// );
// app.get('/auth/google', passport.authenticate('google'));
const routes = require("./route");
//Define all the routers

app.get(
  "/login/google/return",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function(req, res) {
    res.redirect("/routes/success");
  }
);
// on successful auth, a cookie is set before redirecting
// // to the success view
// app.get('/setcookie', requireUser,
//   function(req, res) {
//       req.session.user = req.user;
//       res.cookie('google-passport-example', new Date());
//       res.redirect('/success');

//   }
// );
function requireUser(req, res, next) {
  if (!req.user) {
    res.redirect("/successscren");
  } else {
    next();
  }
}
// if cookie exists, success. otherwise, user is redirected to index
// app.get('/routes/success', requireLogin,
//   function(req, res) {
//     res.direct('/successscren');
//   }
// );
// function requireLogin (req, res, next) {
//   if (!req.cookies['google-passport-example']) {
//     res.redirect('/');
//   } else {
//     next();
//   }
// };
const success = require("./routes/success");
app.use("/successscren", success);

app.get("/error", function(req, res) {
  res.json("error");
});

//Define all the routers
app.use("/", routes);

//error check for 404 not found
app.get("*", function(req, res) {
  res.status("404: page not found", 404);
});

// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
});
