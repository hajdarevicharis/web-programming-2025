let logins = [];

if(Utils.get_from_localstorage("user")) {
    window.location = "../Web-Programming-2024";
}

$("#login-form").validate({
    rules: {
        "login-email": {
            required: true,
            email: true
        },
        "login-password": {
            required: true
        },
    },
    messages: {
        "login-email": {
            required: "Please enter your email",
            email: "Please enter a correct email"
        },
        "login-password": {
            required: "Please enter a password"
        }
        
    },
    submitHandler: function(form, event) {
        event.preventDefault(); // da mi ne submita

        Utils.block_ui("body");
        let login = serializeForm(form);
        console.log(JSON.stringify(login));

        RestClient.post(
            "auth/login",
            login,
            function(response) {
                $("#login-form")[0].reset();
                Utils.unblock_ui("body");
                Utils.set_to_localstorage("user", response);
                // Utils.set_to_localstorage("user", JSON.parse(response));
                console.log("Response is ", response);

                window.location = "../Web-Programming-2024";
            },
            function(error) {
                Utils.unblock_ui("body");
                toastr.error(error.responseText);
            }
        );

    }
});

serializeForm = (form) => {
    let jsonResult = {};
    //console.log($(form).serializeArray());
    //serializeArray() reutrns an array of: name: [name of filed], value: [value of filed] for each field in the form
    $.each($(form).serializeArray(), function() {
        jsonResult[this.name] = this.value;
    });
    return jsonResult;
}