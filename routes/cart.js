// Route handlers
const express = require("express");
const router = express.Router();

//import data models
const Cart = require("../models/cartSchema");
const Books = require("../models/booksSchema");
const Journals = require("../models/journalsSchema");
const Users = require("../models/usersSchema");

// import data models
router.use(function(req, res, next) {
          res.locals.user = req.session.userId;
          res.locals.role = req.session.role;
          next();
        });

router.get("/", function(request, response) {
  var books_details = [];
  var journal_details = [];
  Cart.find({ User_Name: response.locals.user }, function(err, cart_list) {
    // if (cart_list == null) {
     response.render("cart/cart_view", { cart: cart_list });
  });
   //response.json(books_details);
});

router.get("/clear",function(request,response){
  Cart.deleteMany({User_Name:request.session.userId},function(err,cart_list){
    if (err) {
      response.status(500).send(err);
    } else {
      response.redirect("/cart");
    }
  });
})

router.get("/clearissue",function(request,response){
  Cart.deleteMany({User_Name:request.session.userId},function(err,cart_list){
    if (err) {
      response.status(500).send(err);
    } else {
      response.redirect("/issue");
    }
  });
})

router.get("/:id/delete",function(req,res){
  Cart.deleteMany({User_Name:req.session.userId,Code:req.params.id},function(err,cart_list){
    if (err) {
      res.status(500).send(err);
    } else {
      res.redirect("/cart");
    }
  });
})


module.exports = router;
