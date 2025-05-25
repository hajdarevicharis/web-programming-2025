const Utils = {
    block_ui: function (element) {
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
    },
    unblock_ui: function (element) {
      $(element).unblock({});
    },
    get_datatable: function (
        table_id,
        url,
        columns,
        disable_sort,
        callback,
        details_callback = null,
        sort_column = null,
        sort_order = null,
        draw_callback = null,
        page_length = 10
      ) {
        var userDataString = Utils.get_from_localstorage("user");
        var userData = JSON.parse(userDataString);
        
        var token = "Undefined";
        if(userData != null) {
          token = userData.token;
        }

        if ($.fn.dataTable.isDataTable("#" + table_id)) {
          details_callback = false;
          $("#" + table_id)
            .DataTable()
            .destroy();
        }
        var table = $("#" + table_id).DataTable({
          order: [
            sort_column == null ? 2 : sort_column,
            sort_order == null ? "desc" : sort_order,
          ],
          orderClasses: false,
          columns: columns,
          columnDefs: [{ orderable: false, targets: disable_sort }],
          processing: true,
          serverSide: true,
          ajax: {
            url: url,
            type: "GET",
            headers: {
              // "Authentication" : JSON.parse(Utils.get_from_localstorage("user")).token
              "Authentication": token
            }
          },
          lengthMenu: [
            [5, 10, 15, 50, 100, 200, 500, 5000],
            [5, 10, 15, 50, 100, 200, 500, "ALL"],
          ],
          pageLength: page_length,
          initComplete: function () {
            if (callback) callback();
          },
          drawCallback: function (settings) {
            if (draw_callback) draw_callback();
          },
        });
    },
    set_to_localstorage: function(key, value) {
      window.localStorage.setItem(key, JSON.stringify(value)); // BEZ JSON.stringify Storage {user: '[object Object]'
    },
    get_from_localstorage: function(key) {
      return window.localStorage.getItem(key);
    },
    get_localstorage_user_value : function(key) {
      return JSON.parse(this.get_from_localstorage("user"))[key];
    },
    logout: function() {
      if(confirm("Are you sure you want to log out of your account?")) {
        window.localStorage.clear();
        window.location.reload(); // bez ove linije, redirecta na login page, ali ne reloada page
      } else {
        console.log("Cancelled logout");
      }
    }
  };