const mongoose = require('mongoose');
main()
.then((res)=>{
    console.log('Connection Succesfull');
})
.catch((err) =>{
    console.log(err)
});
async function main() {
await mongoose.connect('mongodb://127.0.0.1:27017/Swigly');
}
const feedSchema=new mongoose.Schema({
    post:{
        type:String,
        required:true
    },
     title:{
        type:String,
        required:true
    },
    postedAt:{
        type:Date,
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    likes:[
      {
         type:String
      }
    ],
   comment: [
  {
    user: {
         type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
         },
    text: String
  }
]

   
});
const Feed = mongoose.model('Feed', feedSchema);
module.exports=Feed;