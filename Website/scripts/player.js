define(['player_builder'], function (playerBuilder) {
    'use strict';
    var player;

    var onReady = function() {
        console.log("Ready");
    };

    var onStateChange = function () {
        //TODO: Remove global variable.
        window.updateIcon();
    };

    var onPlayerError = function () {
        console.error("Error!");
    };

    console.log("calling buildPlayer");
    //Create YT player iframe.
    playerBuilder.buildPlayer('MusicHolder', onReady, onStateChange, onPlayerError, function (builtPlayer) {
        player = builtPlayer;
    });

    return {
        play: function () {
            player.playVideo();
        },
        pause: function () {
            player.pauseVideo();
        },
        loadVideo: function (videoId) {
            player.loadVideoById(videoId);
        }
    };
});