url = "https://rotten-potatoes-rails-backend.herokuapp.com/restaurants";
const resBar = document.querySelector(".grid-container");
const resReviewForm = document.querySelector("#resReviewForm");
const closeModalButton = document.querySelector(`[data-close-button]`);
const closeModalButton_2 = document.querySelector(`[data-close-button-2]`);
const overlay_1 = document.getElementById("review-overlay");
const overlay_2 = document.getElementById("review-overlay");
const resCreateUser = document.querySelector("#createUserForm");
const resHeader = document.querySelector("div.header");
const sectionCenter = document.querySelector(".section-center");
const btnContainer = document.querySelector(".btn-container");
// const userPlace = document.querySelector(".userCurrent");
const logoutButton = document.querySelector(".logoutButton");
const searchBar = document.getElementById("searchBar");
const resNav = document.querySelector("#nav");
let resBody = document.querySelector("body");
let reviewSection = document.querySelector(".modal-view-review-body");

let gloRes = {};
let myUser = {};
let gloComment = {};

logoutButton.addEventListener("click", () => {
  if (confirm("Are you sure you want to logout?")) {
    window.location.reload();
  }
});

// ################## fetch get the restaurant api ########################

function afterLogin() {
  fetch(url)
    .then((res) => res.json())
    .then((restaurants) => {
      restaurants.forEach((restaurant) => {
        renderRestaurantInfo(restaurant);
      });
      searchBarFn(restaurants);
    });
}

function searchBarFn(restaurants) {
  searchBar.addEventListener("keyup", (e) => {
    resBar.innerText = "";
    const searchString = e.target.value.toLowerCase();
    const filteredrestaurant = restaurants.filter((restaurant) => {
      return (
        restaurant.name.toLowerCase().includes(searchString) ||
        restaurant.cuisines.toLowerCase().includes(searchString) ||
        restaurant.address.toLowerCase().includes(searchString)
      );
    });
    if (filteredrestaurant.length >= 0) {
      filteredrestaurant.forEach((restaurant) => {
        renderRestaurantInfo(restaurant);
      });
    }
  });
}

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
  // resObj.innerText = res.name;
  resObj.className = `resCard item${res.id}`;

  const resImg = document.createElement("img");
  resImg.src = res.web_img;
  if (res.web_img == "") {
    resImg.src =
      "https://res.cloudinary.com/teepublic/image/private/s--4-lBZIC9--/c_crop,x_10,y_10/c_fit,h_1109/c_crop,g_north_west,h_1260,w_1260,x_-138,y_-76/co_rgb:ffffff,e_colorize,u_Misc:One%20Pixel%20Gray/c_scale,g_north_west,h_1260,w_1260/fl_layer_apply,g_north_west,x_-138,y_-76/bo_0px_solid_white/t_Resized%20Artwork/c_fit,g_north_west,h_1054,w_1054/co_ffffff,e_outline:53/co_ffffff,e_outline:inner_fill:53/co_bbbbbb,e_outline:3:1000/c_mpad,g_center,h_1260,w_1260/b_rgb:eeeeee/c_limit,f_jpg,h_630,q_90,w_630/v1539384919/production/designs/3309274_0.jpg";
  }
  resImg.classList.add("res-img");

  const resCardWrapper = document.createElement("div");
  resCardWrapper.classList.add("res-details");
  resCardWrapper.id = `res-${res.id}`;

  const resLikes = document.createElement("a");
  resLikes.className = "like-btn";
  resLikes.innerText = `👍 ${res.like} likes`;

  const resReviewButton = document.createElement("a");
  resReviewButton.className = "review-btn";
  resReviewButton.innerText = `🔏 review`;
  resReviewButton.dataset.target = "#modal-review";

  const resCuisine = document.createElement("div");
  resCuisine.classList.add("cuisines");
  resCuisine.classList.add("tag");
  resCuisine.innerText = `${res.cuisines}`;

  const resAddress = document.createElement("div");
  resAddress.classList.add("address");
  resAddress.classList.add("tag");
  resAddress.innerText = `${res.address}`;

  const resdWebhref = document.createElement("a");
  resdWebhref.target = "_blank";
  resdWebhref.href = res.web_url;

  resName = document.createElement("div");
  resName.innerText = `${res.name}`;
  resName.classList.add("resName");
  resName.dataset.target = "#modal-view-review";

  const resImgWrapper = document.createElement("div");
  resImgWrapper.append(resImg);
  resImgWrapper.classList.add("item");

  const viewOverlay = document.createElement("div");
  viewOverlay.className = "img-overlay";

  const OverlayText = document.createElement("button");
  OverlayText.dataset.target = "#modal-view-review";
  OverlayText.innerText = "view reviews";
  OverlayText.className = "viewButton";

  viewOverlay.append(OverlayText);
  resImgWrapper.append(viewOverlay);

  const resBr = document.createElement("br");

  resBar.append(resObj);
  resObj.append(resImgWrapper);
  resObj.append(resCardWrapper);
  resdWebhref.append(resName);
  resCardWrapper.append(
    resdWebhref,
    resCuisine,
    resAddress,
    resBr,
    resLikes,
    resReviewButton
  );

  // ########################### like button event listener ####################
  resLikes.addEventListener("click", () => {
    gloRes = res;
    let theNewLikes = res.like + 1;
    updateLike(theNewLikes, res, resLikes);
  });
  // ########################### the review button event listener ##############
  resReviewButton.addEventListener("click", (e) => {
    gloRes = res;
    const modal = document.querySelector(resReviewButton.dataset.target);
    openModal_1(modal);
    // ##############################################################################
  });

  OverlayText.addEventListener("click", () => {
    reviewSection.innerText = "";
    resComment(res, reviewSection);
    const modal = document.querySelector(OverlayText.dataset.target);
    openModal_2(modal);
  });
}

