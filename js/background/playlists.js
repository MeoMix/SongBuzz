//Maintains an associative array consisting of Playlist IDs and Playlist objects.
function Playlists() {
	"use strict";
	var playlists = {};
	var selectedPlaylist = null;

    var save = function () {
        chrome.storage.sync.set({'playlists': JSON.stringify(playlists)});
    };

	var loadPlaylists = function(){
		chrome.storage.sync.get('playlists', function(result){
			try {
				if (result.playlists){
					var playlistIds = JSON.parse(result.playlists);

					for(var id in playlistIds){
						var playlist = new Playlist(id);
						playlists[id] = playlist;
					}
				}
				else{
					//No saved playlists found - create a default playlist.	
					var defaultPlaylist = new Playlist();
					playlists[defaultPlaylist.getId()] = defaultPlaylist;
					save();
				}
			}
			catch(exception){
				console.error(exception);
				//No saved playlists found - create a default playlist.
				var defaultPlaylist = new Playlist();
				playlists[defaultPlaylist.getId()] = defaultPlaylist;
				save();
			}
		});
	}();

	return {
		getPlaylists: function(){
			return playlists;
		},

		getPlaylistById: function(playlistId){
			return playlists[playlistId];
		},

		setSelectedPlaylist: function(playlist){
			var selectedPlaylist = this.getSelectedPlaylist();
			console.log("setting selected playlist to false", selectedPlaylist);

			selectedPlaylist.setSelected(false);
			playlist.setSelected(true);
			console.log("playlist selected:", playlist);
			selectedPlaylist = playlist;
		},	

		getSelectedPlaylist: function(){
			if(!selectedPlaylist){
				for(var key in playlists){
					if(playlists[key].getSelected()){
						selectedPlaylist = playlists[key];
						break;
					}
				}
			}

			return selectedPlaylist;
		},

		addPlaylist: function(playlistName){
			var playlist = new Playlist(null, playlistName);
			//TODO: Remove this clear. I want to ship default songs, but this isn't right.
			playlist.setSelected(false);
			playlist.clear();
			playlists[playlist.getId()] = playlist;
			save();
		},

		removePlaylistById: function(playlistId){
			delete playlists[playlistId];
			save();
		}
	};
}