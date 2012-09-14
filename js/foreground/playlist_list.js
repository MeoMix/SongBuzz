//This is the list of playlists on the playlists tab.
function PlaylistList(playlistHeader){
    //TODO: Make this sortable and should inherit from a common List object.
    "use strict";
    var playlistList = $('#PlaylistList ul');
    var addInput = $('#PlaylistDisplay .addInput').attr('placeholder', 'Enter a playlist name');
    var addButton = $('.addButton');
    var addCancelIcon = $('.addCancelIcon');

    //Whenever the user submits a name for a new playlist create a new playlist with that name.
    addInput.keyup(function (e) {
        var code = e.which;
        //ENTER: 13
        if (code === 13){
            addPlaylist();
        }
    }).bind('paste drop', function () { return addPlaylist(); });

    var addPlaylist = function(){
        var playlistName = addInput.val();
        //Only add the playlist if a name was provided.
        if( playlistName.trim() !== ''){
            Player.addPlaylist(playlistName);
            playlistHeader.flashMessage('Thanks!', 2000);
        }
    };

    //Removes the old 'current' marking and move it to the newly selected row.
    var selectRow = function(id){
        playlistList.find('li').removeClass('current');
        $('#' + id).parent().addClass('current');

        Player.selectPlaylist(id);
    };

	return {
        //Refreshes the playlist display with the current playlist information.
        reload: function(){
            playlistList.empty();
            var playlists = Player.getPlaylists();

            //Build up each row.
            for(var key in playlists){
                var listItem = $('<li/>').appendTo(playlistList);

                (function(playlist){
                    var link = $('<a/>', {
                        id: playlist.getId(),
                        href: '#' + playlist.getId(),
                        text: playlist.getTitle(),
                        contextmenu: function(e){
                            var contextMenu = new PlaylistsContextMenu(playlist);
                            contextMenu.show(e.pageY, e.pageX);

                            //Prevent default context menu display.
                            return false;
                        }
                    }).appendTo(listItem);

                    if(playlist.getSelected()){
                        selectRow(playlist.getId()); 
                    }
                })(playlists[key]);
            }

            //Clicking on a playlist will select that playlist.
            playlistList.children().click(function(){
                var clickedId = $(this).children()[0].id;
                selectRow(clickedId);
                return false;
            });
        }
    };
}