function playlistList(){
    var _playlistList = $('#PlaylistList ul');

    var _input = $('#addPlaylistInput');
    var _button = $('#addPlaylistButton');
    var _icon = $('#addPlaylistCancelIcon');

    var _selectRow = function(id){
	    $('#PlaylistList li').removeClass('current');
	    $('#' + id).addClass('current');
	}

    var addopened = false;
    $('#addPlaylistButton').click( function(){
        if(addopened == false){
            _input.css('opacity', 1).css('cursor', "auto");
            _icon.css('right', '0px');
            _button.width('350px');
            _input.focus();
            addopened = true; 
        }
    });

    $('#addPlaylistCancelIcon').click(function(){
        if(addopened == true){
            _input.css('opacity', 0).css('cursor', "pointer").blur();
            _icon.css('right', '-30px');
            _button.width('120px');
            setTimeout(function(){addopened=false;},500);
        }
    });

    _input.keyup(function (e) {
        var code = e.which;
        //ENTER: 13
        if (code == 13)
            _addPlaylist();
    }).bind('paste drop', function () { return _addPlaylist(); });

    _addPlaylist = function(){
    	var playlistName = _input.val();
    	Player.addPlaylist(playlistName);
    }

	var playlistList = {

		load: function(){
		    //Set currently loaded playlist title.
		    var h1 = $('#PlaylistDisplay').children()[0];
		    $(h1).text(Player.getPlaylistTitle());

			_playlistList.empty();

			var items = [];
			var playlists = Player.getPlaylists();

			var selectedPlaylistId = -1;

            //I create the entries as <a> to leverage Google Chrome's context menus. One of the filter options is 'by link' which allows right click -> song options.
            for (var i = 0; i < playlists.length; i++){
                var html = '<li id = ' + playlists[i].id + '><span>' + playlists[i].title + '</span></li>';
                items.push(html);

                if( playlists[i].selected )
                	selectedPlaylistId = playlists[i].id;
            }

            _playlistList.append(items.join(''));
            _selectRow(selectedPlaylistId)
		}

	}

	return playlistList;
}