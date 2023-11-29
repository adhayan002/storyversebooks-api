const express = require('express');
const passport=require('passport')
const jwt = require('jsonwebtoken');
const clientURL='http://localhost:5173/'

const router = express.Router();

router.get('/login/success', (req, res) => {
    if (req.user) {
      res.status(200).json({ user: req.user });
      // Remove the undefined 'jw' variable
    } else {
      res.status(401).json({ message: "Not Authorized" });
    }
  });

router.get('/login/failed',(req,res)=>{
    res.status(401).json({message:"Log In Failure"})
})

router.get('/google',
  passport.authenticate('google', { scope: ['profile','email'] }));

  router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login/failed' }),
  (req, res) => {
    // Successful authentication, set the JWT token in an HTTP-only cookie
    const token = req.user.token;
    res.cookie('accessToken', token, { httpOnly: true });

    // Redirect to the client URL
    res.redirect(clientURL);
  });

router.get('/logout',(req,res)=>{
    req.logout({},(err)=>{
        if(err) return res.status(500).json({message:"Something wen wrong"})
        res.redirect(clientURL)
    })
})

module.exports = router;