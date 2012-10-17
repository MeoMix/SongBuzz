define(['content_header', 'songs_tab/songlist', 'songs_tab/songinput'], function(contentHeaderFunc, songList, songInput){
	'use strict';
	var contentHeader = contentHeaderFunc('#CurrentSongDisplay', 'Add Songs', 'Search for artists or songs');
	contentHeader.expand();

	songInput.initialize(function(){
		contentHeader.flashMessage('Thanks!', 2000);
	});

    //Serves to initialize the song list;
    songList.reload();

	return {
		reload: function(){        
			var playlistTitle = chrome.extension.getBackgroundPage().YoutubePlayer.playlistTitle;
        	contentHeader.title = playlistTitle;
			songList.reload();
		}
	};
});