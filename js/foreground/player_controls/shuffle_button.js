//When clicked -- shuffles the playlist. Doesn't affect curently playing song at all.
//Can't be clicked with 2 or fewer songs.
var ShuffleButton = (function(){
	"use strict";
	var shuffleButton = $('#ShuffleButton');
	//localStorage serializes bools to strings.
	if(Boolean(localStorage.getItem('isShuffleEnabled') || false)){
		shuffleButton.addClass('pressed');
	}

	function shuffleSong(){
		var isShuffleEnabled = shuffleButton.hasClass('pressed');
		localStorage.setItem('isShuffleEnabled', isShuffleEnabled);

		if(isShuffleEnabled){
			shuffleButton.removeClass('pressed');
		}
		else{
			shuffleButton.addClass('pressed');
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