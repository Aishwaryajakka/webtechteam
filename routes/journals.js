/*
APIS for the Journals go here

1. Get the list of Journals in the catalog - Both Reader & Admin
2. Get the available list of Journals - Both Reader & Admin
3. Admin API for creating Journals -> both available_journals & journals collection is affected
4. Admin API for updating Journals -> both available_journals & journals collection is affected
5. Admin API for deleting Journals -> both available_journals & journals collection is affected
6. Addtional GET for searching by Journal_Name
*/

// Route handlers
const express = require("express");
const router = express.Router();

//import data models
const Journals = require("../models/journalsSchema");
const Cart = require("../models/cartSchema");
const Users = require("../models/usersSchema");

router.use(function(req, res, next) {
  res.locals.user = req.session.userId;
  res.locals.role = req.session.role;
  next();
});

/*
-----------------------------------------------------------------------------
//API for the user to get entry of the journals 
------------------------------------------------------------------------------
*/

router.get("/availablejournals", function(req, res) {
  Users.find({ User_name: req.session.userId }, function(err, user_list) {
    //res.json("journals")
    if (user_list.length == 0) {
      return res.redirect("https://webtechteam.glitch.me");
    }
    if (user_list[0].Role == "Reader") {
      Journals.find({ Available_copies: { $gt: 0 } }, function(
        err,
        journal_list
      ) {
       // res.json(journal_list);
        if (err ) {
          res.render("success", {
            error_msg:err
          });
        }
        res.render("journals/journals_view_user", { journals: journal_list });
     });
    }
   });
});

/*
***********************************************************************
APIS for the admin - Create a journal, Modify a journal or delete a journal
***********************************************************************
*/

/*---------------------------------------------------------------------------
 ADMIN MAINPAGE the Journal catalog
 --------------------------------------------------------------------------
*/

router.get("/", function(req, res) {
  Users.find({ User_name: req.session.userId }, function(err, user_list) {
    if (user_list.length == 0) {
      return res.redirect("https://webtechteam.glitch.me");
    }
    if (user_list[0].Role == "Admin") {
      Journals.find({}, function(err, journal_list) {
        if (err || journal_list.length == 0) {
          res.render("success", {
            alert: "There are no available Journals in the database."
          });
        }
        res.render("journals/journals_view_admin", { journals: journal_list });
      });
    }
  });
});

/*
-----------------------------------------------------------------------------
ADMIN API to CREATE a new entry of the Journal
------------------------------------------------------------------------------
*/
router.get("/addjournal", function(req, res) {
  Users.find({ User_name: req.session.userId }, function(err, user_list) {
    if (user_list.length == 0) {
      return res.redirect("https://webtechteam.glitch.me");
    }
    if (user_list[0].Role == "Admin") {
      res.render("journals/journals_view_add");
    }
  });
});

router.post("/addjournal", function(request, response) {
  let journal = request.body;

  if (journal.Copies == 0 || journal.Available_copies == 0) {
    response.render("journals/journals_view_add", {
      error_msg:
        "Total Copies & Available Copies should be a minimum 1 to make a valid entry"
    });
    return;
  }

  // if (journal.Copies != journal.Available_copies) {
  //   response.render("journals/journals_view_add", {
  //     alert: "Total Copies must be same as available copies!"
  //   });
  //   journal.Available_copies = journal.Copies;
  // }

  if (
    Journals.countDocuments({ Journal_Code: journal.Journal_Code }, function(
      err,
      count
    ) {
      if (err || count > 0) {
        response.render("journals/journals_view_add", {
          error_msg: "Journal entry already exists. Please Make a Valid Entry!"
        });
        return;
      }

      let journals_model = new Journals(journal);
      journals_model.save();
      return response.redirect("/journals");
    })
  );
});

/*
-----------------------------------------------------------------------------
//API for the admin to UPDATE an existing entry of the journal
------------------------------------------------------------------------------
*/

