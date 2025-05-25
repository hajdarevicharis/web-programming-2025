var CartService = {
    delete_cart_product: function(cart_product_id) {
        // alert("DELETE " + product_id);
        if(confirm("Are you sure you want to remove the product with id " + cart_product_id + "?") == true) {
            RestClient.delete(
                // "delete_cart_product.php?id=" + cart_product_id,
                "cart_products/delete/" + cart_product_id,
                {},
                function(data) {
                    console.log("DELETED DATA " + data);

                    window.location.reload(); // necemo vidjeti na networku delete_cart_product.php zbog ovog jer instantly reloadamo

                    // toastr.success("Cart product removed");
                },
                function(error) {
                    console.log(error);
                }
            )
        }
    },
}