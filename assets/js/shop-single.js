let itemData;
let shopBodySingle = document.querySelector(".shop-body_single");

$(document).ready(function() {
    let id = localStorage.getItem("product-id");
    console.log("LOCALSTORAGE ID: ", id);

    // fetchDataWithId(id, "../assets/json/products.json"); OZTDATED, OVAKO RADI PREKO LIVE SERVERA, A NE RADI PREKO HTDOCS
    fetchDataWithId(id, "./assets/json/products.json");
    // renderItem();
})


// FETCH ITEM FROM JSON FILE WITH THE SPECIFIC ID SPECIFIED BY THE LOCALSTORAGE("product-id")
fetchDataWithId = (id, dataUrl) => {
    $.get(dataUrl, (data) => {
        //console.log(data);

        data.forEach(instance => {
            if (instance.id == id) {
                itemData = instance;
            }
        })
        // da nam po defaultu rendera iteme cim udjemo na site
        console.log("ITEM DATA: ", itemData);
        console.log("ITEM DATA IMAGE: ", itemData.image);

        // MUST CALL renderItem() here, or use async await, but this is simpler, since the script tries to render the item while it still hasn't been fetched
        renderItem();
    });
}

renderItem = () => {
    $(".shop-body_single").empty();

    const item = document.createElement("div");
    item.classList.add("row");

    item.innerHTML = `
    <div class="col-lg-5 mt-5">
        <div class="card mb-3">
            <div id="product-carousel" class="carousel slide" data-bs-ride="carousel">
                <div class="carousel-inner">
                    <div class="carousel-item active">
                    <img class="card-img img-fluid" src="${itemData.image}" alt="Card image cap" id="product-detail">
                    </div>
                    <div class="carousel-item">
                    <img class="card-img img-fluid" src="assets/img/shop_01.jpg" alt="Second Image">
                    </div>
                    <div class="carousel-item">
                    <img class="card-img img-fluid" src="assets/img/shop_11.jpg" alt="Third Image">
                    </div>
                    <!-- Add more carousel items as needed -->
                </div>
                <a class="carousel-control-prev" type="button" data-bs-target="#product-carousel" data-bs-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Previous</span>
                </a>
                <a class="carousel-control-next" type="button" data-bs-target="#product-carousel" data-bs-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Next</span>
                </a>
            </div>
        </div>
        </div>
        <!-- col end -->
        <div class="col-lg-7 mt-5">
        <div class="card">
            <div class="card-body">
                <h1 class="h2 pb-3">${itemData.name}</h1>
                <p class="h3 py-2">$${itemData.price}</p>
                <p class="py-2">
                    ${generateStarIcons(itemData.rating)}
                </p>
                <ul class="list-inline">
                    <li class="list-inline-item">
                    <h6>Brand:</h6>
                    </li>
                    <li class="list-inline-item">
                    <p class="text-muted"><strong>${itemData.brand}</strong></p>
                    </li>
                </ul>
                <h6>Description:</h6>
                <p class="pb-3">
                    ${itemData.description}
                </p>
                <ul class="list-inline">
                    <li class="list-inline-item">
                    <h6>Gender:</h6>
                    </li>
                    <li class="list-inline-item">
                    <p class="text-muted"><strong>${itemData.gender}</strong></p>
                    </li>
                </ul>
                <form action="" method="GET">
                    <input
                    type="hidden"
                    name="product-title"
                    value="Activewear"
                    />
                    <div class="row align-items-center mb-5">
                    <div class="col-md-auto">
                        <h6>Available</h6>
                    </div>
                    <div class="col-md-3">
                        <select name="item-size" id="item-size" class="form-control">
                            <option value="XS">XS</option>
                            <option value="S">S</option>
                            <option value="M">M</option>
                            <option value="L">L</option>
                            <option value="XL">XL</option>
                            <option value="XXL">XXL</option>
                        </select>
                    </div>
                    </div>
                    <div class="row align-items-center mb-5">
                    <div class="col-md-auto">
                        <h6>Quantity</h6>
                    </div>
                    <div class="col-md-3">
                        <input type="number" class="form-control" name="item-quantity" id="item-quantity" min="0">
                    </div>
                    </div>
            </div>
            <div class="row pb-3">
            <!-- <div class="col d-grid">
                <button type="submit" class="btn btn-success btn-lg" name="submit" value="buy">Buy</button>
                </div> -->
            <div class="col d-grid">
            <button
                type="submit"
                class="btn btn-success btn-lg"
                name="add-to-cart"
                value="addtocard"
                onclick="addToCart()"
                >
            Add To Cart
            </button>
            </div>
            </div>
            </form>
        </div>
        </div>
    </div>
    `

    shopBodySingle.append(item);
}

generateStarIcons = (rating) => {
    let starIcons = '';
    for (let i = 0; i < 5; i++) {
        if (i < rating) {
            starIcons += '<i class="text-warning fa fa-star"></i>';
        } else {
            starIcons += '<i class="text-muted fa fa-star"></i>';
        }
    }
    return starIcons;
}

addToCart = () => {
    addToCart = () => {
        // Get selected size and quantity
        const selectedSize = document.getElementById('item-size').value;
        const selectedQuantity = parseInt(document.getElementById('item-quantity').value);
    
        // Create cart item object
        const cartItem = {
            "product-id": itemData.id,
            "product-quantity": selectedQuantity,
            "product-size": selectedSize
        };
    
        // Fetch current cart data from the cart.json file
        $.getJSON('./assets/json/cart.json', function(cart) {
            // Check if the same product with the same size exists in the cart
            const existingItemIndex = cart.findIndex(item => item['product-id'] === cartItem['product-id'] && item['product-size'] === cartItem['product-size']);
    
            if (existingItemIndex !== -1) {
                // If the same product with the same size exists, update its quantity
                cart[existingItemIndex]['product-quantity'] += selectedQuantity;
            } else {
                // Otherwise, add the new item to the cart
                cart.push(cartItem);
            }
    
            // Save updated cart back to the cart.json file
            $.ajax({
                url: './assets/json/cart.json',
                type: 'PUT',
                data: JSON.stringify(cart),
                contentType: 'application/json',
                success: function() {
                    // Optionally, provide feedback to the user
                    alert('Product added to cart!');
                }
            });
        });
    };
}