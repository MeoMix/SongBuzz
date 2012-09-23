function PlaylistsTab(){
	"use strict";
    var contentHeader = new ContentHeader('#PlaylistDisplay', 'Add Playlist', 'Enter a playlist name');
    var playlistList = new PlaylistList(contentHeader);

    contentHeader.contract();

	return {
		set contentHeaderTitle(value){
			contentHeader.title = value;
		},
		reloadList: function(){
			playlistList.reload();
		}
	};
}