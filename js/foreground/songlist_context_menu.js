//Responsible for showing options when interacting with a Song in SongList.
var SongListContextMenu = (function(song){
	"use strict";
	var contextMenu = new ContextMenu();

	contextMenu.addContextMenuItem('Copy song URL', function(){
		if(song != null ){
        	chrome.extension.sendRequest({ text: song.url });
		}
	});

	contextMenu.addContextMenuItem('Delete song', function(){
		if(song != null ){
    		Player.removeSongById(song.id);
		}
	})

	return contextMenu;
});