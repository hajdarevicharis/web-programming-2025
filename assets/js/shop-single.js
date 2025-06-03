let itemData;
let shopBodySingle = document.querySelector(".shop-body_single");

// Global cart storage (replaces localStorage for this environment)
window.cartStorage = window.cartStorage || [];

$(document).ready(function() {
    let id = localStorage.getItem("product-id");
    console.log("LOCALSTORAGE ID: ", id);

    fetchDataWithId(id, "./assets/json/products.json");
})

fetchDataWithId = (id, dataUrl) => {
    $.get(dataUrl, (data) => {
        data.forEach(instance => {
            if (instance.id == id) {
                itemData = instance;
            }
        })
       

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
                        <input type="number" class="form-control" name="item-quantity" id="item-quantity" min="1" value="1">
                    </div>
                    </div>
            </div>
            <div class="row pb-3">
            <div class="col d-grid">
            <button
                type="button"
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
    const selectedSize = document.getElementById('item-size').value;
    const selectedQuantity = parseInt(document.getElementById('item-quantity').value);

    if (!selectedQuantity || selectedQuantity < 1) {
        alert("Please enter a valid quantity");
        return;
    }

    const cartItem = {
        id: Date.now(), 
        product_id: itemData.id,
        name: itemData.name,
        price: parseFloat(itemData.price),
        image: itemData.image,
        size: selectedSize,
        quantity: selectedQuantity,
        product_name: itemData.name,
        product_image: itemData.image,
        product_size: selectedSize,
        product_quantity: selectedQuantity,
        brand: itemData.brand,
        description: itemData.description
    };

    console.log("New cart item to add:", cartItem);

    const existingItemIndex = window.cartStorage.findIndex(item =>
        item.product_id === cartItem.product_id &&
        item.size === cartItem.size
    );

    if (existingItemIndex !== -1) {
        window.cartStorage[existingItemIndex].quantity += selectedQuantity;
        console.log("Updated existing cart item quantity:", window.cartStorage[existingItemIndex]);
    } else {
        window.cartStorage.push(cartItem);
        console.log("Added new item to cart");
    }

    console.log("Updated cart storage after add:", window.cartStorage);

    if (typeof cartData !== 'undefined') {
        cartData = [...window.cartStorage]; 
        console.log("Updated global cartData:", cartData);
    }
    
    if (typeof itemCount !== 'undefined') {
        itemCount = window.cartStorage.reduce((total, item) => total + item.quantity, 0);
        console.log("Updated itemCount:", itemCount);
    }

    if (typeof renderCartItems === 'function') {
        renderCartItems(window.cartStorage);
    } else {
        console.log("renderCartItems function not found");
    }

    const cartCounter = document.querySelector(".cart-item_count");
    if (cartCounter) {
        const totalItems = window.cartStorage.reduce((total, item) => total + item.quantity, 0);
        cartCounter.innerHTML = totalItems;
        console.log("Updated cart counter to:", totalItems);
    } else {
        console.log("Cart counter element not found");
    }

    const cartUpdateEvent = new CustomEvent('cartUpdated', {
        detail: {
            cartStorage: window.cartStorage,
            itemCount: window.cartStorage.reduce((total, item) => total + item.quantity, 0)
        }
    });
    window.dispatchEvent(cartUpdateEvent);

    $.ajax({
        url: "http://localhost/web-programming-2025/assets/php/cart_products",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({
            user_id: parseInt(localStorage.getItem("user-id")),
            product_id: itemData.id,
            product_size: selectedSize,
            product_quantity: selectedQuantity
        }),
        success: function (response) {
            console.log("Item saved to API successfully:", response);
            
            if (typeof renderCartItems === 'function') {
                renderCartItems(window.cartStorage);
            }
            
            const cartCounter = document.querySelector(".cart-item_count");
            if (cartCounter) {
                const totalItems = window.cartStorage.reduce((total, item) => total + item.quantity, 0);
                cartCounter.innerHTML = totalItems;
            }
            
            alert("Product added to cart!");

        },
        error: function (xhr, status, error) {
            console.error("Error adding product to cart:", error);
            console.log("Error details:", {
                status: xhr.status,
                statusText: xhr.statusText,
                responseText: xhr.responseText
            });
            
            if (typeof renderCartItems === 'function') {
                renderCartItems(window.cartStorage);
            }
            
            alert("Product added to cart!");
        }
    });
};

