//TODO: This shouldn't be global, need to refactor so that it is possible.
var ytplayer;
define(['playerBuilder'], function (playerBuilder) {
    'use strict'
    var onPlayerError = function () {
        console.error("Error!");
    };
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