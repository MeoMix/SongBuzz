//When clicked -- shuffles the playlist. Doesn't affect curently playing song at all.
//Can't be clicked with 2 or fewer songs.
var ShuffleButton = (function(){
	"use strict";
	var shuffleButton = $('#ShuffleButton');

	function shuffleSong(){
        Player.shuffle();
        //Prevent spamming by only allowing a shuffle click once a second.
        setTimeout(function () {
            shuffleButton.off('click').one('click', shuffleSong);
        }, 1000);
	}

	return {
		disable: function(){
            shuffleButton.find('path').css('fill', 'gray');
            shuffleButton.prop('src', "images/shuffle-disabled.png").addClass('disabled').off('click');
		},

		enable: function(){
            shuffleButton.prop('src', "images/shuffle.png").removeClass('disabled').off('click').one('click', shuffleSong);
            shuffleButton.find('path').css('fill', 'white');
		}
	};
});