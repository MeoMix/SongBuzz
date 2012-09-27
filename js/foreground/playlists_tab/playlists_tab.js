var PlaylistsTab;

require(['content_header', 'playlists_tab/playlist_list'], function(){
	PlaylistsTab = function(){
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
	};
});