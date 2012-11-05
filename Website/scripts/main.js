require(['jquery', 'helpers', 'strings'], function () {
    'use strict';
    $(function () {
        $.each($("[data-lang-id]"), function(key, node) {
            $(node).html(strings[$(node).attr("data-lang-id")][language])
        })
        
        require(['bindings', 'recognition', 'contextmaster', 'underscore']);
        define(['fblogin'], function (fblogin) {
            var loginButton = $('#login-button');
            var loginString = $('#login-string');
            var accountArea = $('#account-area');
            fblogin.createLoginButton(loginButton, loginString, accountArea);
        });
    });
});