let Name = localStorage.getItem("name");
let changeNameBtn = document.querySelector(".changeNameBtn");

function askName(Name) {
  while (Name == null || Name == "") {
    Name = prompt(`Enter Your Name\n(Note: Enter correct name)`).trim();
    localStorage.setItem("name", Name);
    window.location.reload();
  }
}

askName(Name);

let delBtn = document.querySelectorAll(".del-btn");
let btn = "";

for (btn of delBtn) {
  let id = btn.parentElement.parentElement.id;
  btn.addEventListener("click", e => {
    console.log(id);
    fetch("/del-thoughts", {
      method: "delete",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: id
      })
    })
      .then(res => {
        return res.json();
      })
      .then(data => {
        alert("Post Deleted");
        window.location.reload();
      });
  });
}

//code for like functionality
// we will add an event listener to like btn and then make a put request and handle it in server by increasing likes

let allLikeBtn = document.querySelectorAll(".like-btn");

let likeBtn = "";

for (likeBtn of allLikeBtn) {
  let id = likeBtn.parentElement.parentElement.id;
  
  likeBtn.addEventListener("click", e => {
    fetch("/addLike", {
      method: "put",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: id,
        person: Name,
        
      })
    })
      .then(res => {
        return res.json();
      })
      .then(data => {
        alert(data);
        window.location.reload();
      });
  });
}

//code for making request for the comments

let allCommentsBtn = document.querySelectorAll(".comment-btn");

for (btn of allCommentsBtn) {
  btn.addEventListener("click", e => {
    let id = e.target.parentElement.parentElement.id;
      window.location.href = "get-comments/" + id ;
  });
}

//code when add comment button is clicked to make a request to post comment on database
let addCommentBtn = document.querySelectorAll(".addComment");
for (btn of addCommentBtn) {
  btn.addEventListener("click", e => {
    // console.log(e.target.nextElementSibling.textContent);
    let id = e.target.parentElement.id;
    
    let comment = e.target.previousElementSibling.value;
    if (comment !== "") {
      fetch("add-comment", {
        method: "put",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: id,
          commentBy: Name,
          comment: comment
        })
      })
        .then(res => {
          return res.json();
        })
        .then(data => {
          alert('comment added');
          window.location.reload();
        });
    } else {
      alert("Input is Empty");
    }
  });
}
function modalCloseFunc() {
  let commentModal = document.querySelector(".modal");
  commentModal.classList.remove("is-active");
  window.location.href = "/";
}

let changeNameText = document.querySelector(".changeName");
changeNameText.after("✐(" + Name + ")");

changeNameBtn.addEventListener("click", e => {
  askName("");
});
