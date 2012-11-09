//This function will be called when the API is fully loaded. Needs to be exposed globally so YouTube can call it.
var onYouTubePlayerAPIReady = function () {
  	'use strict';
	require(['youtube-player-api-helper'], function(ytPlayerApiHelper){
		console.log("calling ytPlayerApiHelper ready");
		ytPlayerApiHelper.ready();

	    //TODO: Firing two events is lame, but I have two players currently. How do I make this arbitrary?
	     // new ytPlayerApiHelper.ready(true);
	     // new ytPlayerApiHelper.ready(true);
	});
}