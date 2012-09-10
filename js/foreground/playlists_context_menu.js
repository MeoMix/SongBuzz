//Responsible for showing options when interacting with a Playlist in Playlist_List.
var PlaylistsContextMenu = (function(playlist){
	"use strict";
	var contextMenu = new ContextMenu();

	contextMenu.addContextMenuItem('Delete playlist', function(){
		//TODO: I need to gray out the option to delete, but still show it.
		//Should I gray out when clicking on last playlist or current playlist?
		if(playlist != null && !playlist.getSelected() ){
    		Player.removePlaylistById(playlist.getId());
		}
	})

	return contextMenu;
});