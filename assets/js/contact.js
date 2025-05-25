let contacts = [];

$("#contact-form").validate({
    rules: {
        "contact-name": {
            required: true,
            minlength: 5
        },
        "contact-email": {
            required: true,
            email: true
        },
        "contact-subject": {
            required: true
        },
        "contact-message": {
            required: true,
            minlength: 10
        }
    },
    messages: {
        "contact-name": {
            required: "Please enter your name"
        },
        "contact-email": {
            required: "Please enter an email"
        },
        "contact-subject": {
            required: "Please enter a subject"
        },
        "contact-message": {
            required: "Please enter a message you want to send",
            minlength: "Please enter a valid message"
        }
    },
    submitHandler: function(form, event) {
        event.preventDefault(); // da mi ne submita
        blockUi("body");
        let contact = serializeForm(form);
        console.log(JSON.stringify(contact));

        contacts.push(contact);
        console.log("CONTACTS = ", contacts);
        $("#contact-form")[0].reset();

        unblockUi("body");
    }
});

// $("body").click(() => {
//     $("input:blank").css("border", "1px solid red");
//     $("textarea:blank").css("border", "1px solid red");

//     $("input:filled").css("border", "1px solid rgba(20, 20, 20, 0.1)");
//     $("textarea:filled").css("border", "1px solid rgba(20, 20, 20, 0.1)");
// })

// $("input:blank").focus(() => {
//     $("input:blank").css("border", "1px solid red");
//     $("textarea:blank").css("border", "1px solid red");

//     $("input:filled").css("border", "1px solid rgba(20, 20, 20, 0.1)");
//     $("textarea:filled").css("border", "1px solid rgba(20, 20, 20, 0.1)");
// })

// $("textarea:blank").focus(() => {
//     $("input:blank").css("border", "1px solid red");
//     $("textarea:blank").css("border", "1px solid red");

//     $("input:filled").css("border", "1px solid rgba(20, 20, 20, 0.1)");
//     $("textarea:filled").css("border", "1px solid rgba(20, 20, 20, 0.1)");
// })

// ovo gore iznad skraceno i komplikovanije
$("body").on("click focus", "input, textarea", function() {
    const $inputs = $("input, textarea");
    const $blankInputs = $inputs.filter(function() {
        return !$(this).val().trim();
    });

    $inputs.css("border", "1px solid rgba(20, 20, 20, 0.1)");
    $blankInputs.css("border", "1px solid red");
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