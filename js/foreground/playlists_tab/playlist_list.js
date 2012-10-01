//This is the list of playlists on the playlists tab.
define(['playlists_tab/playlists_context_menu', 'player'], function(contextMenu, player){
    //TODO: Make this sortable and should inherit from a common List object. And fix it.
    'use strict';
    var playlistList;

    var initialize = function(onValidInputEvent){
        playlistList = $('#PlaylistList ul');
        var addInput = $('#PlaylistDisplay .addInput').attr('placeholder', 'Enter a playlist name or YouTube playlist URL');


        //Whenever the user submits a name for a new playlist create a new playlist with that name.
        addInput.keyup(function (e) {
            var code = e.which;
            //ENTER: 13
            if (code === 13){
                processInput();
            }
        }).bind('paste drop', function () {
            processInput(); 
        });

        var processInput = function(){
            setTimeout(function () {
                var userInput = addInput.val();
                var possiblePlaylistId = YTHelper.parseUrlForPlaylistId(userInput);
                
                if(possiblePlaylistId !== null){     
                    if(onValidInputEvent){
                        onValidInputEvent();
                    }

                    YTHelper.buildPlaylistFromId(possiblePlaylistId, function(playlist){
                        if(playlist){
                            player.addPlaylistByPlaylist(playlist);
                        }
                    });
                }
                else{
                    addPlaylistByName(userInput);
                }
            });
        };

        var addPlaylistByName = function(playlistName){
            //Only add the playlist if a name was provided.
            if(playlistName.trim() !== ''){
                player.addPlaylistByName(playlistName);
                if(onValidInputEvent){
                    onValidInputEvent();
                }
            }
        };
    };

    return {
        initialize: initialize,
        //Refreshes the playlist display with the current playlist information.
        reload: function(){
            playlistList.empty();

            //Removes the old 'current' marking and move it to the newly selected row.
            var selectRow = function(id){
                playlistList.find('li').removeClass('current');
                $('#' + id).parent().addClass('current');
                player.selectPlaylist(id);
            };

            //Build up each row.
            for(var key in player.playlists){
                var listItem = $('<li/>').appendTo(playlistList);

                (function(playlist){                
                    $('<a/>', {
                        id: playlist.id,
                        href: '#' + playlist.id,
                        text: playlist.title,
                        contextmenu: function(e){
                            contextMenu.initialize(playlist);
                            contextMenu.show(e.pageY, e.pageX);
                            //Prevent default context menu display.
                            return false;
                        }
                    }).appendTo(listItem);

                    if(playlist.isSelected){
                        selectRow(playlist.id); 
                    }
                })(player.playlists[key]);
            }

            //Clicking on a playlist will select that playlist.
            playlistList.children().click(function(){
                var clickedId = $(this).children()[0].id;
                selectRow(clickedId);
                return false;
            });
        }
    };
});