router.get("/:id/editjournal", function(request, response) {
  Users.find({ User_name: request.session.userId }, function(err, user_list) {
    if (user_list.length == 0) {
      return response.redirect("https://webtechteam.glitch.me");
    }
    if (user_list[0].Role == "Admin") {
      var input_id = request.params.id;

      Journals.find({ Journal_Code: input_id }, function(error, journal) {
        if (error) {
          response.render("success", { error_msg: error });
        } else if (journal.length == 0) {
          response.render("success", { error_msg: "Journal Entry not Found" });
        } else {
          response.render("journals/journals_view_edit", {
            Journals: journal[0]
          });
        }
      });
    }
  });
});

router.post("/editjournal", function(request, response) {
  let updated_journal = request.body;
  let input_id = updated_journal.Journal_Code;

//   if (updated_journal.Copies == 0 || updated_journal.Available_copies == 0) {
//     response.render("journals/journals_view_edit", {
//       error_msg:
//         "Total Copies & Available Copies should be a minimum 1 to make a valid entry"
//     });

//     return;
//   }
  //This condition checks if the increase between the Total Copies and Available Journals are consistent

  Journals.find({ Journal_Code: input_id }, function(error, original_journal) {
    if (error) {
      response.render("success", {
        error_msg: error
      });
      
    // } else if (original_journal.length == 0) {
    //   response.render("journals/journals_view_edit", {
    //     error_msg: "Journal not Found"
    //   });
    // } else if (
    //   original_journal[0].Available_copies - updated_journal.Available_copies !=
    //   original_journal[0].Copies - updated_journal.Copies
    // ) {
    //   response.redirect("/journals");
    //   // response.render("journals/journals_view_edit", {
    //   //   error_msg:
    //   //     "Make sure you enter the increase between Total Copies and Available Copies correctly"
    //   // });
    // //   return;
    }
  });

  Journals.findOneAndUpdate(
    { Journal_Code: input_id },
    updated_journal,
    function(err) {
      if (err) {
        response.render("success", {
          error_msg: err
        });
      }
      return response.redirect("/journals");
    }
  );
});

/*
-----------------------------------------------------------------------------
//API for the admin to DELETE an existing entry of the book
------------------------------------------------------------------------------
*/

router.get("/:id/deletejournal", function(request, response) {
  Users.find({ User_name: request.session.userId }, function(err, user_list) {
    if (user_list.length == 0) {
      return response.redirect("https://webtechteam.glitch.me");
    }
    if (user_list[0].Role == "Admin") {
      let input_id = request.params.id;
      Journals.findOneAndDelete({ Journal_Code: input_id }, function(err) {
        if (err) {
        response.render("success", {
          error_msg: err
        });
      }
        return response.redirect("/journals");
      });
    }
  });
});

/*
-----------------------------------------------------------------------------
//API for the READER for add the journal to cart
------------------------------------------------------------------------------
*/

router.get("/:id/addtocart", function(req, res, next) {
  var input_id = req.params.id;
  Cart.find({ Code: input_id, User_Name: req.session.userId }, function(
    err,
    cart_details
  ) {
    if (cart_details.length == 1) {
      res.render("success",{success_msg:"cart has the item"});
    } else {
      Journals.find({ Journal_Code: input_id }, function(err, journal_details) {
        var cartData = {
          User_Name: res.locals.user,
          Code: journal_details[0].Journal_Code,
          Type: "Journal",
          Name: journal_details[0].Journal_Name,
          Available_copies: journal_details[0].Available_copies
        };
        Cart.create(cartData, function(err, user) {
          if (err) {
            res.render("success", {
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

/*
-----------------------------------------------------------------------------
//API for the user to search for journals by title
------------------------------------------------------------------------------
*/

router.get("/search/:name", function(req, res) {
  Journals.find({ Journal_Name: new RegExp(req.params.name, "i") }, function(
    err,
    selectedjournals
  ) {
    if (err) {
      res.render("success", {
        error_msg: err
      });
    }  else {
      res.render("journals/journals_view_user", { journals: selectedjournals });
    }
  });
});

module.exports = router;
