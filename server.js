////////////////////////
//* Setup - Import deps and create app object
////////////////////////
//impirt used libraries
const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();

const mongoose = require("mongoose");
const morgan = require("morgan");
const methodOverride = require("method-override");
const session = require('express-session');
const bcrypt = require('bcrypt');

const isSignedIn = require('./middleware/is-sign-in.js');
const passUserToView = require('./middleware/pass-user-to-view.js');


//import dataSchema
const User = require('./models/user.js');
const authController = require('./controllers/auth.js');
const bookappController = require("./controllers/bookapp.js")
const searchController = require("./controllers/search.js")


//set up PORT 3000
const port = process.env.PORT ? process.env.PORT : "3000";

const path = require('path');

//set up mongoose database
mongoose.connect(process.env.MONGODB_URI);

//test if it connect to the right database
mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});



//////////////////////
//* Declare Middleware
//////////////////////
// Middleware to parse URL-encoded data from forms
app.use(express.urlencoded({ extended: false }));
// Middleware for using HTTP verbs such as PUT or DELETE
app.use(methodOverride("_method"));
// Morgan for logging HTTP requests
app.use(morgan('dev'));
// Session allows the creation and storage of the session data used for authentication or user preferences. 
app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
    })
  );
  
app.use(express.static(path.join(__dirname, 'public')));



app.get("/", async (req, res) => {
  const allUsers = await User.find({}).populate("books")
  const allBooks =[]
  const homepageBooks = []

  allUsers.forEach((user) => {
    allBooks.push(user.books)
    user.books.forEach((book) => {
      const homepageBook = {
        _id: book._id,
        owner: user._id,
        name: book.name,
        category: book.category,
        comment: book.comment,
        likes: book.likes,
      }
      homepageBooks.push(homepageBook)   
    })



  })
  


  console.log(homepageBooks)
  res.render("index.ejs", {
    user: req.session.user,
    homepageBooks
  });
});


app.post("/like/:userId/:bookId", async (req,res)=>{
  try {
    const user = await User.findById(req.params.userId)
    
    const book = user.books.filter((book)=>{
      return book._id.toString() === req.params.bookId
    })
  
    book[0].likes.push(req.session.user.username)
    user.save()
      res.redirect('/');
    } catch (error) {
      console.log(error);
      res.redirect('/')
    }

  })

app.put("/like/:userId/:bookId", async (req,res)=>{
  try {
    const user = await User.findById(req.params.userId)
    
    const book = user.books.filter((book)=>{
      return book._id.toString() === req.params.bookId
    })
    const index = book[0].likes.indexOf(req.session.user)
  
    book[0].likes.splice(index,1)
    user.save()
      res.redirect('/');
    } catch (error) {
      console.log(error);
      res.redirect('/')
    }

  })
  
app.use(passUserToView);
//use controller js to maager /auth router
app.use('/auth', authController);
// app.use(isSignedIn); //!isSignIn here
app.use('/users/:userId/bookapp', bookappController);

//!search feature from here
app.use('/search', searchController);


///////////////////////
// Declare Routes and Routers 
///////////////////////
// INDUCES - Index, New, Delete, Update, Create, Edit, Show


///////////////////////////
// Server Listener
///////////////////////////
app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});