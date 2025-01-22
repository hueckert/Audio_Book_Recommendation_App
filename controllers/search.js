////////////////////////
// Setup - Import deps and create app object
////////////////////////
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const mongoose = require("mongoose")

const User = require('../models/user.js');
const session = require('express-session');


//////////////////////
// Declare Middleware
//////////////////////
router.use(express.urlencoded({extended:true}))


router.post("/", async(req,res) => {
    try {
        const keyWordInput = req.body.keyWordInput
        let books = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${keyWordInput}&download=epub&key=${process.env.API_KEY}`)
        let booksData = await books.json()
        let bookList =[]
        booksData.items.forEach((item) => {
            bookList.push(item.volumeInfo)
        })
    
    
        res.render("search/searchResults.ejs", {
            bookList
        });

    } catch(error) {
        console.log(error);
        res.redirect('/')
      }
})

module.exports = router;