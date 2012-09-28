define(['content_header', 'songs_tab/songlist', 'songs_tab/songinput', 'player'], function(contentHeader, songList, songInput, player){
	'use strict';
	contentHeader.initialize('#CurrentSongDisplay', 'Add Songs', 'Search for artists or songs');

	songInput.onValidInput = function(){
		contentHeader.flashMessage('Thanks!', 2000);
	};

    contentHeader.expand();

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