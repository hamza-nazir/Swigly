async function likeFun(event, postID, CurrentUserID) {
  event.preventDefault();

  const res = await axios.get(`/user/post/${postID}`);
  const post = res.data;

    post.likes.push(CurrentUserID);
  

  await axios.post(`/api/post/${postID}/like`, {
    likes: post.likes
  });


  const likeCountSpan = document.getElementById(`like-count-${postID}`);
  likeCountSpan.innerText = post.likes.length;
}
