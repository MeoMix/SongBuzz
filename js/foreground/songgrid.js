//The jQGrid object holding a list of songs.
//TODO: Abstract this out a bit so that it calls a generic grid builder.
function songGrid() {
    var _grid = $('#list ul');

    //If moved to front spot then I need to stop the current song.
    //I need to re-sync my playlist.
    _grid.sortable({
        update: function (e, ui) {
            Player.sync(_getIds());
        }
    });

    var _getIds = function(){
        var songRows = _grid.children();
        var ids = [];
        for( var index = 0; index < songRows.length; index++)
            ids.push(songRows[index].id);
        return ids;
    }

   var _selectRow = function(id){
        $('#list li').removeClass('current');
        $('#' + id).parent().parent().addClass('current');
   }

    function deleteSong(info) {
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
    chrome.contextMenus.removeAll();
    chrome.contextMenus.create({"title": "Delete song", "contexts":["link"], "onclick": deleteSong});
    chrome.contextMenus.create({"title": "Copy song", "contexts":["link"], "onclick": copySong});

    var songGrid = {
        //Refresh all the songs displayed to ensure they GUI matches background's data.
        reload: function (songs, currentSong) {
            _grid.empty();

            var items = [];
            //I create the entries as <a> to leverage Google Chrome's context menus. One of the filter options is 'by link' which allows right click -> song options.
            for (var i = 0; i < songs.length; i++){
                var html = '<li><span> <a href="#' + songs[i].id + '" id="'+ songs[i].id + '">' + songs[i].name +'</a> </span>';
                html += '<div class="remove"><svg width="12" height="12"><path d="M0,2 L2,0 L12,10 L10,12z" fill="#000" /> <path d="M12,2 L10,0 L0,10 L2,12z" fill="#000" /> </svg> </div>';
                html += '<div class="add"><svg width="12" height="12"><rect x="4.625" y="0" width="2.75" height="12" fill="#000" /><rect x="0" y="4.625" width="12" height="2.75" fill="#000" /></svg></div>';
                html += '</li>';
                items.push(html);
            }

            _grid.append(items.join(''));

            _grid.children().click( function(){
                var span = $(this).children()[0];
                var link = $(span).children()[0];
                Player.setCurrentSongById(link.id);
                _selectRow(link.id);
                event.preventDefault();
            }).dblclick( function(){
                var span = $(this).children()[0];
                var link = $(span).children()[0];
                //Double-Clicking a song should always stop the song currently playing even if it is the same song.
                Player.loadSongById(link.id);
            })

            if (currentSong)
                _selectRow(currentSong.id)
        }
    }

    return songGrid;
}