define(function() {
    'use strict';
    var domain = 'http://songbuzzapp.com/';
    var url = domain + 'backend/songs/add.php';

    var events = {
        onSaveData: 'onSaveData'
    };

    //Public methods:
    return {
        saveData: function(data, prevent) {
            var self = this;
            $.ajax({
                url: url,
                data: data,
                dataType: "json",
                // [Meo] TODO: This function is called success, yet it checks the result of success. Why?
                // [Jonny] It checks if there was a database error.
                // [Meo] If a DB error occurs, why is success called?
                // [Jonny] If a DB error occurs, success === "false" is the case. The function is a standard jQuery name
                success: function(json) {
                    if (json.success === "true") {
                        if (prevent != undefined) {
                            data.prevent = prevent;
                        }
                        $(self).trigger(events.onSaveData, data);
                    }
                }
            });
        },
        onSaveData: function(event) {
            $(this).bind(events.onSaveData, event);
        },
        userLibrary: function(method, data) {
            //method can be remove or add
            var urlmethod = domain + "backend/fb/" + method + "Song.php";
            $.ajax({
                url: urlmethod,
                data: data,
                dataType: "json",
                success: function(json) {
                    var status = json["status_code"];
                    if (status == "0") {
                        console.log("Song added to users library successfully.");
                    } else if (status == "1") {
                        console.log("Song not added to user library. Backend error.");
                    } else if (status == "2") {
                        console.log("Song not added to user library. Database error.");
                    } else if (status == "3") {
                        console.log("Song was already in list.");
                    }
                }
            });
        }
    };
});

