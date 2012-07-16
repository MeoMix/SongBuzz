function playlists(){
	var _playlists = new Array();
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
		if(playlistsWithoutMethods){
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

	var playlists = {
		count: function(){
			return _playlists.length;
		},

		getPlaylists: function(){
			return _playlists;
		},

		getCurrentPlaylist: function(){
			currentPlaylist = _currentPlaylist;

			if(!currentPlaylist){
				_loadPlaylists();
				currentPlaylist = _playlists[0];
				currentPlaylist.selected = true;
			}

			return currentPlaylist;
		},

		addPlaylist: function(playlistName){
			var playlist = new Playlist(null, playlistName);
			_playlists.push(playlist);
			_save();
		}
	}

	return playlists;
}