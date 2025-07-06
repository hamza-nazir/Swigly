const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const userSchema=new mongoose.Schema({
     name:{
        type:String
    },
    username:{
        type:String
    },
   
    email:{
       type:String    
    },
     password:{
      type:String  
    },
      picture:{
      type:String  
    },
    requests:[{
      type:mongoose.Schema.Types.ObjectId,
      ref:"User"
    }],
    friends:[
      {
        type:mongoose.Schema.Types.ObjectId,
      ref:"User"
      }
    ]
   
   
   
});
userSchema.plugin(passportLocalMongoose);
const User = mongoose.model('User', userSchema);
module.exports=User;