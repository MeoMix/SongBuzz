//The jQGrid object holding a list of songs.
//TODO: Abstract this out a bit so that it calls a generic grid builder.
function songGrid() {
    var _grid = $('#list');
    // _grid.jqGrid({
    //     align: 'center',
    //     cellEdit: false,
    //     colNames: ['Title'],
    //     colModel: [{ name: 'title', index: 'title', sortable: false, width: $('body').width()}],
    //     resizable: false,
    //     rowNum: 10,
    //     rowList: [10, 20, 30],
    //     sortname: 'title',
    //     scrollOffset: 0,
    //     sortorder: 'desc',
    //     hidegrid: false,
    //     height: 260,
    //     width: 317,
    //     loadComplete: function (data) {
    //         //If the Player already exists (not first load) go get data instead of waiting for a broadcast.
    //         if (Player)
    //             songGrid.reload(Player.getSongs(), Player.getCurrentSong());
    //     },
    //     beforeSelectRow: function (rowId, e) {
    //         //Don't fire select when user interact with icons on row.
    //         var allow = !(e.target instanceof HTMLImageElement);
    //         return allow;
    //     },
    //     onSelectRow: function (rowId, status) {
    //         Player.setCurrentSongById(rowId);
    //     },
    //     ondblClickRow: function (rowId, iRow, iCol, e) {
    //         //Don't fire a double click when user interact with icons on row.
    //         if (e.target instanceof HTMLImageElement)
    //             return false;

    //         //Double-Clicking a song should always stop the song currently playing even if it is the same song.
    //         Player.loadSongById(rowId);
    //     }
    // });

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
        $('#list li a').removeClass('active');
       $('#' + id).addClass('active');
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
            for (var i = 0; i < songs.length; i++)
                items.push('<li> <a href="#' + songs[i].id + '" id="'+ songs[i].id + '">' + songs[i].name +'</a></li>');

            _grid.append(items.join(''));

            _grid.children().click( function(){
                var link = $(this).children()[0];
                Player.setCurrentSongById(link.id);
                _selectRow(link.id);
                event.preventDefault();
            }).dblclick( function(){
                var link = $(this).children()[0];
                //Double-Clicking a song should always stop the song currently playing even if it is the same song.
                Player.loadSongById(link.id);
            })

            if (currentSong)
                _selectRow(currentSong.id)
                //_grid.setSelection(currentSong.id, false);
        }
    }

    return songGrid;
}