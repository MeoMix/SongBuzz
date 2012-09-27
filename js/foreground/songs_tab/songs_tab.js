var SongsTab;

require(['content_header', 'songs_tab/songlist', 'songs_tab/songinput'], function(){
	SongsTab = function(){
		"use strict";
	    var contentHeader = new ContentHeader('#CurrentSongDisplay', 'Add Songs', 'Search for artists or songs');
	    var songList = new SongList();
	    new SongInput(contentHeader);

	    contentHeader.expand();

	    //Serves to initialize the song list;
	    songList.reload(Player.songs, Player.currentSong);
	    
		return {
			set contentHeaderTitle(value){
				contentHeader.title = value;
			},
			reloadSongList: function(songs, currentSong){
				songList.reload(songs, currentSong);
			}
		};
	};
});