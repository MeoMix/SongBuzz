require(['jquery', 'helpers', 'strings', 'underscore', 'supportedFormats', 'ytPlayerApiHelper', 'notifications'], function () {
    'use strict';
    $(function () {
        //Loaclize it!
        $.each($("[data-lang-id]"), function (key, node) {
            $(node).html(strings[$(node).attr("data-lang-id")][language]);
        });
        //Initialize scrubber
        require(['jquerySlider'], function() {
            $("#scrubber").slider({min: 0, max: 1000, slide: function(event, ui) {
                if (ytplayer.getDuration && ytplayer.seekTo) {
                    var duration = ytplayer.getDuration(),
                        value = ui.value
                    ytplayer.seekTo((value/1000) * duration)
                }
            }})
            var updateSlider = function() {
                if (ytplayer && ytplayer.getCurrentTime) {
                    var time = ytplayer.getCurrentTime();
                    var duration = ytplayer.getDuration()
                    $("#scrubber").slider("value", (time / duration * 1000));
                }
                setTimeout(function() {
                    updateSlider();
                }, 1000)
            }
            updateSlider()
        })
        //TODO: Multiple requires like this does not make sense.
        require(['player'], function () {});
        require(['playlists'], function (playlists) {
            playlists.drawPlaylists();
            playlists.addPlaylist("Cool music");
        });
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