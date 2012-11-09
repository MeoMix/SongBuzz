//This is 100% necessary because it is hosted on the background page.
//I do not want to spawn another YT Player every time SongValidator is needed.
//I do want the foreground to be able to interact with the SongValidator.
//So, the requireJS model has to be broken to allow for chrome.extension.getBackgroundPage().SongValidator niceness.
//TODO: Is SongValidator still necessary? I think all pretty much all songs play... a few don't but I only run into maybe 1 in 400+
var SongValidator = null;
define(['player_builder'], function(playerBuilder){
	if(SongValidator === null){
		//Only mute the volume to test the song playing -- but don't permanently change volume because
		//this will mess up the volume the actual player loads with on restart.
		var oldVolume = -1;

		var onStateChange = function(playerState){
			if(playerState.data === PlayerStates.PLAYING){
				SongValidator.isPlayable = true;
				SongValidator.receivedAnswer = true;
			}
		};

		var onPlayerError = function(error){
			console.error(error.message, error);
			SongValidator.isPlayable = false;
			SongValidator.receivedAnswer = true;
		};		

		//Don't try and pass null in instead of a blank onReady or you'll generate errors.
	    playerBuilder.buildPlayer('MusicTester', function(){console.log("Song validator is ready!");}, onStateChange, onPlayerError, function(builtPlayer) {
	        SongValidator.player = builtPlayer;
	    });
	}

	var loadSongAndValidate = function(videoId, callback){
		SongValidator.receivedAnswer = false;

		SongValidator.player.loadVideoById(videoId);

		var isValidPoller = setInterval(function(){
			console.log("isValidPoller tick");
			if(SongValidator.receivedAnswer){
				SongValidator.player.pauseVideo();
				SongValidator.player.setVolume(oldVolume);
				clearInterval(isValidPoller);

				if(SongValidator.queuedValidateRequests.length != 0){
					var validateRequest = SongValidator.queuedValidateRequests.pop();
					loadSongAndValidate(validateRequest.videoId, validateRequest.callback);
				}

				callback(SongValidator.isPlayable);
			}
		}, 200);
	};

	SongValidator = {
		queuedValidateRequests: [],
		player: null,
		receivedAnswer: true,
		isSongPlayable: false,
		
    	validateSongById: function(videoId, callback){
    		console.log("receivedAnswer:", SongValidator.receivedAnswer);
    		if(!SongValidator.receivedAnswer){
    			SongValidator.queuedValidateRequests.push({videoId: videoId, callback: callback});
    		}
    		else{
	    		console.log("validating song.", SongValidator.queuedValidateRequests.length);
	    		oldVolume = SongValidator.player.getVolume();
	    		SongValidator.player.setVolume(0);
				loadSongAndValidate(videoId, callback);	
    		}
    	}
    };

    return SongValidator;
});