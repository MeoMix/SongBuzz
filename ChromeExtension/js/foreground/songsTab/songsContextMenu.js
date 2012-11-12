//Responsible for showing options when interacting with a Song in SongList.
define(['contextMenu'], function(contextMenu) {
    'use strict';
    var songsContextMenu = { };

    $.extend(songsContextMenu, contextMenu, {
        initialize: function(song) {
            this.empty();

            this.addContextMenuItem('Copy song', function() {
                if (song != null) {
                    chrome.extension.sendMessage({ text: song.url });
                }
            });

            this.addContextMenuItem('Delete song', function() {
                if (song != null) {
                    chrome.extension.getBackgroundPage().YoutubePlayer.removeSongById(song.id);
                }
            });
        }
    });

    return songsContextMenu;
});