function playlists(){
	var _playlists = [];
	var _currentPlaylist = null;

	var _save = function () {
		localStorage.setItem('playlists', JSON.stringify(_playlists));
    };

	var _loadPlaylists = function(){
		var playlistsWithoutMethods = localStorage.getItem('playlists');

		try {
			if (playlistsWithoutMethods && playlistsWithoutMethods != 'undefined')
	            playlistsWithoutMethods = JSON.parse(playlistsWithoutMethods);

	        // for(var playlistIndex = 0; playlistIndex < _playlists; playlistIndex++ )
	        // {
	        	
	        // }
		}
		catch(exception){
			console.error(exception);
		}

		//Playlists were loaded. Need to reconstruct them as serialization strips off methods.
		if(playlistsWithoutMethods && playlistsWithoutMethods.length > 0){
			for( var playlistIndex = 0; playlistIndex < playlistsWithoutMethods.length; playlistIndex++){
				var playlistWithoutMethods = playlistsWithoutMethods[playlistIndex];
				var playlist = new Playlist(playlistWithoutMethods.id, playlistWithoutMethods.title);
				_playlists.push(playlist);
			}
		}
		else{
			var defaultPlaylist = new Playlist(null, null);
			_playlists.push(defaultPlaylist);
		}
		
		_save()
	};

    //Takes a playlist's UID and returns the index of that playlist in playlists if found.
    var _getPlaylistIndexById = function (id) {
        var playlistIndex = -1;
        for (var i = 0; i < _playlists.length; i++) {
            if (_playlists[i].id === id) {
                playlistIndex = i;
                break;
            }
        }

        if (playlistIndex == -1)
            throw "Couldn't find playlist with UID: " + id;

        return playlistIndex;
    };

	var playlists = {
		count: function(){
			return _playlists.length;
		},

		getPlaylists: function(){
			return _playlists;
		},

		getPlaylistById: function(playlistId){
			var playlistIndex = _getPlaylistIndexById(playlistId);
			return _playlists[playlistIndex];
		},

		getCurrentPlaylist: function(){
			currentPlaylist = _currentPlaylist;

			if(!currentPlaylist){
				_loadPlaylists();
				if(_playlists.length > 0){
					currentPlaylist = _playlists[0];
					currentPlaylist.selected = true;
				}
			}

			return currentPlaylist;
		},

		addPlaylist: function(playlistName){
			var playlist = new Playlist(null, playlistName);
			playlist.clear();
			_playlists.push(playlist);
			_save();
		},

		removePlaylistById: function(playlistId){
			var index = _getPlaylistIndexById(playlistId);

			if( index != -1 ){
				_playlists.splice(index, 1);
                _save();
			}
		}
	}

	return playlists;
}