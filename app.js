const express = require('express');
const app = express();
const Feed=require('./models/feedModel')
const User=require('./models/userModel')
var session = require('express-session')
const passport=require('passport');
var flash = require('connect-flash');
const LocalStrategy=require('passport-local')
const {isLoggedIn}=require('./middleware');
const login=require('./routes/loginRotes')
//MiddleWares
const path = require('path');
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname,'public' )));
app.use(express.json());
const ejsMate=require('ejs-mate');
app.engine('ejs',ejsMate);




//Session-Expires
app.use(session({ secret: 'r5hf#brk', resave: false, saveUninitialized: true, cookie: { secure: false, maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true } }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

//MiidleWares
app.use((req,res,next)=>{
res.locals.success=req.flash('success');
res.locals.error=req.flash('error');
res.locals.currentUser=req.user;
next();
})




//Authentication

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Login-Router
app.use('/',login)
//Routes
app.get('/',isLoggedIn,async (req,res)=>{
let allFeed=await Feed.find({}).populate('owner')
res.render('pages/index.ejs',{allFeed});
})


//Get-Index-Request
app.get('/feed',isLoggedIn, (req, res) => {
res.render('pages/add.ejs');
});
 

// Post-Index-Request
app.post('/feed',isLoggedIn,async (req, res) => {
let {feed}=req.body;
const post=new Feed(feed);
post.owner=req.user._id;
post.postedAt=new Date();
await post.save();
res.redirect('/')
});




//get-Search-Route
app.get('/search',isLoggedIn,async (req,res)=>{
let{username}=req.query;
let user=await User.find({username});
if(user.length===0){
return res.render('pages/nodata.ejs',{user:"No Data Found"}); 
}
res.render('pages/searchpage.ejs',{user}); 
})



//Details-Profile-Route
app.get('/user/:id',isLoggedIn,async (req,res)=>{
let{id}=req.params;
let allData= await Feed.find({owner:{$in:id}}).populate('owner');
let userData=await User.findById(id)
res.render('pages/data.ejs',{allData,userData});

})


//Request-Route
app.post('/request/:id',isLoggedIn,async (req,res)=>{
let {id}=req.params;
let requestedFriends=await User.findById(id);
if(!requestedFriends.friends.includes(req.user._id)){
if(!requestedFriends.requests.includes(req.user._id)){
requestedFriends.requests.push(res.locals.currentUser._id);
await requestedFriends.save();
req.flash('success', 'Friend request sent!');
}else{
  req.flash('error', 'Already requested!');
}
}else{
 req.flash("error","Already Friends");
}
res.redirect(`/user/${id}`);
})


//Notification
app.get('/notifications',isLoggedIn,async (req,res)=>{
let currentUser=req.user._id;
let pendingRequest=await User.findById(currentUser).populate('requests');
res.render('pages/notifications.ejs',{pendingRequest})
})


//Accept-request-Route
app.post('/accept/:id', async (req, res) => {
  const { id } = req.params;
  const currentUserId = req.user._id;
 await User.findByIdAndUpdate(currentUserId, {$pull: { requests: id }});
 sender=await User.findById(id)
 reciever=await User.findById(currentUserId)
 sender.friends.push(reciever._id)
 reciever.friends.push(sender._id)
await sender.save();
await reciever.save();
req.flash('success',"Req Accepted")
res.redirect('/')
});


//See-Friends
app.get('/user/:id/friends',async(req,res)=>{
let {id}=req.params;
let data=await User.findById(id).populate('friends');
res.render('pages/friends.ejs',{data})
})

//Like Functionllity
app.get('/user/:id/like',async (req,res,next)=>{
  let {id}=req.params;
  let Post=await Feed.findById(id);
  if(!Post.likes.includes(req.user._id)){
  Post.likes.push(req.user._id);
  await Post.save();
  console.log("OK");
  }else{
    console.log("Already Likes");
  }

});

// API Route to fetch full post data by ID
app.get('/user/post/:id', isLoggedIn, async (req, res) => {
  
    const post = await Feed.findById(req.params.id).populate('owner');
     res.send(post); 
  
});

app.post('/api/post/:id/like', async (req, res) => {
  const post = await Feed.findById(req.params.id);
  if(!post.likes.includes(req.user._id)){
  post.likes = req.body.likes;
  await post.save();
  res.json({ message: 'Likes updated', likes: post.likes });
  }else{
    console.log("Already Liked");
  }

});

//CommentSection
app.post(`/user/:id/comment`,async (req,res)=>{
 let {comment}=req.body
let post=await Feed.findById(req.params.id)
post.comment.push({text:comment,user:req.user._id});
await post.save();

  res.json(post);
}); 





app.post('/user/:id/delete',async(req,res)=>{
  let{id}=req.params;
 let post= await Feed.findById(id)
 if(post.owner._id.equals(req.user._id)){
  await Feed.findByIdAndDelete(id);
    res.redirect('/');
 }else{
  return false;
 }

})



//Edit_function
app.get('/user/:id/edit',async (req,res)=>{
let post=await Feed.findById(req.params.id)
res.send(post)
})


//Edit_function
app.post('/user/:id/edit',async (req,res)=>{
let {newTitle}=req.body;
let post=await Feed.findById(req.params.id);
post.title=newTitle;
let result=await post.save();
res.send(result.title);
})


app.use((req,res,next)=>{
  req.flash('error',"Something Went Wrong")
  res.redirect('/')
})

app.use((err,req,res,next)=>{
  req.flash('error',"Something Went Wrong")
  res.redirect('/')
})

app.listen(3000, () => {
console.log('App listening on port');
});