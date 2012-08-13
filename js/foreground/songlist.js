//Represents the songs in a given playlist.
function SongList() {
    "use strict";
    var songList = $('#SongList ul');

    //Allows for drag-and-drop of songs.
    songList.sortable({
        axis: 'y',
        //Whenever a song row is moved inform the Player of the new songlist order.
        //TODO: If it proves necessary I can rewrite this such that instead of syncing the entire playlist I only move the song affected.
        update: function () {
            var ids = [];
            songList.find('li a').each(function(){
                ids.push(this.id);
            });

            Player.sync(ids);
        }
    });

    return {
        //Refresh all the songs displayed to ensure they GUI matches background's data.
        reload: function (songs, currentSong) {
            songList.empty();

            //I create the entries as <a> to leverage Google Chrome's context menus. 
            //One of the filter options is 'by link' which allows right click -> song options.
            for (var i = 0; i < songs.length; i++){
                var listItem = $('<li/>').appendTo(songList);

                var song = songs[i];

                var link = $('<a/>', {
                    id: song.id,
                    href: '#' + song.id,
                    text: song.name,
                    contextmenu: function(e){
                        var contextMenu = new ContextMenu(song);
                        contextMenu.show(e.pageY, e.pageX);

                        //Prevent default context menu display.
                        return false;
                    }
                }).appendTo(listItem);
            }
                
            //Removes the old 'current' marking and move it to the newly selected row.
            var selectRow = function(id){
                songList.find('li').removeClass('current');
                $('#' + id).parent().addClass('current');
            };

            //Load and start playing a song if it is clicked.
            songList.children().click(function(){
                var clickedId = $(this).children()[0].id;
                Player.loadSongById(clickedId);
                return false;
            });

            //Since we emptied our list we lost the selection, reselect.
            if (currentSong){
                selectRow(currentSong.id);
            }
        }
    };
}