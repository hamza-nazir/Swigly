
function delFun(event,postID){
    let form=document.getElementById(`delete-${postID}`);

    event.preventDefault();

    Swal.fire({
            title:  "Are you Sure",
      text: "This action will delete the post.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
     
    }).then((result)=>{
        if(result.isConfirmed){
            form.submit()
        }
    })
};




async function editFun(event,postID,postURl){
       event.preventDefault();

    let res=   await axios.get(`/user/${postID}/edit`)
    let title=res.data.title;
      Swal.fire({
            title:  "Enter New Title",
      text: "This action will delete the post.",
      html:`
    <div> 
<img  style='border-radius:20px' src='${res.data.post}' width='200px'>
    </div>
      <input style='border: 1px solid rgb(197, 195, 195); padding: 10px;' id="newTitle" value="${title}" type="text" name="newTitle">

      `,
   
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, Edit it!",
     
    }).then(async (result)=>{
        if(result.isConfirmed){
        const newTitle = document.getElementById("newTitle").value;
      let title=  await axios.post(`/user/${postID}/edit`,{newTitle});
      let titleDiv=document.querySelector(`#post-text-${postID}`);
      titleDiv.innerHTML=title.data;
        }
    })
}