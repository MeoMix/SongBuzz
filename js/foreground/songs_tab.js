function SongsTab(){
	"use strict";
    var contentHeader = new ContentHeader('#CurrentSongDisplay', 'Add Songs', 'Search for artists or songs');
    var songList = new SongList();
    new UrlInput(contentHeader);

    contentHeader.expand();

    //Serves to initialize the song list;
    var songs = Player ? Player.getSongs() : [];
    var currentSong = Player ? Player.getCurrentSong() : null;
    songList.reload(songs, currentSong);
    
	return {
		setContentHeaderTitle: function(title){
			contentHeader.setTitle(title);
		},
		reloadSongList: function(songs, currentSong){
			songList.reload(songs, currentSong);
		}
	};
}