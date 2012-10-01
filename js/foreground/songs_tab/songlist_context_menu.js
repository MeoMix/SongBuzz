//Responsible for showing options when interacting with a Song in SongList.
define(['context_menu', 'player'], function(contextMenu, player){
	'use strict';
	var songlistContextMenu = {};

	$.extend(songlistContextMenu, contextMenu, {
		initialize: function(song){
			this.empty();

			this.addContextMenuItem('Copy song', function(){
				if(song != null ){
		        	chrome.extension.sendMessage({ text: song.url });
				}
			});

			this.addContextMenuItem('Delete song', function(){
				if(song != null ){
		    		player.removeSongById(song.id);
				}
			})
		}
	});

	return songlistContextMenu;
});