SongValidator = null;

$(function(){
	SongValidator = (function(){
		var player = null;
		var receivedAnswer = false;
		var isPlayable = false;
		//Only mute the volume to test the song playing -- but don't permanently change volume because
		//this will mess up the volume the actual player loads with on restart.
		var oldVolume = -1;

		var onStateChange = function(playerState){
			if(playerState.data === PlayerStates.PLAYING){
				isPlayable = true;
				receivedAnswer = true;
			}
		};

		var onPlayerError = function(error){
			console.log("error received", error);
			isPlayable = false;
			receivedAnswer = true;
		};

	    PlayerBuilder.buildPlayer('MusicTester', null, onStateChange, onPlayerError, function(builtPlayer){
	        player = builtPlayer;
	    });

	    return {
	    	validateSongById: function(songId, callback){
	    		oldVolume = player.getVolume();
	    		player.setVolume(0);

	    		receivedAnswer = false;
	    		isPlayable = false;
	    		console.log("Loading video.", receivedAnswer, isPlayable);
	    		player.loadVideoById(songId);

	    		var isValidPoller = setInterval(function(){
	    			console.log("polling", receivedAnswer);
	    			if(receivedAnswer){
	    				player.pauseVideo();
	    				player.setVolume(oldVolume);
	    				clearInterval(isValidPoller);
	    				console.log("callback", isPlayable);
	    				callback(isPlayable);
	    			}
	    		}, 200)
	    	}
	    }
	})();
});