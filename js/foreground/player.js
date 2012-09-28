define(function(){
	'use strict';
	console.log("Connect is being called");
	var player = chrome.extension.getBackgroundPage().YoutubePlayer;
	player.connect();

	return player;
});