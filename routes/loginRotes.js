const express = require('express');
const router = express.Router({ mergeParams: true });
const User=require('../models/userModel')
const passport=require('passport');
const {isLoggedIn}=require('../middleware');



//User-Routes
router.get('/signup',(req,res)=>{
res.render('pages/signup.ejs')
})


//Post-signup
router.post('/signup',async (req,res)=>{
try{
let{name,username,email,password,picture}=req.body;
let regUser=new User({name,username,email,picture});
let user=await User.register(regUser,password);
req.logIn(user,()=>{
req.flash('success','User Register Successfully, You have been Login')
res.redirect('/')
})
  }catch(err){
    req.flash('error',err.message);
    res.redirect('/signup')
  }
})


//Get-login
router.get('/login',(req,res)=>{
res.render('pages/login.ejs')
})

//Post-login
router.post('/login', 
  passport.authenticate('local', {
     failureRedirect: '/login',
     failureFlash:true
     }),
  function(req, res) {
    req.flash('success',"Welcome, Login SuccessFull")
    res.redirect('/');
});

router.get('/logout',isLoggedIn,(req,res)=>{
req.logOut((err)=>{
  req.flash('error',"You Logout Successfully")
res.redirect('/login')
})
});


module.exports=router;