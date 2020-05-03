
// Route handlers
const express = require("express");
const router = express.Router();

//import data models
const Users = require("../models/usersSchema");

// import data models
router.use(function(req, res, next) {
          res.locals.user = req.session.userId;
          res.locals.role = req.session.role;
          next();
        });

// router.get("/", function(request, response) {
//   response.render("index", {
//     message: "Hey everyone! This is my webpage."
//   });
// });
router.get("/", function(request, response) {
 if(request.session.role=="login"){
   request.session.role=null;
  response.render("index", {
    error_msg: "Wrong email and password"
  });
  }
  else if(request.session.role=="signup"){
    request.session.role=null;
  response.render("index", {
    error_msg: "Id already exists"
  });
  }
  else {
    response.render("index");
  }
});

module.exports = router;
