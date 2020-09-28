url = "http://localhost:3000/restaurants";
const resBar = document.querySelector(".grid-container");
const resReviewForm = document.querySelector("#resReviewForm");
const closeModalButton = document.querySelector(`[data-close-button]`);
const overlay = document.getElementById("overlay");
const createUser = document.getElementById("createUserForm");
const resCreateUser = document.querySelector("#createUserForm");

let gloRes = {};
let myUser = {};

// ################## fetch get the restaurant api ########################
fetch(url)
  .then((res) => res.json())
  .then((restaurants) => {
    restaurants.forEach((restaurant) => {
      renderRestaurantInfo(restaurant);
    });
  });

// ################## update likes ############################
function updateLike(theNewLikes, res, resLikes) {
  return fetch(`${url}/${res.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      like: theNewLikes,
    }),
  })
    .then((r) => r.json())
    .then((updatedLike) => {
      resLikes.innerText = `👍${updatedLike.like} Likes`;
      res.like = updatedLike.like;
    });
}

// ################# render the info #################
function renderRestaurantInfo(res) {
  const resObj = document.createElement("div");
  resObj.innerText = res.name;
  resObj.id = "resCard";
  const resImg = document.createElement("img");
  resImg.src = res.web_img;
  if (res.web_img == "") {
    resImg.src =
      "https://res.cloudinary.com/teepublic/image/private/s--4-lBZIC9--/c_crop,x_10,y_10/c_fit,h_1109/c_crop,g_north_west,h_1260,w_1260,x_-138,y_-76/co_rgb:ffffff,e_colorize,u_Misc:One%20Pixel%20Gray/c_scale,g_north_west,h_1260,w_1260/fl_layer_apply,g_north_west,x_-138,y_-76/bo_0px_solid_white/t_Resized%20Artwork/c_fit,g_north_west,h_1054,w_1054/co_ffffff,e_outline:53/co_ffffff,e_outline:inner_fill:53/co_bbbbbb,e_outline:3:1000/c_mpad,g_center,h_1260,w_1260/b_rgb:eeeeee/c_limit,f_jpg,h_630,q_90,w_630/v1539384919/production/designs/3309274_0.jpg";
  }
  resImg.classList.add("res-img");
  resRowdiv = document.createElement("div");
  resRowdiv.classList.add("row");
  resButDiv_1 = document.createElement("div");
  resButDiv_1.classList.add("col-xs-12");
  resButDiv_2 = document.createElement("div");
  resButDiv_2.classList.add("col-xs-12");
  resButDiv_3 = document.createElement("div");
  resButDiv_3.classList.add("col-xs-12");
  const resBr = document.createElement("br");
  const resLikes = document.createElement("button");
  resLikes.className = "btn btn-block btn-success";
  resLikes.innerText = `👍${res.like} likes`;

  const resReviewButton = document.createElement("button");
  resReviewButton.className = "btn btn-block btn-info";
  resReviewButton.innerText = `🔏review`;
  resReviewButton.dataset.target = "#modal-review";

  const resdWebhref = document.createElement("a");
  resdWebhref.target = "_blank";
  resdWebhref.href = res.web_url;
  const resWeb = document.createElement("button");
  resWeb.className = "btn btn-block btn-primary";
  resWeb.innerText = `website`;
  const resReviewUl = document.createElement("ul");
  resComment(res, resReviewUl);
  resBar.append(resObj);
  resRowdiv.append(resButDiv_1);
  resButDiv_1.append(resLikes);
  resRowdiv.append(resButDiv_3);
  resButDiv_3.append(resdWebhref);
  resRowdiv.append(resButDiv_2);
  resButDiv_2.append(resReviewButton);
  resdWebhref.append(resWeb);
  resObj.append(resBr, resImg, resRowdiv);
  resObj.append(resReviewUl);

  // ########################### like button event listener ####################
  resLikes.addEventListener("click", () => {
    let theNewLikes = res.like + 1;
    updateLike(theNewLikes, res, resLikes);
  });
  // ########################### the review button event listener ##############
  resReviewButton.addEventListener("click", (e) => {
    gloRes = res;
    const modal = document.querySelector(resReviewButton.dataset.target);
    openModal(modal);
  });
}
// ########### end of rendering function #######################################

// @########################### review form submit button event listener #######

// ########################### create user #####################################
resCreateUser.addEventListener("submit", (e) => {
  e.preventDefault();
  let newUser = e.target.user.value;
  createUserObj(newUser);
  e.target.reset();
});

function createUserObj(newUser) {
  return fetch(`http://localhost:3000/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      name: newUser,
    }),
  })
    .then((res) => res.json())
    .then((newUsername) => {
      return (myUser = newUsername);
    });
}

resReviewForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let newContent = e.target.comment.value;
  createComment(newContent);
  const modal = closeModalButton.closest(".modal-review");
  closeModal(modal);
  e.target.reset();
});

function createComment(newContent) {
  console.log(myUser);
  console.log(newContent);
  return fetch(`http://localhost:3000/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content: newContent,
      user_id: myUser.id,
      restaurant_id: gloRes.id,
    }),
  }).then((r) => r.json());
}

// ############################ fetch post function #############################

// ################# overlay event listener ##########################
overlay.addEventListener("click", () => {
  const modals = document.querySelectorAll(".modal-review.active");
  modals.forEach((modal) => {
    closeModal(modal);
  });
});

// ################# modal close button event listener ##############
closeModalButton.addEventListener("click", () => {
  const modal = closeModalButton.closest(".modal-review");
  closeModal(modal);
});

// modal open and close helper function #############################
function openModal(modal) {
  if (modal == null) return;
  modal.classList.add("active");
  overlay.classList.add("active");
}

function closeModal(modal) {
  if (modal == null) return;
  modal.classList.remove("active");
  overlay.classList.remove("active");
}

// ################ review list ##############################
function resComment(res, resObj) {
  res.comments.forEach((comment) => {
    let resReviewLi = document.createElement("li");
    resReviewLi.className = "reviewlist";
    resReviewLi.innerText = `${comment.content}`;
    resObj.append(resReviewLi);
  });
}

// ##############################################
