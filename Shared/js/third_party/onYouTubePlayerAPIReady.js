//This function will be called when the API is fully loaded. Needs to be exposed globally so YouTube can call it.
var onYouTubePlayerAPIReady = function () {
  	'use strict';
	require(['youtube-player-api-helper'], function(ytPlayerApiHelper){
		ytPlayerApiHelper.ready();
	});
}