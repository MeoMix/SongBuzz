//Displays the currently playing song or a default welcome message.
function Header() {
    "use strict";
    var header = $('#Header');
    var title = $('#HeaderTitle');
    var defaultCaption = 'Welcome to SongBuzz!';

    //Scroll the song in the title if its too long to read.
    title.mouseover(function (e) {
        var distanceToMove = $(this).width() - header.width();
        var duration = 15 * distanceToMove; //Just a feel good value; scales as the text gets longer.
        $(this).animate({ 
            marginLeft: "-" + distanceToMove + "px" }, {
            duration: duration,
            easing: 'linear'} );
    }).mouseout(function (e) {
        $(this).stop(true).animate({ marginLeft: "0px" });
    });

    return {
        updateTitle: function (currentSong) {
            var text = currentSong ? currentSong.name : defaultCaption;
            title.text(text);
        }
    };
}