function playlists(){
	var _playlists = null;
	var _currentPlaylist = null;

	var _save = function () {
		localStorage.setItem('playlists', JSON.stringify(_playlists));
    };

	var _loadPlaylists = function(){
		_playlists = localStorage.getItem('playlists');

		try {
			if (_playlists && _playlists != 'undefined')
	            _playlists = JSON.parse(_playlists);

	        for(var playlistIndex = 0; playlistIndex < _playlists; playlistIndex++; )
	        {
	        	
	        }
		}
		catch(exception){
			console.error(exception);
		}

		if(!_playlists){
			_playlists = new Array();
			var defaultPlaylist = new Playlist(null, null);
			
			_playlists.push(defaultPlaylist);
			_save();
		}

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