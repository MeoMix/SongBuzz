function PlaylistsTab(){
    var contentHeader = ContentHeader('#PlaylistDisplay', 'Add Playlist', 'Enter a playlist name')
    var playlistList = PlaylistList(contentHeader);

    //Serves to initialize the playlist list even if there are no songs in the first playlist (so no messages ever come through to initialize)
    playlistList.reload();

	return {
		setContentHeaderTitle: function(title){
			contentHeader.setTitle(title);
		},

		reloadList: function(){
			playlistList.reload();
		}
	};
}