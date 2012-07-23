function playlistsTab(){
    var contentHeader = contentHeader('#PlaylistDisplay', 'Add Playlist', 'Enter a playlist name')
    var playlistList = playlistList(contentHeader);

	return {
		setContentHeaderTitle: function(title){
			contentHeader.setTitle(title);
		},

		reloadList: function(){
			playlistList.reload();
		}
	};
}