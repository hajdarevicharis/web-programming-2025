$(document).ready(function() {
    $(".checkout-form").validate({
        rules: {
            "checkout-first_name": {
                required: true,
                minlength: 2
            },
            "checkout-last_name": {
                required: true,
                minlength: 2
            },
            "checkout-email": {
                required: true,
                email: true
            }
        },
        messages: {
            "checkout-first_name": "Please enter your first name",
            "checkout-last_name": "Please enter your last name",
            "checkout-email": "Please enter a valid email address"
        },
        submitHandler: function(form, event) {
            event.preventDefault();
            processOrder();
        }
    });
});

function processOrder() {

    if (!Utils.get_from_localstorage("user")) {
        alert("Please log in to complete your purchase.");
        return;
    }

    const cartItems = window.cartStorage || [];
    if (cartItems.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    const total = cartItems.reduce((sum, item) => {
        const price = parseFloat(item.price || item.product_price || 0);
        const quantity = parseInt(item.quantity || item.product_quantity || 1);
        return sum + (price * quantity);
    }, 0);

    const orderData = {
        user_id: parseInt(Utils.get_localstorage_user_value("id")),
        payment_id: null,
        order_details: {
            total_amount: total.toFixed(2)
        },
        items: cartItems.map(item => ({
            product_id: item.product_id || item.id,
            quantity: parseInt(item.quantity || item.product_quantity || 1)
        }))
    };

    RestClient.post("orders", orderData,
        function(response) {
            clearCart();
            alert(`Order placed successfully! Order ID: ${response.order_id}`);
            $(".checkout-form")[0].reset();
        },
        function(error) {
            console.error("Order failed:", error);
            alert("There was an error processing your order. Please try again.");
        }
    );
}

function clearCart() {
    window.cartStorage = [];

    const cartCounter = document.querySelector(".cart-item_count");
    if (cartCounter) {
        cartCounter.innerHTML = "0";
    }

    const userId = parseInt(Utils.get_localstorage_user_value("id"));
    RestClient.delete(`cart_products/user/${userId}/clear`, {},
        function(response) {
            console.log("Cart cleared");
        },
        function(error) {
            console.log("Could not clear cart from backend");
        }
    );
}
