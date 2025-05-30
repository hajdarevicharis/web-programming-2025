let cartData = [];
let itemCount = 0;
let cartTotalPrice = 0;

const cartTotal = document.querySelector(".cart-total");
const cartItemCount = document.querySelector(".cart-item_count");
const cartBody = document.querySelector(".cart_body");

$("document").ready( () => {
    // fetchCartData("../assets/json/cart.json");

    if(Utils.get_from_localstorage("user")) {
        var user_id = parseInt(Utils.get_localstorage_user_value("id"));
        // var user_id = 5;

        // fetchCartData(Constants.API_BASE_URL + `cart_products/${user_id}`);
        RestClient.get(`cart_products/user/${user_id}`, function(data) {
            console.log("Data fetched: ", data);

            data.forEach(instance => {
                cartData.push(instance);
                itemCount++;
                //console.log("FETCHED DATA = ", fetchedData)
            })
            console.log("Data added to cartData: ", cartData);
            // da nam po defaultu rendera iteme cim udjemo na site
            renderItems(cartData);
            cartItemCount.innerHTML = itemCount;
            });
    } else {
        alert("You are not logged in!");
    }

    // fetchCartData(Constants.API_BASE_URL + "cart_products/${}");
})

fetchCartData = (dataUrl) => {
    $.get(dataUrl, (data) => {
        console.log("Data fetched: ", data);

        data.forEach(instance => {
            cartData.push(instance);
            itemCount++;
            //console.log("FETCHED DATA = ", fetchedData)
        })
        console.log("Data added to cartData: ", cartData);
        // da nam po defaultu rendera iteme cim udjemo na site
        renderItems(cartData);
        cartItemCount.innerHTML = itemCount;
    });
} 

renderItems = (cartDataArray) => {
    // unutar forEach moramo imati async, a ne iznad, jer je forEach() prva parent funkcija gdje se await nalazi
    cartDataArray.forEach(async instance => {
        let item = document.createElement("div");

        //let productInfo = await fetchDataWithId(instance.productId, "./assets/json/products.json");
        //console.log("Item info: ", productInfo);

        cartTotalPrice += (instance.quantity * instance.price);
        //console.log("cartTotalPrice: ", cartTotalPrice);

        item.classList.add("row");
        item.innerHTML = `
        <div class="col-lg-3 col-md-12 mb-4 mb-lg-0">
            <!-- Image -->
            <div
            class="bg-image hover-overlay hover-zoom ripple rounded"
            data-mdb-ripple-color="light"
            >
            <img
                src="assets/img/shop_03.jpg"
                class="w-100"
                alt="Blue Jeans Jacket"
            />
            <a href="#!">
                <div
                class="mask"
                style="background-color: rgba(251, 251, 251, 0.2)"
                ></div>
            </a>
            </div>
            <!-- Image -->
        </div>

        <div class="col-lg-5 col-md-6 mb-4 mb-lg-0">
            <!-- Data -->
            <p><strong>${instance.name}</strong></p>
            <p>Quantity: <span><strong>${instance.quantity}</strong></span></p>
            <p>Size: <strong>${instance.size}</strong></p>
            <p>Total: <strong>$<span>${(instance.quantity * instance.price).toFixed(2)}</span></strong></p> <!-- toFixed rounda na dvije decimale -->
            <button
            type="button"
            class="btn btn-primary btn-sm me-1 mb-2"
            data-mdb-toggle="tooltip"
            title="Remove item"
            onclick=CartService.delete_cart_product(${instance.id})
            >
            <i class="fas fa-trash"></i>
            </button>
            <!-- Data -->
        </div>
        <hr class="my-4" />
        `;

        cartBody.append(item);
        // ovdje se nakon svakog loopa updatea cartTotal dok ne dodje do kraja
        cartTotal.innerHTML = cartTotalPrice;
    });

    // IZ NEKOG RAZLOGA OVO SE PRVO IZVRSI PRIJE forEach() I CART TOTAL PRICE VAZDA BUDE 0
    // console.log("Cart total price while adding: ", cartTotalPrice);
    // cartTotal.innerHTML = cartTotalPrice;
}

removeItem = (button) => {
    console.log("REMOVE");
    // button in this case refers to the button we specified in the onClick attribute onClick=removeItem(this)
    $(button).closest(".row").remove();
}