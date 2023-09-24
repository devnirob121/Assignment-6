// const categoryUrl  = 'https://openapi.programming-hero.com/api/videos/categories'
// const postUrl = 'https://openapi.programming-hero.com/api/videos/category/${id}'

// async function loadCategory (){
//     const Url = "https://openapi.programming-hero.com/api/videos/categories";
//     const res = await fetch(Url)
//     const data = await res.json()

// }

//initialize variable
let ascendingOrder = true;
let activeButton = null;

const categoryButtonsContainer = document.getElementById("category-buttons");
const cardContainer = document.getElementById("card-container");
const loader = document.getElementById("loader");

// load category
const loadCategory = async () => {
  const Url = "https://openapi.programming-hero.com/api/videos/categories";
  const res = await fetch(Url);
  const data = await res.json();
  const categories = data.data;
  displayCategory(categories);
  //  console.log(categories);
};

// display category
const displayCategory = (categories) => {
  categories.forEach((cat,index) => {
    const categoryButton = document.createElement("div");
    const isActive = index === 0 ? "category-Active" : ""; // Check if it's the first button

    categoryButton.innerHTML = `
     <button onclick="getCategory(this)" id="category-buttons" catId="${cat.category_id}" class="btn sm:py-[0.31rem] py-[0.20rem] bg-[#25252526] hover:bg-[#25252526] text-black px-[0.8rem] sm:px-[1.25rem] rounded border-none ${isActive}"> ${cat.category} </button>

     `;
    categoryButtonsContainer.appendChild(categoryButton);
  });
};

// post api
const loadPost = async (categoryId = 1000) => {
  loader.classList.remove("hidden");

  const Url = `https://openapi.programming-hero.com/api/videos/category/${categoryId}`;
  const res = await fetch(Url);
  const data = await res.json();
  const posts = data.data;
  loader.classList.remove("hidden");
  getshortByView(posts);

  //  console.log(categories);
};

// second to hours and minutes
const timeFormater = (seconds) => {
  const timeUnits = [
    { label: "year", seconds: 86400 * 365 },
    { label: "day", seconds: 86400 },
    { label: "hr", seconds: 3600 },
    { label: "min", seconds: 60 },
  ];

  const formatedTimes = timeUnits
    .map((unit) => {
      const untiValue = Math.floor(seconds / unit.seconds);
      seconds = seconds % unit.seconds;
      return untiValue > 0
        ? `${untiValue} ${unit.label}${untiValue > 1 ? "s" : ""}`
        : null;
    })
    .filter((unit) => unit !== null)
    .join(" ");

  return formatedTimes || "0 mins";
};

const displayPost = (posts) => {
  const noDataFound = document.getElementById("noDataFound");

  cardContainer.innerHTML = "";

  if (posts.length > 0) {
    noDataFound.classList.add("hidden");

    posts.forEach((post) => {
      const card = document.createElement("div");
      const postTime = timeFormater(post.others.posted_date);
      card.classList = "card bg-base-100";
      card.innerHTML = `
            <figure>
    <div class="post-thumbnail-img w-full h-[13rem] relative">
        <img
            class="object-cover h-full w-full"
            src="${post.thumbnail}"
            alt="${post.title}"
        />
        <div class="bg-[#171717] p-4 absolute right-0 bottom-0 ${
          postTime === "0 mins" ? "hidden" : ""
        }">
            <div class="text-white text-[10px] font-normal">${postTime}  ago</div>
        </div>
    </div>
</figure>
<div class="card-body flex-row p-0 pt-[1.5rem]">
    <div class="card-user-pic w-[2.5rem] h-[2.5rem] shrink-0">
        <img class="myImg h-full rounded-full object-cover w-full"
            src="${post.authors[0].profile_picture}"
            alt="User Profile"
        />
    </div>
    <div class="card-content">
        <h2 class="card-title text-[1rem] leading-6 mb-1.5">${post.title}</h2>
        <div class="flex items-center gap-2">
            <div class="profile-name">
                <p class="mb-1.5">${post.authors[0].profile_name}</p>
            </div>
            <div class="check-img ${post.authors[0].verified ? "" : "hidden"}">
                <img class="w-[1.25rem] h-[1.25rem]" src="assets/img/check.png" alt="Check Mark" />
            </div>
        </div>
        <p class="mb-1.5">${post.others.views} views</p>
    </div>
</div>

     `;
      cardContainer.appendChild(card);
    });
    loader.classList.add("hidden");
  } else {
    loader.classList.add("hidden");
    noDataFound.classList.remove("hidden");
  }
};

loadPost();

// Category Flter Handler
const getCategory = (e) => {
  const catId = e.getAttribute("catId");

  // Remove the "category-Active" class from the currently active button, if any
  const currentActiveBtn = document.querySelector(".category-Active");
  if (currentActiveBtn) {
    currentActiveBtn.classList.remove("category-Active");
  }

  e.classList.add("category-Active");

  activeButton = e;
  console.log(catId);
  loadPost(catId);
};

// get shortByView\
const getshortByView = (posts = null) => {
  // Initialize the ascendingOrder variable
  let ascendingOrder = true;

  // Add a click event listener to the "Sort by view" button
  const sortButton = document.getElementById("sortButton");
  sortButton.addEventListener("click", () => {
    ascendingOrder = !ascendingOrder;
    sortPosts();
  });

  // Function to sort and display the posts
  const sortPosts = () => {
    // 1. Make a copy of the posts
    const sortedPosts = [...posts];

    // 2. Define a custom compare function
    const compareFunction = (a, b) => {
      const viewA = parseFloat(a.others.views.replace("K", ""));
      const viewB = parseFloat(b.others.views.replace("K", ""));
      return ascendingOrder ? viewA - viewB : viewB - viewA;
    };

    // 3. Sort the posts based on the compare function
    sortedPosts.sort(compareFunction);

    // 4. Display the sorted posts
    displayPost(sortedPosts);
  };

  // Initial sorting when the page loads
  sortPosts();
};

// Initial  categories and posts
loadCategory();
