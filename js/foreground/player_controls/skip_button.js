//When clicked -- skips to the next song. Can't be clicked with only 1 song.
//Will skip from the end of the list to the front again.
var SkipButton = (function (){
	"use strict";
	var skipButton = $('#SkipButton');

    function skipSong() {
        Player.skipSong();
        //Prevent spamming by only allowing a next click once a second.
        setTimeout(function () { 
            skipButton.off('click').one('click', skipSong);
        }, 1000);
    }

    return {
    	//Paint the skipButton's path black and bind its click event.
    	enable: function(){
            skipButton.prop('src', "images/skip.png").removeClass('disabled').off('click').one('click', skipSong);
            skipButton.find('.path').css('fill', 'black');
    	},
    	//Paint the skipButton's path gray and unbind its click event.
    	disable: function(){
            skipButton.prop('src', "images/skip-disabled.png").addClass('disabled').off('click');
            $(skipButton).find('.path').css('fill', 'gray');
    	}
    };
});