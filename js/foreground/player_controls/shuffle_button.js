//When clicked -- shuffles the playlist. Doesn't affect curently playing song at all.
//Can't be clicked with 2 or fewer songs.
var ShuffleButton = (function(){
	"use strict";
	var shuffleButton = $('#ShuffleButton');

    var shuffleEnabled = localStorage.getItem("ShuffleEnabled");

    if(shuffleEnabled === "true"){
    	shuffleButton.addClass('pressed');
    }

	function shuffleSong(){
		if(shuffleButton.hasClass('pressed')){
			shuffleButton.removeClass('pressed');
			localStorage.setItem('ShuffleEnabled', false);
		}
		else{
			shuffleButton.addClass('pressed');
			localStorage.setItem('ShuffleEnabled', true);
		}
	}

	return {
		disable: function(){
            shuffleButton.find('path').css('fill', 'gray');
            shuffleButton.prop('src', "images/shuffle-disabled.png").addClass('disabled').off('click');
		},

		enable: function(){
            shuffleButton.prop('src', "images/shuffle.png").removeClass('disabled').off('click').click(shuffleSong);
            shuffleButton.find('path').css('fill', 'white');
		}
	};
});