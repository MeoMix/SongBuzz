//The play/pause icon.
define(['player'], function(player){
	'use strict';
	var playPauseButton = $('#PlayPauseButton');
	var pauseIcon = $('#pauseIcon');
	var playIcon = $('#playIcon');

	return {
		//Change the music button to the 'Play' image and cause a song to play upon click.
		setToPlay: function(){
			pauseIcon.hide();
			playIcon.show();

			playPauseButton.off('click').on('click', function () {
				player.play(); 
				pauseIcon.show();
				playIcon.hide();
			});
		},
		//Change the music button to the 'Pause' image and cause a song to pause upon click.
		setToPause: function(){
			pauseIcon.show();
			playIcon.hide();

			playPauseButton.off('click').on('click', function () {
				console.log("Sending pause command");
				player.pause(); 
				pauseIcon.hide();
				playIcon.show();
			});
		},
		//Paint playPauseButton's path black and allow it to be clicked.
		//NOTE: This does not actually bind the click event.
		//TODO: Should this bind a click event?
		enable: function(){
			playPauseButton.removeClass('disabled');
			playPauseButton.find('.path').css('fill', 'black');
		},
		//Disable the button such that it cannot be clicked.
		//NOTE: Pause button will never be displayed disabled.
		disable: function(){
			this.setToPlay();
			playPauseButton.addClass('disabled').off('click');
			playPauseButton.find('.path').css('fill', 'gray');
		}
	};
});