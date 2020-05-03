/*
APIS for the users go here

1. GET API for role of Reader to view profile
2. API to edit profile for reader
3. API to edit users for ADMIN
4. API to get all users for admin
5. API to delete users for admin
6. API for registration ? - maybe it goes in auth
*/

// Route handlers
const express = require("express");
const router = express.Router();
const LocalStrategy = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");
var bcrypt = require("bcrypt");
// var flash = require('connect-flash');
// var alert=require('alert-node');
//var popup = require('popups');
// var JSAlert = require("js-alert");

//import data models
const Users = require("../models/usersSchema");

const app = express();
var passport = require("passport");

passport.use(new LocalStrategy(Users.authenticate()));
passport.serializeUser(Users.serializeUser());
passport.deserializeUser(Users.deserializeUser());

router.use(function(req, res, next) {
  res.locals.user = req.session.userId;
  res.locals.role = req.session.role;
  next();
});
/*---------------------------------------------------------------------------
 ADMIN MAINPAGE for all the users in the database
 --------------------------------------------------------------------------
*/

router.get("/allusers", function(req, res) {
  Users.find({ User_name: req.session.userId }, function(err, user_list) {
    if (user_list.length == 0) {
      return res.redirect("https://webtechteam.glitch.me");
    }
    if (user_list[0].Role == "Admin") {
      let input_id = req.params.id;
      Users.find({}, function(err, user_list) {
        res.render("user/user_view_admin", { users: user_list });
      });
    }
  });
});

/*--------------------------------------------------------------------------
 MAINPAGE for the Reader's profile- this is a page to both view and edit profile
 --------------------------------------------------------------------------
*/

router.get("/editprofile", function(req, res) {
  Users.find({ User_name: req.session.userId }, function(err, user_list) {
    if (user_list.length == 0) {
      return res.redirect("https://webtechteam.glitch.me");
    }
    // if (user_list[0].Role == "Reader") {
    var input_id = req.session.userId;

    Users.find({ User_name: input_id }, function(err, user_list) {
      res.render("user/user_view_profile", { users: user_list[0] });
      //res.json(user_list[0]);
    });
    // }
  });
});

/* --------------------------------------------------------------------------
API for ADMIN to create a user
 --------------------------------------------------------------------------
*/

//ADD A NEW USER

router.get("/adduser", function(request, response) {
  Users.find({ User_name: request.session.userId }, function(err, user_list) {
    if (user_list.length == 0) {
      return response.redirect("https://webtechteam.glitch.me");
    }
    if (user_list[0].Role == "Admin") {
      var input_id = request.params.id;

      Users.find({ User_name: input_id }, function(err, user_list) {
        response.render("user/user_view_add");
      });
    }
  });
});

//CREATE A NEW USER

/* POST API to create a new user */
router.post("/adduser", function(request, response) {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1;
  var yyyy = today.getFullYear();
  today = mm + "/" + dd + "/" + yyyy;

  const user = {
    User_name: request.body.User_name,
    Name: request.body.Name,
    Email_Address: request.body.Email_Address,
    Password: request.body.Password,
    Role: request.body.Role,
    Date_created: today
  };
  //response.json(user);
  if (
    Users.countDocuments({ User_name: user.User_name }, function(err, count) {
      if (err || count > 0) {
        response.render("user/user_view_add", {
          error_msg: "User Name Already Exists"
        });
      }
      //response.json(user);
      let user_model = new Users(user);
      user_model.save();
     // response.json(user);
    return response.redirect("/users/allusers");
    })
  );
});

/*
-----------------------------------------------------------------------------
API for EDIT profile for the ADMIN
------------------------------------------------------------------------------
*/
router.get("/:id/edituser", function(request, response) {
  Users.find({ User_name: request.session.userId }, function(err, user_list) {
    if (user_list.length == 0) {
      return response.redirect("https://webtechteam.glitch.me");
    }
    //response.json(user_list);
    if (user_list[0].Role == "Admin") {
      var input_id = request.params.id;
      if(input_id == user_list[0].User_name){
        return response.redirect("/users/allusers");
      }
      //response.json(input_id);
      Users.findOne({ User_name: input_id }, function(error, user) {
        if (error) {
          response.render("user/user_view_admin", { error_msg: error });
        }
        //response.json(user)
        response.render("user/user_view_edit", { users: user });
        // return;
      });
    }
  });
});

