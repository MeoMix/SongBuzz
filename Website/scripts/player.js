//TODO: This shouldn't be global, need to refactor so that it is possible.
var ytplayer;
define(['playerBuilder'], function (playerBuilder) {
    'use strict';

    var onReady = function () {
        $("#songtable").removeClass("notready")
    };

    var onStateChange = function () {
        //TODO: Remove global variable.
        if(updateIcon) {
            updateIcon();
        }
    };

    var onPlayerError = function () {
        console.error("Error!");
    };

    console.log("calling buildPlayer");
    //Create YT player iframe.
    playerBuilder.buildPlayer('MusicHolder', onReady, onStateChange, onPlayerError, function (builtPlayer) {
        ytplayer = builtPlayer;
    });
    return {
        play: function () {
            ytplayer.playVideo();
        },
        pause: function () {
            ytplayer.pauseVideo();
        },
        loadVideo: function (videoId) {
            if (ytplayer) {
                ytplayer.loadVideoById(videoId);
            }
            
        }
    };
});