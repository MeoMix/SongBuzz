require(['jquery', 'helpers'], function () {
    'use strict';
    $(function () {
        require(['strings', 'libraryController', 'albums', 'bindings', 'recognition', 'contextmaster', 'underscore']);

        define(['fblogin'], function (fblogin) {
            var loginButton = $('#login-button');
            var loginString = $('#login-string');
            var accountArea = $('#account-area');
            fblogin.createLoginButton(loginButton, loginString, accountArea);
        });

    });
});