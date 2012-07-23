function Playlists() {
	var playlists = [];
	var currentPlaylist = null;

	var save = function () {
		localStorage.setItem('playlists', JSON.stringify(playlists));
    };

	var loadPlaylists = function(){
		//Any objects returned from localStorage will only have properties and not their methods.
		var playlistsWithoutMethods = localStorage.getItem('playlists');

		try {
			if (playlistsWithoutMethods && playlistsWithoutMethods != 'undefined')
	            playlistsWithoutMethods = JSON.parse(playlistsWithoutMethods);
		}
		catch(exception){
			console.error(exception);
		}

		//Playlists were loaded. Need to reconstruct them as serialization strips off methods.
		if(playlistsWithoutMethods && playlistsWithoutMethods.length > 0){
			$(playlistsWithoutMethods).each(function(){
				var playlist = new Playlist(this.id, this.title);
				playlists.push(playlist);
			});
		}
		else{
			var defaultPlaylist = new Playlist(null, null);
			playlists.push(defaultPlaylist);
		}
		
		save();
	};

    //Takes a playlist's UID and returns the index of that playlist in playlists if found.
    var getPlaylistIndexById = function (id) {
        var playlistIndex = -1;
        for (var i = 0; i < playlists.length; i++) {
            if (playlists[i].id === id) {
                playlistIndex = i;
                break;
            }
        }

        if (playlistIndex == -1)
            throw "Couldn't find playlist with UID: " + id;

        return playlistIndex;
    };

	return {
		count: function(){
			return playlists.length;
		},

		getPlaylists: function(){
			return playlists;
		},

		getPlaylistById: function(playlistId){
			var playlistIndex = getPlaylistIndexById(playlistId);
			return playlists[playlistIndex];
		},

		getCurrentPlaylist: function(){
			currentPlaylist = currentPlaylist;

			if(!currentPlaylist){
				loadPlaylists();
				if(playlists.length > 0){
					currentPlaylist = playlists[0];
					currentPlaylist.selected = true;
				}
			}

			return currentPlaylist;
		},

		addPlaylist: function(playlistName){
			var playlist = new Playlist(null, playlistName);
			playlist.clear();
			playlists.push(playlist);
			save();
		},

		removePlaylistById: function(playlistId){
			var index = getPlaylistIndexById(playlistId);

			if( index != -1 ){
				playlists.splice(index, 1);
                save();
			}
		}
	};
}