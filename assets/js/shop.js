let fetchedData = [];

const shopBodySunglasses = document.querySelector(".shop-body_sunglasses");
const shopBodyGlasses = document.querySelector(".shop-body_glasses");

$(document).ready( () => {
  // getShopItems("../assets/json/products.json");
  getShopItems("./assets/json/products.json");
})

// STORE PRODUCT ID IN LOCALSTORAGE SO IT IS AVAILABLE IN SHOP-SINGLE
storeId = (id) => {
  localStorage.setItem("product-id", id);
} 

getShopItems = (dataUrl) => {
    $.get(dataUrl, (data) => {
        //console.log(data);

        data.forEach(instance => {
            fetchedData.push(instance);
            //console.log("FETCHED DATA = ", fetchedData)
        })
        // da nam po defaultu rendera iteme cim udjemo na site
        console.log(fetchedData);
        renderItems(fetchedData);
    });
}

renderItems = (itemsArray) => {
  // Clear all shop sections
  $(".shop-body_sunglasses").empty();
  $(".shop-body_glasses").empty();

  // Loop through fetched data and append items based on category
  itemsArray.forEach(instance => {
      const item = document.createElement("div");
      item.classList.add("col-md-4");
      item.innerHTML = `
          <div class="card mb-4 product-wap rounded-0">
              <div class="card rounded-0">
                  <img class="card-img rounded-0 img-fluid" src="${instance.image}" />
                  <div class="card-img-overlay rounded-0 product-overlay d-flex align-items-center justify-content-center">
                      <ul class="list-unstyled">
                          <li>
                              <a class="btn btn-success" onclick="storeId(${instance.id})" text-white mt-2" href="#shop-single" target="_blank" ><i class="far fa-eye"></i></a>
                          </li>
                      </ul>
                  </div>
              </div>
              <div class="card-body">
                  <a href="#shop-single" target="_blank" onclick="storeId(${instance.id})" class="h3 text-decoration-none">${instance.name}</a>
                  <ul class="w-100 list-unstyled d-flex justify-content-between mb-0">
                      <li>M/L/X/XL</li>
                  </ul>
                  <ul class="list-unstyled d-flex justify-content-center mb-1">
                      <li>${generateStarIcons(instance.rating)}</li>
                  </ul>
                  <p class="text-center mb-0">$${instance.price}</p>
              </div>
          </div>
      `;

      let selectedType = $("#item-type").val();
      console.log("SELECT: ", selectedType);

      //let itemTemp = document.createElement("div");
      //itemTemp.innerHTML = "TEMP TEMP TEMP";

      if (instance.category === "sunglasses" && selectedType === "Sunglasses") {
          shopBodySunglasses.append(item);
      } else if (instance.category === "glasses" && selectedType === "Glasses") {
          shopBodyGlasses.append(item);
      }
  });
  // sortItems();
}

$("#item-type").change(function() {
    //console.log("CHANGE");
    blockUi("main");
    renderItems(fetchedData);
    unblockUi("main");
});

// SORT //

$("#sort-type").change(function() {
  console.log("CHANGED SORT TYPE TO ", $("#sort-type").val());
  let sortType = $("#sort-type").val();
  if (sortType === "Most popular") {
    sortItemsByRating();
    renderItems(fetchedData);
  }
  else if (sortType === "Featured") {
    sortItemsById();
    renderItems(fetchedData);
  }
  else {
    sortItemsAlphabetically();
    renderItems(fetchedData);
  }
});

sortItemsByRating = () => {
  //let sortedByRating = fetchedData.sort((a, b) => b.rating - a.rating);
  fetchedData.sort((a, b) => b.rating - a.rating);
  console.log("SORTED BY RATING: ", fetchedData);
}

sortItemsById = () => {
  //let sortedByRating = fetchedData.sort((a, b) => b.rating - a.rating);
  fetchedData.sort((a, b) => a.id - b.id);
  console.log("SORTED BY ID: ", fetchedData);
}

sortItemsAlphabetically = () => {
  fetchedData.sort((a, b) => {
    const nameA = a.name.toUpperCase();
    const nameB = b.name.toUpperCase();
    if (nameA < nameB) {
      return -1;
   }
   if (nameA > nameB) {
     return 1;
   }

    return 0;
  });
  console.log("SORTED BY ALPHABET: ", fetchedData);
}

// END SORT //


// SEARCH //

$("#search-btn").click( () => {
  let searchTerm = $("#search-input").val().trim().toLowerCase();
  console.log("SEARCH TERM: ", searchTerm);
  if (searchTerm !== "") {
    const filteredData = fetchedData.filter(item => item.name.toLowerCase().includes(searchTerm));
    renderItems(filteredData);
  } else {
    renderItems(fetchedData); // Render all items if search input is empty
  }

});

// END SEARCH

// RENDER STAR ICONS BASED ON JSON RATING
generateStarIcons = (rating) => {
    let starIcons = '';
    for (let i = 0; i < 5; i++) {
        if (i < rating) {
            starIcons += '<li><i class="text-warning fa fa-star"></i></li>';
        } else {
            starIcons += '<li><i class="text-muted fa fa-star"></i></li>';
        }
    }
    return starIcons;
}

blockUi = (element) => {
    $(element).block({
        message: '<div class="spinner-border text-primary" role="status"></div>',
        css: {
            backgroundColor: "transparent",
            border: "0"
        },
        overlayCSS: {
            backgroundColor: "#000000",
            opacity: 0.25
        }
    });
}

unblockUi = (element) => {
  $(element).unblock({});
}