var UserService = {
    reload_user_datatable: function() {
        Utils.get_datatable("admin-table-users", Constants.get_api_base_url() + "users",
            // napomena: ova data se referencea na podatke koje cemo stavit u columns, a ne na column name, tako da, ako je prva
            // data: "action", to znaci da ce se u prvu kolonu stavljati podaci od "action", ako bi prvo stavili data: firstName
            // u prvu kolonu sa titleom Action, bi se upisivali firstName-s
            [{data: "action"}, {data: "id"}, {data: "firstName"}, {data: "lastName"}, {data: "email"}, {data: "isAdmin"}, {data: "createdAt"}],
            null,
            function() {
                console.log("datatable drawn");
            }
        );
    },
    delete_user: function(user_id) {
        // alert("DELETE " + product_id);
        if(confirm("Are you sure you want to delete the user with id " + user_id + "?") == true) {
            RestClient.delete(
                // "delete_user.php?id=" + user_id,
                "users/delete/" + user_id,
                {},
                function(data) {
                    UserService.reload_user_datatable();
                    console.log("DELETED DATA " + data);
                    toastr.success("User deleted");
                },
                function(error) {
                    console.log(error);
                }
            )
        }
    },
}