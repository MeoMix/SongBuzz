define(['content_header', 'songs_tab/songlist', 'songs_tab/songinput', 'player'], function(contentHeaderFunc, songList, songInput, player){
	'use strict';
	var contentHeader = contentHeaderFunc('#CurrentSongDisplay', 'Add Songs', 'Search for artists or songs');
	contentHeader.expand();

	songInput.initialize(function(){
		contentHeader.flashMessage('Thanks!', 2000);
	});

    //Serves to initialize the song list;
    songList.reload(player.songs, player.currentSong);
    
	return {
		set contentHeaderTitle(value){
			contentHeader.title = value;
		},
		reloadSongList: function(songs, currentSong){
			songList.reload(songs, currentSong);
		}
	};
});