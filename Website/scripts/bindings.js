define(['albums', 'libraryController', 'playlists', 'player', 'navigation', 'search', 'notifications'], function(albums, libraryController, playlists, player, navigation, search, notifications) {
    'use strict';
    var resetSelection = function() {
        $(".song,.playlist,.standardlist").removeClass("selected");
    };
    //Add a yellow background when clicked.
    //To play, the user must doubleclick.
    $(document).on('click', '.recognized,.playlist', function() {
        resetSelection();
        $(this).addClass("selected");
    })
        .on('click', '#addplaylist', function() {
            playlists.createPlaylistDialogue();
        })
        .on("click", '[data-navigate]', function() {
            var list = $(this).attr("data-navigate");
            navigation.to(list)
        })
        .on('drop', '.playlist', function() {
            playlists.addSongToPlaylist($(this).attr("data-playlist-name"), window.nowDragging);
            $(this).removeClass("dragover");
        }).on('dragover', '.playlist', function(e) {
            e.preventDefault();
            $(this).addClass("dragover");
        })
        .on("dragleave", '.playlist', function() {
            $(this).removeClass("dragover");
        })
        .on("dragstart", '.recognized', function() {
            window["nowDragging"] = libraryController.makeSongOutOfTr($(this));
        })
        .on('dblclick', '.recognized', function() {
            //Remove all other nowplaying classes and give them to this one
            $(".song").removeClass("nowplaying selected");
            $(this).addClass("selected nowplaying");
            //Defining the <tr> and getting attributes
            var node = $(this);
            var song = libraryController.makeSongOutOfTr(node);
            libraryController.EndQueue = $(this).nextAll(".recognized");
            libraryController.playSong(song);
        }).on('click', '#play', function() {
            player.play();
        }).on('click', '#pause', function() {
            player.pause();
        }).on('click', '#next', function() {
            libraryController.playNext();
        }).on('click', '#previous', function() {
            libraryController.playPrevious();
        }).on('click', '.db-not-in-db .db-recognize', function() {
            albums.recognizeTrack(this);
        }).on('click', '.db-in-db .db-recognize', function() {
            var song = libraryController.makeSongOutOfTr($(this).parent(".song"));
            $(this).parent("tr").addClass("in-library").find(".db-status").text(s.inLibrary[language]);
            libraryController.addSong(song, "songs");
        }).on('click', '#album-recognize-all', function() {
            albums.recognizeAll();
        }).on('click', '#album-addasplaylist', function() {
            albums.addAlbumAsPlaylist();
        }).on('popstate', window, function() {
            console.log(history.state)
        }).on('keyup', '#searchinput', function() {
            search.buildQuery("hi")
        }).on('hover', '[data-tooltip]', function() {
            var original = this,
                text = $(original).attr("data-tooltip"),
                randomid = Math.floor(Math.random()*100000)
            var tooltip = $("<div>", {
                class: "tooltip",
                "data-toolid": randomid
            }).text(text).css({
                "top": ($(original).offset()).top + $(original).height(),
                "left": ($(original).offset()).left
            })
            tooltip.appendTo("body")
            var difference = (tooltip.width() - $(original).width());
            tooltip.css("left", "+=" + (0-(difference/2)))
        })
        .on('mouseleave', '[data-tooltip]', function() {
           $(".tooltip").remove()
        })
        .on('click', '#songtable th', function() {
            var node = $(this);
            node.siblings().removeClass("ascending descending sorted");
            var sort = node.attr("data-sort-key");
            if (node.hasClass("ascending")) {
                libraryController.sortTable(sort, true);
            } else if (node.hasClass("descending")) {
                libraryController.drawTable(libraryController.createList($("#songtable").attr("data-list")));
            } else {
                libraryController.sortTable(sort);
            }
        });
    window.onpopstate = function() {
        if (history.state == null) {
            navigation.to("Library/Songs")
        }
        else {
            navigation.to(history.state.scheme)
        }
        
    }
    ytplayer.addEventListener("onError", function(error) {
        var youtubeerrors = {
            100: s.videoRemoved[language],
            2: s.videoIdInvalid[language],
            101: s.videoNotEmbeddable[language]
        }
        notifications.show({
            text: youtubeerrors[error.data] + s.kippingTrack[language]
        })
        libraryController.playNext()
    })
})