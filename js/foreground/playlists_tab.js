function playlistsTab(){
    var _contentHeader = contentHeader('#PlaylistDisplay', 'Add Playlist', 'Enter a playlist name')
    var _playlistList = playlistList(_contentHeader);

	var playlistsTab = {
		setContentHeaderTitle: function(title){
			_contentHeader.setTitle(title);
		},

		reloadList: function(){
			_playlistList.reload();
		}
	}

	return playlistsTab;
}