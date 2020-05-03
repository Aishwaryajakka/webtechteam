/* Contains all the routes */
const express = require("express");
const app = express();

const indexRouter = require("./routes/index");
const booksRouter = require("./routes/books");
const journalsRouter = require("./routes/journals");
const usersRouter = require("./routes/users");
const issuanceRouter = require("./routes/issuance");
const success=require("./routes/success");
const cartRouter = require("./routes/cart");

//Define all the routers
app.use("/", indexRouter);
app.use("/books", booksRouter);
app.use("/journals", journalsRouter);
app.use("/users", usersRouter);
app.use("/issue", issuanceRouter);
app.use("/cart",cartRouter);

module.exports = app;