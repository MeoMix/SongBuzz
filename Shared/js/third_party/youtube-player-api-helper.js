//Provides an interface to the YouTube iFrame.
//Starts up Player/SongValidator object after receiving a ready response from the YouTube API.
define(['onYouTubePlayerAPIReady'], function () {
    'use strict';
    var events = {
        onApiReady: 'onApiReady'
    };

    //This code will trigger onYouTubePlayerAPIReady
    $(window).load(function () {
        $('script:first').before($('<script/>', {
            src: 'https://www.youtube.com/iframe_api'
        }));
    });

    return {
        ready: function () {
            $(this).trigger(events.onApiReady);
        },
        onApiReady: function (event) {
            $(this).on(events.onApiReady, event);
        }
    };
});