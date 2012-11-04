require(['jquery', 'helpers', 'strings'], function () {
    'use strict';
    $(function () {
        require(['libraryController', 'albums', 'bindings', 'recognition', 'contextmaster', 'underscore']);
        define(['fblogin'], function (fblogin) {
            var loginButton = $('#login-button');
            var loginString = $('#login-string');
            var accountArea = $('#account-area');
            fblogin.createLoginButton(loginButton, loginString, accountArea);

        });
        });
});