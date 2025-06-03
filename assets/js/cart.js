let cartData = [];
let itemCount = 0;
let cartTotalPrice = 0;

const cartTotal = document.querySelector(".cart-total");
const cartItemCount = document.querySelector(".cart-item_count");
const cartBody = document.querySelector(".cart_body");

window.cartStorage = window.cartStorage || [];

$(document).ready(() => {
    if(Utils.get_from_localstorage("user")) {
        var user_id = parseInt(Utils.get_localstorage_user_value("id"));
        
        RestClient.get(`cart_products/user/${user_id}`, 
            function(data) {
                console.log("=== CART DATA DEBUG ===");
                console.log("Raw cart data:", data);
                console.log("Type:", typeof data);
                console.log("Is array:", Array.isArray(data));
                
                let cartItems = [];
                
                if (!data) {
                    console.log("No data returned from API, using in-memory storage");
                    cartItems = window.cartStorage;
                } else if (Array.isArray(data)) {
                    cartItems = data;
                } else if (data.cart_items && Array.isArray(data.cart_items)) {
                    cartItems = data.cart_items;
                } else if (data.data && Array.isArray(data.data)) {
                    cartItems = data.data;
                } else if (data.products && Array.isArray(data.products)) {
                    cartItems = data.products;
                } else if (data.items && Array.isArray(data.items)) {
                    cartItems = data.items;
                } else if (typeof data === 'object') {
                    console.log("Data is object, attempting to extract array or use as single item");
                    if (data.id || data.product_id) {
                        cartItems = [data];
                    } else {
                        const possibleArrays = Object.values(data).filter(value => Array.isArray(value));
                        if (possibleArrays.length > 0) {
                            cartItems = possibleArrays[0];
                        } else {
                            console.error("Could not find cart items array in object:", data);
                            cartItems = window.cartStorage;
                        }
                    }
                } else {
                    console.error("Unexpected data format:", typeof data);
                    cartItems = window.cartStorage;
                }

                console.log("Cart items to process:", cartItems);
                
                cartData = [];
                itemCount = 0;
                cartTotalPrice = 0;

                if (Array.isArray(cartItems) && cartItems.length > 0) {
                    cartItems.forEach(instance => {
                        cartData.push(instance);
                        itemCount += instance.quantity || instance.product_quantity || 1;
                    });
                    
                    window.cartStorage = cartData;
                } else {
                    console.log("No cart items found, keeping existing in-memory storage");
                    cartData = window.cartStorage;
                    itemCount = window.cartStorage.reduce((total, item) => total + (item.quantity || 1), 0);
                }
                
                console.log("Processed cartData:", cartData);
                console.log("Item count:", itemCount);
                
                renderCartItems(cartData);
                
                if (cartItemCount) {
                    cartItemCount.innerHTML = itemCount;
                }
            },
            function(error) {
                console.error("Error fetching cart data:", error);
                console.log("Error status:", error.status);
                console.log("Error response:", error.responseText);
                if (error.responseJSON && error.responseJSON.message) {
                    console.error("Error message:", error.responseJSON.message);
                }
                
                if (window.cartStorage && window.cartStorage.length > 0) {
                    console.log("Using fallback cart storage:", window.cartStorage);
                    cartData = window.cartStorage;
                    itemCount = window.cartStorage.reduce((total, item) => total + (item.quantity || 1), 0);
                    renderCartItems(cartData);
                    if (cartItemCount) {
                        cartItemCount.innerHTML = itemCount;
                    }
                } else {
                    console.log("No cart data available, cart will be empty");
                    renderCartItems([]);
                }
            }
        );
    } else {
        console.log("User not logged in, checking for local cart data");
        if (window.cartStorage && window.cartStorage.length > 0) {
            cartData = window.cartStorage;
            itemCount = window.cartStorage.reduce((total, item) => total + (item.quantity || 1), 0);
            renderCartItems(cartData);
            if (cartItemCount) {
                cartItemCount.innerHTML = itemCount;
            }
        }
    }
});

