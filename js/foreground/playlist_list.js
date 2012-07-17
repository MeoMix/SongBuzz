function playlistList(){
    var _placeholder = 'Enter a playlist name.';
    var _playlistList = $('#PlaylistList ul');

    var _input = $('#addPlaylistInput');
    var _button = $('#addPlaylistButton');
    var _icon = $('#addPlaylistCancelIcon');

    //Paint all the rows back to unselected state
    var _selectRow = function(id){
	    $('#PlaylistList li').removeClass('current').children('.remove').css('cursor', 'pointer').off('click').click(_removePlaylist);
        $('#PlaylistList li .remove svg path').attr('fill', "000");
	    $('#' + id).addClass('current').children('.remove').css('cursor', 'default');
        $('#' + id + ' .remove svg path').attr('fill', "#808080").off('click');

        Player.selectPlaylist(id);
	}

    //TODO: Play with animate until it feels right.
    //http://jqueryui.com/demos/effect/easing.html
    var _expand = function(){
        _input.css('opacity', 1).css('cursor', "auto");
        _icon.css('right', '0px');

        _button.animate({
            width: '350px'
        }, 250, 'easeInQuad')

        _input.focus();
        $('#addPlaylistCancelIcon').one('click', _contract);
    }

    //Display a message for X milliseconds inside of the input. 
    var _flashMessage = function (message, durationInMilliseconds) {
        _input.val('').blur().attr('placeholder', message);
        window.setTimeout(function () {
            _input.attr('placeholder', _placeholder);
        }, durationInMilliseconds);
    };

    var _contract = function(){
        _input.css('opacity', 0).css('cursor', "pointer").blur();
        _icon.css('right', '-30px');

        _button.animate({
            width: '120px'
        }, 150, 'linear')

        $('#addPlaylistButton').one('click', _expand);
        return false; //Clicking the 'X' icon bubbles the click event up to the parent button causing expand to call again.
    }

    $('#addPlaylistButton').one('click', _expand);

    _input.keyup(function (e) {
        var code = e.which;
        //ENTER: 13
        if (code == 13)
            _addPlaylist();
    }).bind('paste drop', function () { return _addPlaylist(); });

    _addPlaylist = function(){
    	var playlistName = _input.val();
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
		    //Set currently loaded playlist title.
		    var h1 = $('#PlaylistDisplay').children()[0];
		    $(h1).text(Player.getPlaylistTitle());

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

	return playlistList;
}