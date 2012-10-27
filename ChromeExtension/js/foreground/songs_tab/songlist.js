//Represents the songs in a given playlist.
define(['songs_tab/songlist_context_menu'], function(contextMenu){
    'use strict';
    var songList = $('#SongList ul');

    //Allows for drag-and-drop of songs.
    songList.sortable({
        axis: 'y',
        //Whenever a song row is moved inform the Player of the new songlist order.
        update: function () {
            var ids = [];
            songList.find('li a').each(function(){
                ids.push(this.id);
            });

            chrome.extension.getBackgroundPage().YoutubePlayer.sync(ids);
        }
    });

    //Removes the old 'current' marking and move it to the newly selected row.
    var selectRow = function(id){
        songList.find('li').removeClass('current');
        $('#' + id).parent().addClass('current');
    };

    return {
        //Refresh all the songs displayed to ensure they GUI matches background's data.
        reload: function (songs, currentSong) {
            var player = chrome.extension.getBackgroundPage().YoutubePlayer
            var songs = player.songs;
            var currentSong = player.currentSong;

            songList.empty();

            for (var i = 0; i < songs.length; i++){
                //Wrap in a closure to preserve song index for each iteration.
                //If you don't do this the contextmenu method will always have the last song.
                (function(i){
                    var listItem = $('<li/>').appendTo(songList);

                    var song = songs[i];

                    var link = $('<a/>', {
                        id: song.id,
                        href: '#' + song.id,
                        text: song.title,
                        contextmenu: function(e){
                            contextMenu.initialize(song);
                            contextMenu.show(e.pageY, e.pageX);

                            //Prevent default context menu display.
                            return false;
                        }
                    }).appendTo(listItem);
                }(i));
            }

            //Load and start playing a song if it is clicked.
            songList.children().click(function(){
                var clickedId = $(this).children()[0].id;
                chrome.extension.getBackgroundPage().YoutubePlayer.loadSongById(clickedId);
                return false;
            });

            //Since we emptied our list we lost the selection, reselect.
            if (currentSong){
                selectRow(currentSong.id);
            }
        }
    };
});