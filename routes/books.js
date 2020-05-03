/*
APIS for the books go here:

1. Get the list of books in the catalog
2. Get the available list of books
3. Admin API for creating books 
4. Admin API for updating books 
5. Admin API for deleting books 
6. Additional GET for searching by Book_Code,Book_Name,Author or Genre
*/

// Route handlers
const express = require("express");
const router = express.Router();

//import data models
const Books = require("../models/booksSchema");
const Cart = require("../models/cartSchema");
const Users = require("../models/usersSchema");

router.use(function(req, res, next) {
  res.locals.user = req.session.userId;
  res.locals.role = req.session.role;
  next();
});

/*
***********************************************************************
APIS for the admin - Create a book, Modify a book or delete a book
***********************************************************************
*/

/*---------------------------------------------------------------------------
 ADMIN MAINPAGE the books catalog
 --------------------------------------------------------------------------
*/

router.get("/", function(req, res) {
  Users.find({ User_name: req.session.userId }, function(err, user_list) {
    if (user_list.length == 0) {
      return res.redirect("https://webtechteam.glitch.me");
    }
    if (user_list[0].Role == "Admin") {
      Books.find({}, function(err, book_list) {
        if (err || user_list.length == 0) {
          res.render("success", {
            alert: "No Books in the Database"
          });
        }
        res.render("books/books_view_admin", { books: book_list });
      });
    }
  });
});

/*
-----------------------------------------------------------------------------
ADMIN API to CREATE a new entry of the BOOK
------------------------------------------------------------------------------
*/
router.get("/addbook", function(req, res) {
  Users.find({ User_name: req.session.userId }, function(err, user_list) {
    if (user_list.length == 0) {
      return res.redirect("https://webtechteam.glitch.me");
    }
    if (user_list[0].Role == "Admin") {
      res.render("books/books_view_add");
    }
  });
});

router.post("/addbook", function(request, response) {
  let book = request.body;

  if (book.Copies == 0 || book.Available_copies == 0) {
    response.render("books/books_view_add", {
      error_msg:
        "Total Copies & Available Copies should be a minimum 1 to make a valid entry"
    });
  }

  if (book.Copies != book.Available_copies) {
    response.render("books/books_view_add", {
      alert: "Total Copies must be same as available copies!"
    });
    book.Available_copies = book.Copies;
  }

  if (
    Books.countDocuments({ Book_Code: book.Book_Code }, function(err, count) {
      if (err || count > 0) {
        response.render("books/books_view_add", {
          error_msg: "Book entry already exists. Please Make a Valid Entry!"
        });

        return;
      }

      let books_model = new Books(book);
      books_model.save();
      return response.redirect("/books");
    })
  );
});

/*
-----------------------------------------------------------------------------
//API for the ADMIN to UPDATE an existing entry of the book
------------------------------------------------------------------------------
*/

router.get("/:id/editbook", function(request, response) {
  Users.find({ User_name: request.session.userId }, function(err, user_list) {
    if (user_list.length == 0) {
      return response.redirect("https://webtechteam.glitch.me");
    }
    if (user_list[0].Role == "Admin") {
      var input_id = request.params.id;

      Books.find({ Book_Code: input_id }, function(error, book) {
        if (error) {
          response.render("success", {
            error_msg: error
          });
        
        } else {
          response.render("books/books_view_edit", { Books: book[0] });
        }
      });
    }
  });
});

router.post("/editbook", function(request, response) {
  let updated_book = request.body;
  let input_id = request.body.Book_Code;

  if (updated_book.Copies == 0 || updated_book.Available_copies == 0) {
    response.render("success", {
      error_msg:
        "Total Copies & Available Copies should be a minimum 1 to make a valid entry"
    });
    return;
  }
  //This condition checks if the increase between the Total Copies and Available Book is consistent
  Books.find({ Book_Code: input_id }, function(error, original_book) {
    if (error) {
      response.render("success", {
        error_msg:
           error
      });
    }
    //  else if (original_book.length == 0) {
    //   response.render("success", {
    //     error_msg: "Book Not Found"
    //   });
    // } 
    // else if (
    //   original_book[0].Available_copies - updated_book.Available_copies !=
    //   original_book[0].Copies - updated_book.Copies
    // ) {
    //   // request.session.error="Copy1";
    //   // response.redirect("/successscren")
    //  return  response.redirect("success", {
    //     error_msg:
    //       "Make sure you enter the increase between Total Copies and Available Copies correctly"
    //   });
    //   // return;
    // }
  });

  Books.findOneAndUpdate({ Book_Code: input_id }, updated_book, function(err) {
    if (err) {
      response.render("success", {
        error_msg: "Book Not Found"
      });
    }
    return response.redirect("/books");
  });
});

/*
-----------------------------------------------------------------------------
//API for the ADMIN to DELETE an existing entry of the book
------------------------------------------------------------------------------
*/

router.get("/:id/deletebook", function(request, response) {
  Users.find({ User_name: request.session.userId }, function(err, user_list) {
    if (user_list.length == 0) {
      return response.redirect("https://webtechteam.glitch.me");
    }
    if (user_list[0].Role == "Admin") {
      let input_id = request.params.id;
      Books.findOneAndDelete({ Book_Code: input_id }, function(err) {
        if (err) {
          response.render("success", {
            error_msg: "Book Not Found"
          });
        }
        return response.redirect("/books");
      });
    }
  });
});

/*
-----------------------------------------------------------------------------
//API for the READER (USER)to get entry of the book 
------------------------------------------------------------------------------
*/

router.get("/availablebooks", function(req, res) {
  
 // res.json("books");
  Users.find({ User_name: req.session.userId }, function(err, user_list) {
    if (user_list.length == 0) {
      return res.redirect("https://webtechteam.glitch.me");
    }
    //res.json(user_list);
   if (user_list[0].Role == "Reader") {
      Books.find({ Available_copies: { $gt: 0 } }, function(err, book_list) {
        if (err ) {
          res.render("success", {
            error_msg:err
          });
        }
        res.render("books/books_view_user", { books: book_list });
      });
   }
  });
});

/*************************************************************
API to add a book to cart

**************************************************************/


router.get("/:id/addtocart", function(req, res, next) {
  // res.json(req.user);
  var input_id = req.params.id;
  Cart.find({ Code: input_id, User_Name: req.session.userId }, function(
    err,
    cart_details
  ) {
    if (cart_details.length == 1) {
      res.redirect("/cart");
    } else {
      Books.find({ Book_Code: input_id }, function(err, book_details) {
        // res.json(book_details[0]);
        var cartData = {
          User_Name: res.locals.user,
          Code: book_details[0].Book_Code,
          Type: "Book",
          Name: book_details[0].Book_Name,
          Available_copies: book_details[0].Available_copies
        };
        Cart.create(cartData, function(err, user) {
          if (err) {
            res.render("books/books_view_user", {
              error_msg: err
            });
            return next(err);
          } else {
            return res.redirect("/cart");
          }
        });
      });
    }
  });
});

/*************************************************************
API to search for Books by title - User functionality

**************************************************************/
router.post("/search", function(req, res) {
  let search_body = req.body.search;

  Books.find({ Book_Name: new RegExp(search_body, "i") }, function(
    err,
    selectedbooks
  ) {
    if (err) {
      res.render("books/books_view_user", { error_msg: err });
    } else {
      res.render("books/books_view_user", { books: selectedbooks });
    }
  });
});

module.exports = router;