/*
-----------------------------------------------------------------------------
API for EDIT profile for the ADMIN
------------------------------------------------------------------------------
*/
router.post("/edituser", function(request, response) {
  let updated_user = request.body;

  if (updated_user.Password == updated_user.confirm_password) {
    Users.find({ User_name: request.session.userId }, function(err, user_list) {
      if (user_list.length == 0) {
        return response.redirect("https://webtechteam.glitch.me");
      }
      //response.json(user_list);
      if (user_list[0].Role == "Admin") {
        var input_id = request.params.id;
        //response.json(input_id);
        Users.findOne({ User_name: updated_user.User_name }, function(
          error,
          old_user
        ) {
          //response.json(updated_user);
          Users.findOneAndUpdate(
            { User_name: updated_user.User_name },
            updated_user,
            function(err) {
              if (err) {
                response.render("success", {
                  error_msg: err
                });
              }
              return response.redirect("/users/allusers");
            }
          );
        });
      }
    });
     } else {
     request.session.error = "password";
          return response.redirect("/successscren");
       // response.render("success", {
       //    error_msg: "Passwords don't match"});
  }
});
/*
-----------------------------------------------------------------------------
API for EDIT profile for the READER & ADMIN
------------------------------------------------------------------------------
*/

router.post("/editprofile", function(request, response) {
  let updated_user = request.body;

  if (updated_user.Password == updated_user.confirm_password) {
    Users.find({ User_name: request.session.userId }, function(err, user_list) {
      if (user_list.length == 0) {
        return response.redirect("https://webtechteam.glitch.me");
      }
      //response.json(user_list);
      
    });

        Users.findOneAndDelete({ User_name: updated_user.User_name }, function(
          err
        ) {
          if (err) {
            response.render("user/user_view_edit", {
              error_msg: "User Name not Found"
            });
          }
          const user = {
            User_name: updated_user.User_name,
            Name: updated_user.Name,
            Email_Address: updated_user.Email_Address,
            Password: updated_user.Password,
            Role: updated_user.Role,
            Date_created: updated_user.Date_created
          };

          let user_model = new Users(user);
          user_model.save();

         response.redirect("/successscren");
       });
     } else {
     request.session.error = "password";
          return response.redirect("/successscren");
       // response.render("success", {
       //    error_msg: "Passwords don't match"});
  }
});



/*
-----------------------------------------------------------------------------
//API for the ADMIN to DELETE an existing user in the database
------------------------------------------------------------------------------
*/

router.get("/:id/deleteuser", function(request, response) {
  Users.find({ User_name: request.session.userId }, function(err, user_list) {
    if (user_list.length == 0) {
      return response.redirect("https://webtechteam.glitch.me");
    }
    if (user_list[0].Role == "Admin") {
      var input_id = request.params.id;
      if(input_id == user_list[0].User_name){
        return response.redirect("/users/allusers");
      }
      Users.findOne({ User_name: input_id }, function(error, user) {
        if (error) {
          response.render("user/user_view_admin", { error_msg: error });
        }  else {
          let input_id = request.params.id;
          Users.findOneAndDelete({ User_name: input_id }, function(err) {
            if (err) {
              response.render("user/user_view_admin", {
                error_msg: "User Name not found"
              });
            }
            return response.redirect("/successscren");
          });
        }
      });
    }
  });
});

/****************************************
 SIGNUP
****************************************/

router.post("/signup", function(req, res, next) {
  if (req.body.Email && req.body.UserName && req.body.Password) {
    var today = new Date();
    var userData = {
      Email_Address: req.body.Email,
      Name: req.body.Name,
      User_name: req.body.UserName,
      Password: req.body.Password,
      Role: "Reader",
      Date_created:
        today.getFullYear() +
        "-" +
        (today.getMonth() + 1) +
        "-" +
        today.getDate()
    };
    if (
      Users.countDocuments({ User_name: userData.User_name }, function(
        err,
        count
      ) {
        if (err || count > 0) {
          req.session.role = "signup";
          return res.redirect("/");
        }
        Users.create(userData, function(err, user) {
          //res.json(userData);
          if (err) {
            return next(err);
          } else {
            req.session.userId = user.User_name;
            req.session.role = user.Role;
            return res.redirect("/successscren");
          }
        });
      })
    );
  } else {
    res.json("Please Enter Values");
  }
});

/****************************************
 LOGIN
****************************************/

router.get("/login", function(req, res) {
  res.render("index");
});
router.post("/login", function(req, res, next) {
  Users.findOne({ Email_Address: req.body.Email }, function(error, user) {
    // Users.static.authenticate(req.body.Email, req.body.Password, function (error, user) {
    if (error || !user) {
      // var err = new Error("Wrong email or password.");
      // err.status = 401;
      // return next(err);
      req.session.role = "login";
      return res.redirect("/");
      // req.flash("success_msg", "You are registered and can now log in");
      // return res.redirect("/users/error");
      //res.json("sorry");
      // return res.redirect("/",{error_msg:err});
      //res.render("index",{error_msg:"hello"});
    } else {
      bcrypt.compare(req.body.Password, user.Password, function(err, result) {
        if (result === true) {
          req.session.userId = user.User_name;
          req.session.role = user.Role;
          return res.redirect("/successscren");
        } else {
          req.session.role = "login";
          return res.redirect("/");
        }
      });
    }
  });
});

module.exports = router;
