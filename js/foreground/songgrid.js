//The jQGrid object holding a list of songs.
//TODO: Abstract this out a bit so that it calls a generic grid builder.
function songGrid() {
    var _grid = $('#SongGrid');
    _grid.jqGrid({
        align: 'center',
        cellEdit: false,
        colNames: ['Title'],
        colModel: [{ name: 'title', index: 'title', sortable: false, width: $('body').width()}],
        resizable: false,
        rowNum: 10,
        rowList: [10, 20, 30],
        sortname: 'title',
        scrollOffset: 0,
        sortorder: 'desc',
        hidegrid: false,
        height: 260,
        width: 317,
        loadComplete: function (data) {
            //If the Player already exists (not first load) go get data instead of waiting for a broadcast.
            if (Player)
                songGrid.reload(Player.getSongs(), Player.getCurrentSong());
        },
        beforeSelectRow: function (rowId, e) {
            //Don't fire select when user interact with icons on row.
            var allow = !(e.target instanceof HTMLImageElement);
            return allow;
        },
        onSelectRow: function (rowId, status) {
            Player.setCurrentSongById(rowId);
        },
        ondblClickRow: function (rowId, iRow, iCol, e) {
            //Don't fire a double click when user interact with icons on row.
            if (e.target instanceof HTMLImageElement)
                return false;

            //Double-Clicking a song should always stop the song currently playing even if it is the same song.
            Player.loadSongById(rowId);
        }
    });

    //If moved to front spot then I need to stop the current song.
    //I need to re-sync my playlist.
    _grid.sortableRows({
        update: function (e, ui) {
            Player.sync(_grid.getDataIDs());
        }
    });

    //Don't care to show the sortable column headers currently.
    $('.ui-jqgrid-hdiv').hide();
    var _clipboardCopyIconPath = 'images/clipboardCopy.png';
    var _removeIconPath = 'images/remove.png';

    //TODO: Write these better.
    //The clipboard copy image, when clicked, copies the song row's URL to the users clipboard.
    var _buildClipboardCopyLink = function (songId, songUrl) {
        var element = '<a href="#" id="' + songId + '_clipboardCopy" title="Copy: ' + songUrl + '" url="' + songUrl + '">';
        element += '<img src="' + _clipboardCopyIconPath + '" class="songIcon" />';
        element += '</a>';
        return element;
    };

    //The delete image, when clicked, deletes the song at the clicked row.
    var _buildDeleteLink = function (songId, songName) {
        var element = '<a href="#" id="' + songId + '_remove" title="Remove: ' + songName + '" songId="' + songId + '" >';
        element += '<img src="' + _removeIconPath + '" class="songIcon" />';
        element += '</a>';
        return element;
    };

    var songGrid = {
        //Refresh all the songs displayed to ensure they GUI matches background's data.
        reload: function (songs, currentSong) {
            _grid.clearGridData();
            for (var i = 0; i < songs.length; i++) {
                var song = songs[i];
                var songRowData = { title: _buildDeleteLink(song.id, song.name) + _buildClipboardCopyLink(song.id, song.url) + song.name };
                _grid.addRowData(song.id, songRowData);

                $('#' + song.id + '_clipboardCopy').click(function (a) {
                    //Sends a request to copy the songURL to user's clipboard.
                    //Only the background page has elevated privileges to do so.
                    var urlToCopyToClipboard = $(this).attr('url');
                    chrome.extension.sendRequest({ text: urlToCopyToClipboard });
                });
                $('#' + song.id + '_remove').click(function () {
                    Player.removeSongById($(this).attr('songId'));
                });
            }

            if (currentSong)
                _grid.setSelection(currentSong.id, false);
        }
    }

    return songGrid;
}