renderCartItems = (cartDataArray) => {
    console.log("=== RENDERING CART ITEMS ===");
    console.log("Items to render:", cartDataArray);
    
    if (cartBody) {
        $(cartBody).empty();
    }
    
    cartTotalPrice = 0;
    
    if (!cartDataArray || cartDataArray.length === 0) {
        console.log("No items to render");
        if (cartBody) {
            cartBody.innerHTML = '<div class="row"><div class="col-12"><p class="text-center">Your cart is empty</p></div></div>';
        }
        if (cartTotal) {
            cartTotal.innerHTML = '$0.00';
        }
        return;
    }
    
    cartDataArray.forEach((instance, index) => {
        console.log(`Processing cart item ${index + 1}:`, instance);
        
        let item = document.createElement("div");
        
        const quantity = instance.quantity || instance.product_quantity || 1;
        const price = parseFloat(instance.price || instance.product_price || 0);
        const itemTotal = quantity * price;
        cartTotalPrice += itemTotal;
        
        const productName = instance.name || instance.product_name || 'Unknown Product';
        const productImage = instance.image || instance.product_image || 'assets/img/shop_03.jpg';
        const productSize = instance.size || instance.product_size || 'N/A';
        
        console.log(`Item: ${productName}, Qty: ${quantity}, Price: ${price}, Total: ${itemTotal}`);

        item.classList.add("row");
        item.innerHTML = `
            <div class="col-lg-3 col-md-12 mb-4 mb-lg-0">
                <!-- Image -->
                <div class="bg-image hover-overlay hover-zoom ripple rounded" data-mdb-ripple-color="light">
                    <img
                        src="${productImage}"
                        class="w-100"
                        alt="${productName}"
                        onerror="this.src='assets/img/shop_03.jpg'"
                    />
                    <a href="#!">
                        <div class="mask" style="background-color: rgba(251, 251, 251, 0.2)"></div>
                    </a>
                </div>
                <!-- Image -->
            </div>

            <div class="col-lg-5 col-md-6 mb-4 mb-lg-0">
                <!-- Data -->
                <p><strong>${productName}</strong></p>
                <p>Quantity: <span><strong>${quantity}</strong></span></p>
                <p>Size: <strong>${productSize}</strong></p>
                <p>Price: <strong>$${price.toFixed(2)}</strong></p>
                <p>Total: <strong>$<span>${itemTotal.toFixed(2)}</span></strong></p>
                <button
                    type="button"
                    class="btn btn-primary btn-sm me-1 mb-2"
                    data-mdb-toggle="tooltip"
                    title="Remove item"
                    onclick="removeCartItem(${instance.id || instance.product_id})"
                >
                    <i class="fas fa-trash"></i>
                </button>
                <!-- Data -->
            </div>
            <hr class="my-4" />
        `;

        if (cartBody) {
            cartBody.appendChild(item);
        } else {
            console.error("Cart body element not found!");
        }
    });

    console.log("Final cart total:", cartTotalPrice);
    if (cartTotal) {
        cartTotal.innerHTML = `$${cartTotalPrice.toFixed(2)}`;
    }
    
    console.log("=== CART RENDERING COMPLETE ===");
}

removeCartItem = (cartItemId) => {
    console.log("Removing cart item:", cartItemId);
    
    const itemIndex = window.cartStorage.findIndex(item => 
        (item.id && item.id == cartItemId) || 
        (item.product_id && item.product_id == cartItemId)
    );
    
    if (itemIndex !== -1) {
        window.cartStorage.splice(itemIndex, 1);
        console.log("Removed from in-memory storage");
        
        cartData = window.cartStorage;
        itemCount = window.cartStorage.reduce((total, item) => total + (item.quantity || 1), 0);
        
        renderCartItems(cartData);
        
        if (cartItemCount) {
            cartItemCount.innerHTML = itemCount;
        }
    }
    
    if (Utils.get_from_localstorage("user")) {
        if (typeof CartService !== 'undefined' && CartService.delete_cart_product) {
            CartService.delete_cart_product(cartItemId);
        } else {
            RestClient.delete(`cart_products/${cartItemId}`, {},
                function(response) {
                    console.log("Item removed from API successfully:", response);
                },
                function(error) {
                    console.error("Error removing item from API:", error);
                }
            );
        }
    }
}

removeItemFromUI = (button) => {
    console.log("Removing item from UI");
    const rowElement = $(button).closest(".row");
    
    const itemTotalText = rowElement.find("p:contains('Total:') span").text();
    const itemTotal = parseFloat(itemTotalText.replace('$', '')) || 0;
    
    cartTotalPrice -= itemTotal;
    if (cartTotal) {
        cartTotal.innerHTML = `$${cartTotalPrice.toFixed(2)}`;
    }
    
    itemCount--;
    if (cartItemCount) {
        cartItemCount.innerHTML = itemCount;
    }
    
    rowElement.remove();
}