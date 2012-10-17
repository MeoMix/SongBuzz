//This is the list of playlists on the playlists tab.
define(['playlists_tab/playlists_context_menu', '../yt_helper'], function(contextMenu, ytHelper){
    //TODO: Make this sortable and should inherit from a common List object. 
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
                var possiblePlaylistId = ytHelper.parseUrlForPlaylistId(userInput);
                
                if(possiblePlaylistId !== null){     
                    if(onValidInputEvent){
                        onValidInputEvent();
                    }
                    console.log("building playlist from id");
                    ytHelper.buildPlaylistFromId(possiblePlaylistId, function(playlist){
                        if(playlist){
                            console.log("Playlist:", playlist);
                            chrome.extension.getBackgroundPage().YoutubePlayer.addPlaylist(playlist.title, playlist.videos);
                        }
                    });
                }
                else{
                    //Only add the playlist if a name was provided.
                    if(userInput.trim() !== ''){
                        chrome.extension.getBackgroundPage().YoutubePlayer.addPlaylist(userInput);
                        if(onValidInputEvent){
                            onValidInputEvent();
                        }
                    }
                }
            });
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
                chrome.extension.getBackgroundPage().YoutubePlayer.selectPlaylist(id);
            };

            //Build up each row.
            for(var key in chrome.extension.getBackgroundPage().YoutubePlayer.playlists){
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
                })(chrome.extension.getBackgroundPage().YoutubePlayer.playlists[key]);
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