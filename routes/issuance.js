/* APIS for ISSUANCE 

1. API to get the list of issued books Admin
2. API to view issue a book for user
4. API for add a book to card and checkout
6. API to get the list of issued journals Admin
7. API to view issued a journals for user
9. API for add a journal to card and checkout
*/
// Route handlers
const express = require("express");
const router = express.Router();
const passport = require("passport");

//import data models
const Issues = require("../models/issuesSchema");
const Journals = require("../models/journalsSchema");
const Books = require("../models/booksSchema");
const Cart = require("../models/cartSchema");
const Users = require("../models/usersSchema");

router.use(function(req, res, next) {
  res.locals.user = req.session.userId;
  res.locals.role = req.session.role;
  next();
});

router.get("/", function(req, res) {
  Users.find({ User_name: req.session.userId }, function(err, user_list) {
    if (user_list.length == 0) {
      return res.redirect("https://webtechteam.glitch.me");
    }
    if (user_list[0].Role == "Admin") {
      Issues.find({}, function(err, issue_list) {
        res.render("issue/issueAdmin", { issue: issue_list });
      });
    }
    else {
      Issues.find({User_Name: req.session.userId }, function(err, issue_list) {
        res.render("issue", { issue: issue_list });
      });
    }
  });
});


router.get("/checkout", function(req, res, next) {
  var book_list = [];
  var journal_list = [];
  Cart.find({ User_Name: req.session.userId }, function(err, cart_list) {
    for (let i = 0; i < cart_list.length; i++) {
      if (cart_list[i].Type == "Book") {
        let update = { Available_copies: cart_list[i].Available_copies - 1 };
        let filter = { Book_Code: cart_list[i].Code };
        let doc = Books.findOneAndUpdate(filter, update, function(err, book) {
          if (err) {
            res.status(500).send(err);
          } else {
            var today = new Date();
            var IssueData = {
              User_Name: res.locals.user,
              Code: cart_list[i].Code,
              Type: "Book",
              Name: cart_list[i].Name,
              Available_copies: cart_list[i].Available_copies,
              Issue_Date:
                today.getFullYear() +
                "-" +
                (today.getMonth() + 1) +
                "-" +
                today.getDate(),
              Return_Date:
                today.getFullYear() +
                "-" +
                (today.getMonth() + 2) +
                "-" +
                today.getDate()
            };
            Issues.create(IssueData, function(err, user) {
              if (err) {
                return next(err);
              } else {
              }
            });
          }
        });
      } else {
        let update = { Available_copies: cart_list[i].Available_copies - 1 };
        let filter = { Journal_Code: cart_list[i].Code };
        let doc = Journals.findOneAndUpdate(filter, update, function(
          err,
          journal_list
        ) {
          if (err) {
            res.status(500).send(err);
          } else {
            var today = new Date();
            var IssueData = {
              User_Name: res.locals.user,
              Code: cart_list[i].Code,
              Type: "Journals",
              Name: cart_list[i].Name,
              Available_copies: cart_list[i].Available_copies,
              Issue_Date:
                today.getFullYear() +
                "-" +
                (today.getMonth() + 1) +
                "-" +
                today.getDate(),
              Return_Date:
                today.getFullYear() +
                "-" +
                (today.getMonth() + 2) +
                "-" +
                today.getDate()
            };
            Issues.create(IssueData, function(err, user) {
              if (err) {
                return next(err);
              } else {
              }
            });
          }
        });
      }
    }

    res.redirect("/cart/clearissue");
  });
});

router.get("/:id/delete", function(req, res) {
  Users.find({ User_name: req.session.userId }, function(err, user_list) {
    if (user_list.length == 0) {
      return res.redirect("https://webtechteam.glitch.me");
    }
    if (user_list[0].Role == "Admin") {
      Issues.findByIdAndRemove(req.params.id, function(err, issue_list) {
        if(issue_list.Type=="Book"){
          Books.findOneAndUpdate({ Book_Code: issue_list.Code}, {$inc: {Available_copies: 1}}, function(err, book) {
          if (err) {
            res.status(500).send(err);
          } else {
            return res.redirect("/issue");
          }
          });
        }
        else{
          Journals.findOneAndUpdate({ Journal_Code: issue_list.Code}, {$inc: {Available_copies: 1}}, function(err, book) {
          if (err) {
            res.status(500).send(err);
          } else {
            return res.redirect("/issue");
          }
          });
        }
        // res.json(issue_list.Type);
        // return res.redirect("/issue");
      });
    }
  });
});



module.exports = router;
