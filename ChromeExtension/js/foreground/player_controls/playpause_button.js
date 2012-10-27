//The play/pause icon.
define(function(){
	'use strict';
	var playPauseButton = $('#PlayPauseButton'), pauseIcon = $('#pauseIcon'), playIcon = $('#playIcon');

	return {
		//Change the music button to the 'Play' image and cause a song to play upon click.
		setToPlay: function(){
			pauseIcon.hide();
			playIcon.show();

			playPauseButton.off('click').on('click', function () {
				chrome.extension.getBackgroundPage().YoutubePlayer.play(); 
				pauseIcon.show();
				playIcon.hide();
			});
		},
		//Change the music button to the 'Pause' image and cause a song to pause upon click.
		setToPause: function(){
			pauseIcon.show();
			playIcon.hide();

			playPauseButton.off('click').on('click', function () {
				chrome.extension.getBackgroundPage().YoutubePlayer.pause(); 
				pauseIcon.hide();
				playIcon.show();
			});
		},
		//Paint playPauseButton's path black and allow it to be clicked.
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