function playlistList(){
    var _placeholder = 'Enter a playlist name.';
    var _playlistList = $('#PlaylistList ul');

    var _addInput = $('#PlaylistDisplay .addInput');
    var _addButton = $('.addButton');
    var _addCancelIcon = $('.addCancelIcon');
    //Paint all the rows back to unselected state
    var _selectRow = function(id){
	    $('#PlaylistList li').removeClass('current').children('.remove').css('cursor', 'pointer').off('click').click(_removePlaylist);
        $('#PlaylistList li .remove svg path').attr('fill', "000");
	    $('#' + id).addClass('current').children('.remove').css('cursor', 'default');
        $('#' + id + ' .remove svg path').attr('fill', "#808080").off('click');

        Player.selectPlaylist(id);
	}

    //Display a message for X milliseconds inside of the input. 
    var _flashMessage = function (message, durationInMilliseconds) {
        _addInput.val('').blur().attr('placeholder', message);
        window.setTimeout(function () {
            _addInput.attr('placeholder', _placeholder);
        }, durationInMilliseconds);
    };

    _addInput.keyup(function (e) {
        var code = e.which;
        //ENTER: 13
        if (code == 13)
            _addPlaylist();
    }).bind('paste drop', function () { return _addPlaylist(); });

    _addPlaylist = function(){
    	var playlistName = _addInput.val();
        if( playlistName.trim() != ''){
            Player.addPlaylist(playlistName);
            _flashMessage('Thanks!', 2000);
        }
    }

    _removePlaylist = function(){
        Player.removePlaylistById($(this).attr('playlistid'));
        return false;
    }

	var playlistList = {
		reload: function(){
			_playlistList.empty();

			var items = [];
			var playlists = Player.getPlaylists();

			var selectedPlaylistId = -1;

            //I create the entries as <a> to leverage Google Chrome's context menus. One of the filter options is 'by link' which allows right click -> song options.
            for (var i = 0; i < playlists.length; i++){
                var html = '<li id = ' + playlists[i].id + '><span>' + playlists[i].title + '</span>';
                html += '<div class="remove" playlistid=' + playlists[i].id + '><svg width="12" height="12"><path d="M0,2 L2,0 L12,10 L10,12z" fill="#000" /> <path d="M12,2 L10,0 L0,10 L2,12z" fill="#000" /> </svg> </div>';
                html += '</li>';
                items.push(html);

                if( playlists[i].selected )
                	selectedPlaylistId = playlists[i].id;
            }

            _playlistList.append(items.join(''));

            //Add 'delete' to the 'X'
            _playlistList.children('li').children('.remove').click(_removePlaylist);

            _playlistList.children().click( function(){
                _selectRow(this.id);
            });

            _selectRow(selectedPlaylistId);
		}
	}

    playlistList.reload();

	return playlistList;
}