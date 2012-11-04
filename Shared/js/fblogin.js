define(function () {
    'use strict';

    var logout = function() {
        localStorage.clear();
        window.location.reload();
    };

    return {
        createLoginButton: function (loginButton, loginString, accountArea) {
            var url = window.location.href;

            //When site is loaded, change from "Loading" to "Login"
            loginButton.text("Login");
            loginButton.click(function () {
                window.location.href = '../backend/fb/auth.php';
            });
            //Receive Facebook callback and push to localStorage
            var name = Helpers.getUrlParamaterValueByName(url, "name");
            console.log("Name:", name);
            if (name != "") {
                var user = {
                    name: name,
                    prename: Helpers.getUrlParamaterValueByName(url, "prename"),
                    id: Helpers.getUrlParamaterValueByName(url, "id"),
                    authkey: Helpers.getUrlParamaterValueByName(url, "authkey")
                };
                $.each(user, function (k, v) {
                    localStorage[k] = v;
                });
                history.pushState(null, "SongBuzz", "/Website");
            }

            if (localStorage['name'] != null) {
                //Hide login button
                loginButton.remove();
                //Change the label from "Login" to "Account"
                loginString.text(strings.account[language]);

                //Show profile image
                var profile = $("<div>", {
                    'class': "fb-profile"
                });

                $("<img>", {
                    'class': "fb-profile-image",
                    src: "https://graph.facebook.com/" + localStorage['id'] + "/picture"
                }).appendTo(profile);

                //Show name
                $("<span>", {
                    'class': "fb-name-label",
                    html: "<span>" + localStorage['prename'] + "</span>" + localStorage['name']
                }).appendTo(profile);

                profile.appendTo(accountArea);

                //Logout button
                $("<button>", {
                    'class': "sidebar-button",
                    text: 'Log out',
                    click: function () {
                        logout();
                    }
                }).appendTo(accountArea);
            }
        }
    };
})