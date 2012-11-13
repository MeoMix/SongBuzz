define(function() {
    "use strict";
    var createLocalStorage = function() {
        //Makes an empty object if not defined yet.
        if (localStorage.playlists == undefined || localStorage.playlists == "null") {
            localStorage.playlists = "{}";
        }
    };
    var getPlaylists = function() {
        //Check if object exists
        createLocalStorage();
        //Then return the playlists!
        return $.parseJSON(localStorage.playlists);
    };
    var deletePlaylist = function(playlist) {
        var playlists = getPlaylists();
        if (checkPlaylistExistence(playlist) == true) {
            delete playlists[playlist];
            savePlaylists(playlists);
            return getPlaylists();
        }
    };
    var savePlaylists = function(object) {
        localStorage.playlists = JSON.stringify(object);
        //Redraw playlists!
        drawPlaylists();
    };
    var checkPlaylistExistence = function(name) {
        //Fetch playlists
        var playlists = getPlaylists();
        if (playlists[name] != undefined) {
            return true;
        } else {
            return false;
        }
    };
    var drawPlaylists = function() {
        createLocalStorage(); //Get div and clear it;
        var playlistsdiv = $("#playlistlist").html("");
        $.each(getPlaylists(), function(name, songs) {
            $("<div>", {
                class: "playlist",
                "data-playlist-name": name,
                "data-navigate": "Playlists/" + name
            })
                .text(name)
                .appendTo(playlistsdiv);
        });
    };
    var checkIfSongInPlaylist = function(playlistname, givensong) {
        var playlist = $.parseJSON(getPlaylists()[playlistname]);
        console.log(playlistname);
        if (checkPlaylistExistence(playlistname) == true) {
            var isduplicate = false;
            $.each(playlist, function(key, song) {
                if (song.lastfmid == givensong.lastfmid) {
                    isduplicate = true;
                }
            });
            return isduplicate;
        } else {
            console.log("Playlist does not exist");
            return true;
        }
    };
    var addPlaylist = function(name) {
        //Fetch playlists;
        var playlists = getPlaylists();
        if (checkPlaylistExistence(name) == false) {
            playlists[name] = "[]";
        }
        savePlaylists(playlists);
        return getPlaylists();
    };
    return {
        createPlaylistDialogue: function() {
            $("<input>", {
                id: "playlistinput",
            }).insertAfter("#playlistlist")
                .on("keypress", function(e) {
                    if (e.keyCode == 13) {
                        addPlaylist(this.value);
                        $(this).remove();
                    }
                });
        },
        getPlaylist: function(playlist) {
            return getPlaylists()[playlist];
        },
        addSongToPlaylist: function(playlist, song) {
            createLocalStorage();
            if (checkIfSongInPlaylist(playlist, song) == false) {
                var playlists = getPlaylists();
                var list = $.parseJSON(playlists[playlist]);
                list.push(song);
                playlists[playlist] = JSON.stringify(list);
                savePlaylists(playlists);
                return getPlaylists();
            } else {
                console.log("Playlist does not exist // Song already in playlist");
            }
        },
        addPlaylist: addPlaylist,
        drawPlaylists: drawPlaylists,
        deletePlaylist: deletePlaylist
    };
})