
// console.log("HELLO");

ProductService.reload_product_datatable();
UserService.reload_user_datatable();

$("#add-product-form").validate({
    rules: {
        "name": {
            required: false
        },
        "brand": {
            required: true
        },
        "description": {
            required: true
        },
        "gender": {
            required: true
        },
        "category": {
            required: true
        },
        "rating": {
            required: true
        },
        "price": {
            required: true
        },
        "image": {
            required: false
        }
    },
    submitHandler: function(form, event) {

        console.log("HELLO 2");
        event.preventDefault(); // da mi ne submita
        Utils.block_ui("body");

        let product = serializeForm(form);
        console.log("PRODUCT: " + product);
        console.log("TEST ZA IMG: " + form["image"]["value"]);

        // form["name"]["image"] = convert_image_to_base64(form["image"]);
        


        console.log(JSON.stringify(product));

        // $.post(Constants.API_BASE_URL + "products/add", product)
        // .done(function (product) {
        //     Utils.unblock_ui("body");
        //     $("#admin-modal").modal("toggle");
        //     // console.log("UTILS: " + JSON.stringify(Utils));
        //     ProductService.reload_product_datatable();
        //     toastr.success("Product added successfully");
        // })

        // OVO ME ZADEVERALO, NE IDE Constants.API_BASE_URL + "products/add" NEGO SAMO "products/add"
        RestClient.post("products/add", product, function (response) {
            Utils.unblock_ui("body");
            toastr.success("Product added successfully");
            $("#admin-modal").modal("toggle");
            ProductService.reload_product_datatable();
        },
        function (error) {
        toastr.error(error);
        });


        $("#add-product-form")[0].reset();
    }
})

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

serializeForm = (form) => {
    let jsonResult = {};
    //console.log($(form).serializeArray());
    //serializeArray() reutrns an array of: name: [name of filed], value: [value of filed] for each field in the form
    $.each($(form).serializeArray(), function() {
        jsonResult[this.name] = this.value;
    });
    return jsonResult;
}

serializeForm_noviKojiIstoNeRadi = (form) => { // NE RADI NI OVAJ SA IMAGEOM
    let formData = new FormData(form);
    let jsonResult = {};
   
    formData.forEach((value, key) => {
      jsonResult[key] = value;
    });
  
    return jsonResult;
  }

  const convert_image_to_base64 = (file) => {
    if (file instanceof Blob) {
        const reader = new FileReader();
        
        reader.onload = function(event) {
            const base64String = event.target.result.split(',')[1]; // Extracting the base64 string from the data URL
            console.log(base64String); // Output the base64 string to console or use it as needed
        };
        
        reader.readAsDataURL(file);
    } else {
        console.error("Invalid file type or file not found.");
    }
}