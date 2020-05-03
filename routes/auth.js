const express = require("express");
const router = express.Router();
const LocalStrategy = require("passport-local"); 
const passportLocalMongoose   = require("passport-local-mongoose");