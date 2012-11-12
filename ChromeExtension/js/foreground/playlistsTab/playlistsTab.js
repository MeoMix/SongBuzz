define(['contentHeader', 'playlistsDisplay'], function(contentHeaderFunc, playlistsDisplay){
	'use strict';
	var contentHeader = new contentHeaderFunc('#PlaylistDisplay', 'Add Playlist', 'Enter a playlist name');
    contentHeader.contract();

	//TODO: Clearly need to split playlistsDisplay off into another object.
    playlistsDisplay.initialize(function(){
		contentHeader.flashMessage('Thanks!', 2000);
	});

	return {
		set contentHeaderTitle(value){
			contentHeader.title = value;
		},
		reload: function(){			
			var playlistTitle = chrome.extension.getBackgroundPage().YoutubePlayer.playlistTitle;
        	contentHeader.title = playlistTitle;
			playlistsDisplay.reload();
		}
	};
});