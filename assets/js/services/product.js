console.log("Product service page works");

var ProductService = {
    reload_product_datatable: function() {
        Utils.get_datatable("admin-table-products", Constants.get_api_base_url() + "products", // BILO get_products.php UMJESTO PRODUCTS, zato sto smo to specifirali za FlightPHP
            //[{data: "user-firstname"}, {data: "user-lastname"}, {data: "user-email"}, {data: "user-created-at"}], NE RADI OVAKO, dole stavimo index umjesto name
            // [{data: 0}, {data: 1}, {data: 2}, {data: 3}, {data: 4}, {data: 5}, {data: 6}, {data: 7}],
            [{data: "action"}, {data: "name"}, {data: "brand"}, {data: "description"}, {data: "gender"}, {data: "category"}, {data: "rating"}, {data: "price"}, {data: "createdAt"}],
            null,
            function() {
                console.log("datatable drawn");
            }
        );
    },
    open_edit_product_modal : function(product_id) {
         console.log("EDIT " + product_id);
        RestClient.get(
            // "get_product.php?id=" + product_id,
            "products/" + product_id,
            function(data) {
                console.log("PRODUCT DATA CAME, " + JSON.stringify(data));
                console.log("data id " + data.id);
                console.log("ID FIELD: ", $("#add-product-form input[name='id']"));
                console.log("ID FILED V2", document.querySelector("#product-admin-id"));
                
                $("#admin-modal").modal("toggle");
                $("#add-product-form input[name='id']").val(data.id); // cak i bez ove linije, hidden id input stavi da je value createdAt?? :( [UPDATE: BUG JE ISPOD KOMENTIRANA LINIJA]
                // $("#product-admin-id").val(data.id);
                // document.querySelector("#product-admin-id").value = data.id;
                $("#add-product-form input[name='name']").val(data.name);
                $("#add-product-form input[name='brand']").val(data.brand);
                $("#add-product-form input[name='description']").val(data.description);
                $("#add-product-form input[name='gender']").val(data.gender);
                $("#add-product-form input[name='category']").val(data.category);
                $("#add-product-form input[name='rating']").val(data.rating);
                $("#add-product-form input[name='price']").val(data.price);
                //$("#add-product-form input[name='id']").val(data.createdAt); 
            }
        )
    },
    delete_product: function(product_id) {
        // alert("DELETE " + product_id);
        if(confirm("Are you sure you want to delete product with id " + product_id + "?") == true) {
            RestClient.delete(
                // "delete_product.php?id=" + product_id,
                "products/delete/" + product_id,
                {},
                function(data) {
                    // ProductService.reload_product_datatable();
                    console.log("DELETE DATA " + data);
                    toastr.success("Product deleted");
                },
                function(error) {
                    console.log(error);
                }
            )
        }
    },
}