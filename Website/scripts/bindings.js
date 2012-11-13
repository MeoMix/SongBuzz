define(['albums', 'libraryController', 'playlists', 'player', 'navigation'], function(albums, libraryController, playlists, player, navigation) {
    'use strict';
    var resetSelection = function() {
        $(".song,.playlist,.standardlist").removeClass("selected");
    };
    //Add a yellow background when clicked.
    //To play, the user must doubleclick.
    $(window).on('resize', function() {
        libraryController.setTableHeaderWidth();
    });
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
        }).on('click', '.list-album', function() {
            albums.showAlbumDialogue($(this));
        }).on('click', '#closepopup', function() {
            $("#popup").removeClass("popupvisible");
            $("#popup").html(this);
        }).on('click', '.db-not-in-db .db-recognize', function() {
            albums.recognizeTrack($(this));
        }).on('click', '.db-in-db .db-recognize', function() {
            var song = libraryController.makeSongOutOfTr($(this).parent(".song"));
            $(this).parent("tr").addClass("in-library").find(".db-status").text(s.inLibrary[language]);
            libraryController.addSong(song, "songs");
        }).on('click', '#album-recognize-all', function() {
            albums.recognizeAll();
        }).on('click', '#album-addasplaylist', function() {
            albums.addAlbumAsPlaylist();
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

    window.updateIcon = function() {
        var newState = ytplayer.getPlayerState()
        if (newState == 0) {
            libraryController.playNext();
        }
        if (newState == 0 || newState == 1) {
            $("#play").hide();
            $("#pause").show();
        } else {
            $("#play").show();
            $("#pause").hide();
        }
    };
})