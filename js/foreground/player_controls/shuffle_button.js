//When clicked -- shuffles the playlist. Doesn't affect curently playing song at all.
//Can't be clicked with 2 or fewer songs.
var ShuffleButton;

require([], function(){
	ShuffleButton = (function(){
		"use strict";
		var shuffleButton = $('#ShuffleButton').click(shuffleSong);
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
		};
	});
});