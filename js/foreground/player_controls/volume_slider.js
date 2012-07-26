//Responsible for controlling the volume indicator of the UI.
var VolumeSlider = (function(){
	"use strict";
	var MUTED_KEY = 'musicMuted';
	var VOLUME_KEY = 'musicVolume';  

	//Whenever the mute button is clicked toggle the muted state.
	var muteButton = $('#MuteButton').on('click', function(){
		if(isMuted){
			setVolume(musicVolume);
		}
		else{
			setVolume(0);
		}
	});

	//Whenever the volume slider is interacted with by the user, change the volume to reflect.
	var volumeSlider = $('#VolumeSlider').change(function(){ 
		updateWithVolume(this.value); 
	});

	//Show the volume slider control by expanding its parent whenever any of the volume controls are hovered.
	var volumeControls = $('.volumeControl').hover(function(){
		volumeSlider.parent().css("top","70px");
	}, function(){
		volumeSlider.parent().css("top","-35px");
	});

	var updateSoundIcon = function(volume){
		//Repaint the amount of white filled in the bar showing the distance the grabber has been dragged.
		var backgroundImage = '-webkit-gradient(linear,left top, right top, from(#ccc), color-stop('+ volume/100 +',#ccc), color-stop('+ volume/100+',rgba(0,0,0,0)), to(rgba(0,0,0,0)))';
		volumeSlider.css('background-image', backgroundImage);

		var active = '#fff';
		var inactive = '#555';

		//Paint the various bars indicating the sound level.
		var fillColor = volume >= 25 ? active : inactive;
		$('#MuteButtonBar1').css('fill', fillColor);

		fillColor = volume >= 50 ? active : inactive;
		$('#MuteButtonBar2').css('fill', fillColor);

		fillColor = volume >= 75 ? active : inactive;
		$('#MuteButtonBar3').css('fill', fillColor);

		//NOTE: Volume is a string here. Careful of type coercion.
		fillColor = volume == 100 ? active : inactive;
		$('#MuteButtonBar4').css('fill', fillColor);
	};

	//Initialize the muted state;
	var isMuted = (function(){
		var muted = false;

		var storedIsMuted = localStorage.getItem(MUTED_KEY);
		if(storedIsMuted){
			muted = JSON.parse(storedIsMuted);
		}

		return muted;
	})();

	//Initialize player's volume and muted state to last known information or 100 / unmuted.
	var musicVolume = (function(){
		var volume = 100;

		//TODO: Difficult to properly represent state when not already known -- can't get info from YouTube API until a song is playing.
		var storedMusicVolume = localStorage.getItem(VOLUME_KEY);
		if(storedMusicVolume){
			volume = JSON.parse(storedMusicVolume);
		}

		var volumeForPlayer = isMuted ? 0 : volume;
		volumeSlider.val(volumeForPlayer);
		updateSoundIcon(volumeForPlayer);

		return volume;
	})();

	var updateWithVolume = function(volume){
		isMuted = volume === 0;
		
		localStorage.setItem(MUTED_KEY, JSON.stringify(isMuted));
		if (volume) {
			//Remember old music value if muting so that unmute is possible.
			musicVolume = volume;
			localStorage.setItem(VOLUME_KEY, JSON.stringify(musicVolume));
		}

		updateSoundIcon(volume);
		Player.setVolume(volume);
	};
	
	var setVolume = function(volume){
		volumeSlider.val(volume);
		updateWithVolume(volume);
	};

	return {
		setVolume: setVolume
	};
});