// ########### end of rendering function #######################################

function resComment(res, resObj) {
  if (res.comments.length === 0) {
    let resReviewLi = document.createElement("li");
    resReviewLi.className = "reviewlist";
    resReviewLi.innerText = `Be the first one to review ${res.name}`;
    resObj.append(resReviewLi);
  } else {
    res.comments.forEach((comment) => {
      let resReviewLi = document.createElement("li");
      resReviewLi.className = "reviewlist";
      resReviewLi.innerText = `${comment.content}`;

      let deleteLink = document.createElement("button");
      deleteLink.innerText = "delete";
      deleteLink.dataset.id = comment.id;

      if (myUser.id === comment.user_id) {
        resReviewLi.append(deleteLink);
      }
      resObj.append(resReviewLi);

      deleteLink.addEventListener("click", () => {
        if (confirm("Are you sure you want to delete your review?")) {  
        fetch(`https://rotten-potatoes-rails-backend.herokuapp.com/comments/${comment.id}`, {
          method: "DELETE",
        })
          .then((r) => r.json())
          .then(() => {
            resReviewLi.remove();
            res.comments.pop();
          });
        }
      });
    });
  }
}

// @########################### review form submit button event listener #######

// ########################### create user #####################################
resCreateUser.addEventListener("submit", (e) => {
  e.preventDefault();
  let newUser = e.target.user.value;
  createUserObj(newUser);
  e.target.reset();
});

function createUserObj(newUser) {
  return fetch(`https://https://rotten-potatoes-rails-backend.herokuapp.com/users`, {
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
      myUser = newUsername;
      if (myUser.name == "") {
        alert("Please enter you user name");
      } else {
        afterLogin();
        // userPlace.innerText = `Hi: ${myUser.name}`;
        resCreateUser.classList.toggle("active");
        resHeader.classList.toggle("active");
        logoutButton.classList.toggle("active");
        resNav.classList.toggle("active");
        resBody.classList.toggle("active");
        resBody.classList.toggle("active-color");
      }
    });
}

resReviewForm.addEventListener("submit", function (e) {
  e.preventDefault();
  let newContent = e.target.comment.value;
  const modal = closeModalButton.closest(".modal-review");
  if (newContent == "") {
    alert("Sorry, I don't understand!");
  } else {
    createComment(newContent);
    closeModal(modal);
  }
  this.reset();
});

function createComment(newContent) {
  return fetch(`https://rotten-potatoes-rails-backend.herokuapp.com/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content: newContent,
      user_id: myUser.id,
      restaurant_id: gloRes.id,
    }),
  })
    .then((r) => r.json())
    .then((createdComment) => {
      gloRes.comments.push(createdComment);
    });
}

// ############################ fetch post function #############################

// ################# overlay event listener ##########################
overlay_1.addEventListener("click", () => {
  const modals = document.querySelectorAll(".modal-review.active");
  modals.forEach((modal) => {
    closeModal(modal);
  });
});

overlay_2.addEventListener("click", () => {
  const modals = document.querySelectorAll(".modal-view-review.active");
  modals.forEach((modal) => {
    closeModal_2(modal);
  });
});

// ################# modal close button event listener ##############
closeModalButton.addEventListener("click", () => {
  const modal = closeModalButton.closest(".modal-review");
  closeModal(modal);
});

closeModalButton_2.addEventListener("click", () => {
  const modal = closeModalButton_2.closest(".modal-view-review");
  closeModal_2(modal);
});

// modal open and close helper function #############################
function openModal_1(modal) {
  if (modal == null) return;
  modal.classList.add("active");
  overlay_1.classList.add("active");
}

function openModal_2(modal) {
  if (modal == null) return;
  modal.classList.add("active");
  overlay_2.classList.add("active");
}

function closeModal(modal) {
  if (modal == null) return;
  modal.classList.remove("active");
  overlay_1.classList.remove("active");
}

function closeModal_2(modal) {
  if (modal == null) return;
  modal.classList.remove("active");
  overlay_2.classList.remove("active");
}

// ################ review list ##############################

// ##############################################
