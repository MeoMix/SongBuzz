define(['content_header', 'playlists_tab/playlist_list'], function(contentHeader, playlistList){
	'use strict';
	contentHeader.initialize('#PlaylistDisplay', 'Add Playlist', 'Enter a playlist name');
	//TODO: Clearly need to split playlistList off into another object.
	playlistList.onValidInput = function(){
		contentHeader.flashMessage('Thanks!', 2000);
	};
    contentHeader.contract();

	return {
		set contentHeaderTitle(value){
			contentHeader.title = value;
		},
		reloadList: function(){
			playlistList.reload();
		}
	};
});