//Responsible for controlling the volume indicator of the UI.
var VolumeSlider = (function(){
	"use strict";
	var MUTED_KEY = 'musicMuted';
	var VOLUME_KEY = 'musicVolume';  

	//Whenever the mute button is clicked toggle the muted state.
	var muteButton = $('#MuteButton').on('click', toggleMute);

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

	//Initialize the music volume.
	var musicVolume = (function(){
		var volume = 100;
		//When foreground is closed the music's volume is forgotten, but the player may continue to play.
		//Upon re-opening we need the last known values.
		//TODO: An unhandled scenario is when a user interacts with the YouTube player outside of SongBuzz, toggles mute, and then reopens SongBuzz -- incorrect values will display.
		var storedMusicVolume = localStorage.getItem(VOLUME_KEY);

		//I've managed to serialize 'undefined' back to the stored volume. That should be treated as null, though.
		if(storedMusicVolume && storedMusicVolume !== 'undefined'){
			volume = JSON.parse(storedMusicVolume);
		}

		volumeSlider.val(volume);
		updateSoundIcon(volume);

		return volume;
	})();

	//Initialize the muted state;
	var isMuted = (function(){
		var muted = false;
		var storedIsMuted = localStorage.getItem(MUTED_KEY);

		//I've managed to serialize 'undefined' back to the stored volume. That should be treated as null, though.
		if(storedIsMuted && storedIsMuted !== 'undefined'){
			muted = JSON.parse(storedIsMuted);
		}

		return muted;
	})();

	var updateWithVolume = function(volume){
		isMuted = volume === 0;
		localStorage.setItem(MUTED_KEY, JSON.stringify(isMuted));
		if (volume !== 0) {
			//Remember old music value if muting so that unmute is possible.
			musicVolume = volume;
			localStorage.setItem(VOLUME_KEY, JSON.stringify(musicVolume));
		}

		updateSoundIcon(volume);
		Player.setVolume(volume);
	};
	
	//Changes the muted state of the player and returns the state after toggling.
	var setVolume = function(volume){
		volumeSlider.val(volume);
		updateWithVolume(volume);
	};

	//NOTE: This wouldn't be necessary if YT's muted property returned properly. Keep checking back to see if its fixed.
	var toggleMute = function(){
		if(isMuted){
			setVolume(musicVolume);
		}
		else{
			setVolume(0);
		}

		//This value is the opposite of above because setting slider volume has side-effects.
		return isMuted;
	};

	return {
		toggleMute: toggleMute,
		setVolume: setVolume
	};
});