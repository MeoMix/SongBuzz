function SongsTab(){
	"use strict";
    var contentHeader = new ContentHeader('#CurrentSongDisplay', 'Add Songs', 'Search for artists or songs');
    var songList = new SongList();
    new UrlInput(contentHeader);

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
}