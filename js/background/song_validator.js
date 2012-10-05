//This is 100% necessary because it is hosted on the background page.
//I do not want to spawn another YT Player every time SongValidator is needed.
//I do want the foreground to be able to interact with the SongValidator.
//So, the requireJS model has to be broken to allow for chrome.extension.getBackgroundPage().SongValidator niceness.
var SongValidator = null;
define(['player_builder'], function(playerBuilder){
	if(SongValidator === null){
		//Use window.load to allow the IFrame to be fully in place before starting up the YouTube API.
		//This will prevent an error message 'Unable to post message to http://www.youtube.com'
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
			isPlayable = false;
			receivedAnswer = true;
		};		

		//Don't try and pass null in instead of a blank onReady or you'll generate errors.
	    playerBuilder.buildPlayer('MusicTester', function(){}, onStateChange, onPlayerError, function(builtPlayer) {
	        player = builtPlayer;
	    });
	}

	SongValidator = {
    	validateSongById: function(videoId, callback){
    		oldVolume = player.getVolume();
    		player.setVolume(0);

    		receivedAnswer = false;
    		isPlayable = false;
    		player.loadVideoById(videoId);

    		var isValidPoller = setInterval(function(){
    			if(receivedAnswer){
    				receivedAnswer = false;

    				player.pauseVideo();
    				player.setVolume(oldVolume);
    				clearInterval(isValidPoller);
    				callback(isPlayable);
    			}
    		}, 200)
    	}
    };

    return SongValidator;
});