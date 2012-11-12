//TODO: This shouldn't be global, need to refactor so that it is possible.
var player;
define(['playerBuilder'], function (playerBuilder) {
    'use strict';

    var onReady = function () {
        console.log("Ready");
    };

    var onStateChange = function () {
        //TODO: Remove global variable.
        if(window.updateIcon) {
            window.updateIcon();
        }
    };

    var onPlayerError = function () {
        console.error("Error!");
    };

    console.log("calling buildPlayer");
    //Create YT player iframe.
    playerBuilder.buildPlayer('MusicHolder', onReady, onStateChange, onPlayerError, function (builtPlayer) {
        console.log("builtPlayer");
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