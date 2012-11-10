require(['jquery', 'helpers', 'strings', 'underscore', 'jquery-ui'], function () {
    'use strict';
    $(function () {
        $.each($("[data-lang-id]"), function (key, node) {
            $(node).html(strings[$(node).attr("data-lang-id")][language]);
        });
        require(['playlists'], function (playlists) {
            playlists.drawPlaylists();
            playlists.addPlaylist("Cool music")
        })
        require(['bindings', 'recognition', 'contextmaster'], function () {
            require(['fblogin'], function (fblogin) {
                var loginButton = $('#login-button');
                var loginString = $('#login-string');
                var accountArea = $('#account-area');
                fblogin.createLoginButton(loginButton, loginString, accountArea);
            });
        });

    });
});