define(['content_header', 'playlist_list'], function(contentHeaderFunc, playlistList){
	'use strict';
	var contentHeader = new contentHeaderFunc('#PlaylistDisplay', 'Add Playlist', 'Enter a playlist name');
    contentHeader.contract();

	//TODO: Clearly need to split playlistList off into another object.
    playlistList.initialize(function(){
		contentHeader.flashMessage('Thanks!', 2000);
	});

	return {
		set contentHeaderTitle(value){
			contentHeader.title = value;
		},
		reload: function(){			
			var playlistTitle = chrome.extension.getBackgroundPage().YoutubePlayer.playlistTitle;
        	contentHeader.title = playlistTitle;
			playlistList.reload();
		}
	};
});