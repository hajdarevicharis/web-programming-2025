let checkoutFormInfo = [];

$(document).ready(function() {
    $(".custom-select").select2({
    });

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
            },
            "checkout-address": {
                required: true,
                minlength: 4
            },
            "checkout-city": {
                required: true,
            },
            "checkout-country": {
                required: true,
            },
            "checkout-zip": {
                required: true,
                minlength: 3,
                digits: true
            },
            "checkout-card_name": {
                required: true,
                minlength: 4
            },
            "checkout-card_number": {
                required: true,
                minlength: 16,
                digits: true
            },
            "checkout-card_expiration": {
                required: true,
                dateISO: true
            },
            "checkout-card_ccv": {
                required: true,
                minlength: 3,
                digits: true
            }
        },
        messages: {
            "checkout-first_name": {
                required: "You must enter the first name",
                minlength: "Enter a valid name"
            },
            "checkout-last_name": {
                required: "You must enter the last name",
                minlength: "Enter a valid last name"
            },
            "checkout-email": {
                required: "You must enter an email",
                email: "Enter a valid email address"
            },
            "checkout-address": {
                required: "You must enter an address",
                minlength: "Enter a valid address"
            },
            "checkout-city": {
                required: "You must enter a city"
            },
            "checkout-country": {
                required: "You must select a country"
            },
            "checkout-zip": {
                required: "You must enter a zip code",
                minlength: "Enter a valid zip code",
                digits: "Enter only digits"
            },
            "checkout-card_name": {
                required: "You must enter the cardholder's name",
                minlength: "Enter a valid cardholder's name"
            },
            "checkout-card_number": {
                required: "You must enter the card number",
                minlength: "Enter a valid card number",
                digits: "Enter only digits"
            },
            "checkout-card_expiration": {
                required: "You must enter the card expiration date",
                dateISO: "Enter a valid date in ISO format (YYYY-MM-DD)"
            },
            "checkout-card_ccv": {
                required: "You must enter the CCV code",
                minlength: "Enter a valid CCV code",
                digits: "Enter only digits"
            }
        },
        submitHandler: function(form, event) {
            event.preventDefault(); // da mi ne submita
            blockUi("body");
            let checkoutInfo = serializeForm(form);
            console.log(JSON.stringify(checkoutInfo));

            checkoutFormInfo.push(checkoutInfo);
            console.log("CHECKOUT INFO = ", checkoutFormInfo);
            // $(".checkout-form")[0].reset();
            form.reset();

            unblockUi("body");
        }
    });

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
});