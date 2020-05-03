// Route handlers
const express = require("express");
const router = express.Router();

//import data models
router.use(function(req, res, next) {
          res.locals.user = req.session.userId;
          res.locals.role = req.session.role;
          next();
        });

router.get("/", function(request, response) {
  if(request.session.error=="password"){
   request.session.error=null;
  response.render("success", {
    error_msg: "Password Don't match"
  });
  }
  else if(request.session.error=="copy1"){
   request.session.error=null;
  response.render("success", {
    error_msg: "Make sure you enter the increase between Total Copies and Available Copies correctly"
  });
  }
  else{
  response.render("success", {
    //success_msg: "Hey everyone! This is my webpage."
  });
  }
});

module.exports = router;
