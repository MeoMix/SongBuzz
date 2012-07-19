//Represents the songs in a given playlist.
function songList() {
    var _songList = $('#SongList ul');

    //Allows for drag-and-drop of songs.
    _songList.sortable({
        //Whenever a song row is moved inform the Player of the new songlist order.
        //TODO: If it proves necessary I can rewrite this such that instead of syncing the entire playlist I only move the song affected.
        update: function () {
            var songIds = [];
            _songList.find('li a').each(function(){
                songIds.push(this.id);
            })

            Player.sync(songIds);
        }
    });

    //Allows the user to right click on a song and delete or copy its URL
    //by abusing the fact that I can filter out just link clicks and then get the URL of the link clicked.
    //so I make the URL the ID of the song I want to delete or the URL I want to copy.
    var contextMenuOptions = function(){
       //Wrap inside of a closure because functions only make sense in this scope.
        function deleteSong(info) {
            //Info is store in the linkURL.
            var link = info.linkUrl;
            var start = link.lastIndexOf("#") + 1;
            var id = link.substr(start);
            Player.removeSongById(id);
        }

        function copySong(info){
            var link = info.linkUrl;
            var start = link.lastIndexOf("#") + 1;
            var id = link.substr(start);
            var song = Player.getSongById(id);
            chrome.extension.sendRequest({ text: song.url });
        }

        // Create one test item for each context type.
        //TODO: Not sure if people are actually going to use these context menus. If not, should remove this code.
        chrome.contextMenus.removeAll();
        chrome.contextMenus.create({"title": "Delete song", "contexts":["link"], "onclick": deleteSong});
        chrome.contextMenus.create({"title": "Copy song", "contexts":["link"], "onclick": copySong});
    }(); //Call to setup context menu options.

    var songList = {
        //Refresh all the songs displayed to ensure they GUI matches background's data.
        reload: function (songs, currentSong) {
            _songList.empty();

            //I create the entries as <a> to leverage Google Chrome's context menus. 
            //One of the filter options is 'by link' which allows right click -> song options.
            for (var i = 0; i < songs.length; i++){
                var listItem = $('<li/>').appendTo(_songList);

                var link = $('<a/>', {
                    id: songs[i].id,
                    href: '#' + songs[i].id,
                    text: songs[i].name
                }).appendTo(listItem);

                var removeIcon = $('<div/>', {
                    class: "remove",
                    songid: songs[i].id
                }).appendTo(listItem);

                //jQuery does not support appending paths to SVG elements. You MUST declare element inside of svg's HTML mark-up.
                removeIcon.append('<svg><path d="M0,2 L2,0 L12,10 L10,12z"/> <path d="M12,2 L10,0 L0,10 L2,12z"/></svg>');

                var copyIcon = $('<div/>', {
                    class: "copy",
                    songurl: songs[i].url
                }).appendTo(listItem);

                //jQuery does not support appending paths to SVG elements. You MUST declare element inside of svg's HTML mark-up.
                copyIcon.append('<svg><rect x="4.625" y="0" width="2.75" height="12"/><rect x="0" y="4.625" width="12" height="2.75"/></svg>');
            }

            //Add 'delete' to the 'X'
            _songList.find('li .remove').click(function(){
                Player.removeSongById($(this).attr('songid'));
                return false;
            })

            //Add 'copy' to the '+'
            _songList.find('li .copy').click(function(){
                chrome.extension.sendRequest({ text: $(this).attr('songurl') });
                return false;
            })
                
            //Removes the old 'current' marking and move it to the newly selected row.
            var selectRow = function(id){
                _songList.find('li').removeClass('current');
                $('#' + id).parent().addClass('current');
            }

            //Load and start playing a song if it is clicked.
            _songList.children().click( function(){
                var clickedSongId = $(this).children()[0].id;
                Player.loadSongById(clickedSongId);
            })

            //Since we emptied our list we lost the selection, reselect.
            if (currentSong)
                selectRow(currentSong.id)
        }
    }

    return songList;
}