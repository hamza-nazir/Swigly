
 function commentFun(dataID,postUrl) {

Swal.fire({
  title: 'Post a Comment',
  confirmButtonText: '💬 Post Comment',
  showCloseButton: true,
  width: 600,
  html: `
    <style>
      .swal2-popup {
        font-family: 'Segoe UI', sans-serif;
        height:550px
      }
      .post-image {
        height:300px;
        width:400px;
        border-radius: 12px;
        margin-bottom: 10px;
        box-shadow: 0 2px 6px rgba(0,0,0,0.1);
      }
      .comment-input {
        width: 100%;
        padding: 10px 12px;
        margin-top: 10px;
        border: 1px solid #ccc;
        border-radius: 8px;
        font-size: 15px;
        outline: none;
        box-shadow: inset 0 1px 3px rgba(0,0,0,0.05);
      }
    </style>

    <div>
      <img src="${postUrl}" class="post-image" alt="Post">
    </div>

    <div>
      <input type="text" id="comment" class="comment-input" placeholder="Enter your comment here...">
    </div>
  `
}).then(async (result)=>{
    if(result.isConfirmed){
        let comment=document.querySelector('#comment');
        if(comment.value){
           
       let post=    await axios.post(`/user/${dataID}/comment`,{
            comment:comment.value
           });
            
           
           let span=document.getElementById(`comment-${dataID}`)
           span.innerText=post.data.comment.length;
        }
    }


}) 

}
