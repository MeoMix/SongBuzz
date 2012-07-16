function songList() {
    var _songList = $('#SongList ul');

    //Currently taking the lazy way out by just syncing the entire playlist whenever a user drags a song instead
    //of figuring out how to move the element in the list.
    _songList.sortable({
        update: function (e, ui) {
            var getIds = function(){
                var songRows = _songList.children();
                var ids = [];
                for( var index = 0; index < songRows.length; index++)
                    ids.push(songRows[index].id);
                return ids;
            }

            Player.sync(getIds());
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
        chrome.contextMenus.removeAll();
        chrome.contextMenus.create({"title": "Delete song", "contexts":["link"], "onclick": deleteSong});
        chrome.contextMenus.create({"title": "Copy song", "contexts":["link"], "onclick": copySong});
    }(); //Call to setup context menu options.

    var songList = {
        //Refresh all the songs displayed to ensure they GUI matches background's data.
        reload: function (songs, currentSong) {
            _songList.empty();

            var items = [];
            //I create the entries as <a> to leverage Google Chrome's context menus. One of the filter options is 'by link' which allows right click -> song options.
            for (var i = 0; i < songs.length; i++){
                var html = '<li><span> <a href="#' + songs[i].id + '" id="'+ songs[i].id + '">' + songs[i].name +'</a> </span>';
                html += '<div class="remove" songid=' + songs[i].id + '><svg width="12" height="12"><path d="M0,2 L2,0 L12,10 L10,12z" fill="#000" /> <path d="M12,2 L10,0 L0,10 L2,12z" fill="#000" /> </svg> </div>';
                html += '<div class="copy" songurl=' + songs[i].url + '><svg width="12" height="12"><rect x="4.625" y="0" width="2.75" height="12" fill="#000" /><rect x="0" y="4.625" width="12" height="2.75" fill="#000" /></svg></div>';
                html += '</li>';
                items.push(html);
            }

            _songList.append(items.join(''));

            //Add 'delete' to the 'X'
            _songList.children('li').children('.remove').click(function(){
                Player.removeSongById($(this).attr('songid'));
                return false;
            })

            //Add 'copy' to there '+'
            _songList.children('li').children('.copy').click(function(){
                chrome.extension.sendRequest({ text: $(this).attr('songurl') });
                return false;
            })

            var selectRow = function(id){
                $('#SongList li').removeClass('current');
                $('#' + id).parent().parent().addClass('current');
            }

            //Whenever a song row is clicked it will be selected (doesn't do much just being selected currently)
            //Whenever a song row is doule-clicked it will be selected and start to play.
            _songList.children().click( function(){
                var span = $(this).children()[0];
                var link = $(span).children()[0];
                Player.setCurrentSongById(link.id);
                selectRow(link.id);
                event.preventDefault();
            }).dblclick( function(){
                var span = $(this).children()[0];
                var link = $(span).children()[0];
                //Double-Clicking a song should always stop the song currently playing even if it is the same song.
                Player.loadSongById(link.id);
            })

            //Since we emptied our list we lost the selection, reselect.
            if (currentSong)
                selectRow(currentSong.id)
        }
    }

    return songList;
}