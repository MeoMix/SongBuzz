//Displays the currently playing song or a default welcome message.
define(function(){
    'use strict';
    var header = $('#Header'), title = $('#HeaderTitle'), defaultCaption = 'Welcome to SongBuzz!';

    //Scroll the song in the title if its too long to read.
    title.mouseover(function () {
        var distanceToMove = $(this).width() - header.width();
        var duration = 15 * distanceToMove; //Just a feel good value; scales as the text gets longer.
        $(this).animate({ 
            marginLeft: "-" + distanceToMove + "px" }, {
            duration: duration,
            easing: 'linear'} );
    }).mouseout(function () {
        $(this).stop(true).animate({ marginLeft: "0px" });
    });

    return {
        updateTitle: function () {
            var currentSong = chrome.extension.getBackgroundPage().YoutubePlayer.currentSong;
            var text = currentSong ? currentSong.title : defaultCaption;
            title.text(text);
        }
    };
});