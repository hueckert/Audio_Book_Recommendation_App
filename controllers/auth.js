const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const User = require('../models/user.js');

router.get("/sign-in", (req,res) => {
    res.render("auth/sign-in.ejs")
})

router.get("/sign-up", (req,res) => {
    res.render("auth/sign-up.ejs")
})


router.post("/sign-up", async (req,res) => {
    try {
        const userExist = await User.findOne({ username: req.body.username });
        
        if (userExist) {
          return res.send('Username already taken, please try another one.');
        }

        if (req.body.password !== req.body.confirmPassword) {
          return res.send('Password and Confirm Password must match');
        }
      
        //Hash the password before sending to the database
        const hashedPassword = bcrypt.hashSync(req.body.password, 10);
        req.body.password = hashedPassword;
      
        // All ready to create the new user!
        await User.create(req.body);
      
        res.redirect('/auth/sign-in');

      } catch (error) {
        console.log(error);
        res.redirect('/');
      }
})

router.post("/sign-in", async (req,res) => {
    try {
        // First, get the user from the database
        const userInDatabase = await User.findOne({ username: req.body.username });
        if (!userInDatabase) {
          return res.send('Login failed. Please try again.');
        }
      
        // There is a user! Time to test their password with bcrypt
        const validPassword = bcrypt.compareSync(
          req.body.password,
          userInDatabase.password
        );
        if (!validPassword) {
          return res.send('Login failed. Please try again.');
        }
      
        req.session.user = {
          username: userInDatabase.username,
          _id: userInDatabase._id
        };
      
        res.redirect('/');
      } catch (error) {
        console.log(error);
        res.redirect('/');
      }

})

router.get("/sign-out", (req,res) => {
  req.session.destroy();
  res.redirect("/")
})

module.exports = router;
//! why do we export here