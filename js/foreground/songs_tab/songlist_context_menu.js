//Responsible for showing options when interacting with a Song in SongList.
var SongListContextMenu;

define(['context_menu'], function(contextMenu){
	SongListContextMenu = (function(song){
		"use strict";
		contextMenu.addContextMenuItem('Copy song', function(){
			if(song != null ){
	        	chrome.extension.sendMessage({ text: song.url });
			}
		});

		contextMenu.addContextMenuItem('Delete song', function(){
			if(song != null ){
	    		Player.removeSongById(song.id);
			}
		})

		return contextMenu;
	});
});