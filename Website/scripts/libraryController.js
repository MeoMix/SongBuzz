define(['player'], function(player) {
    //method to load *all* songs from the server. This request can be huge, so it is only called the first time
    var loadAllSongs = function() {
        //Authkey is being fetched from localStorage. It is needed and personal for every user.
        var data = {
            authkey: localStorage['authkey']
        };
        //Make the AJAX request!
        var url = "http://songbuzz.host56.com/backend/fb/loadSongs.php";
        $.ajax({
            url: url,
            data: data,
            //Leave this line in for FF support!
            dataType: "json",
            success: function(json) {
                //Loop through received songs and add them to the library
                $.each(json, function(key, song) {
                    addSong(song, "songs");
                });
                //Then, redraw the table!
                //The method updateTable is not needed, since no songs are on the table atm
                drawTable("songs");
            }
        });
    };

    var drawTable = function(list, sort, reverse) {
        //First, clear the table and add the list name to it
        var songs;
        if (typeof list == "object" && list.length > 2) {
            console.log("setting songs to list");
            songs = list;
            $("#songtable").html("").attr("data-list", JSON.stringify(songs));
        } else {
            songs = getSongs(list);
            $("#songtable").html("").attr("data-list", list);
        }
        //If it should sort, sort it!
        if (sort) {
            //Underscore FTW!
            songs = _.sortBy(songs, function(song) { return song[sort]; });
        }
        //Descending? Reverse the array!
        if (reverse) {
            songs = songs.reverse();
        }
        //Make a table!
        var table = $("<table>", {
            id: "thetable",
            border: 0
        });
        var thead = $("<thead>");
        //Make a table header!
        var th = $("<tr>");
        //first value is table header label, second is sort value!
        var labels = [["", ""], ["Title", "title"], ["Duration", "duration"], ["Artists", "artists"], ["Album", "album"]];
        //Add the table headers!
        $.each(labels, function(k, v) {
            var td = $("<th>").text(v[0]).attr("data-sort-key", v[1]);
            if (sort == v[1]) {
                //Add classes for sorting
                var asordesc = (reverse == true) ? "descending" : "ascending";
                td.addClass(asordesc + " sorted");
            }
            td.appendTo(th);
        });
        th.appendTo(thead);
        thead.appendTo(table);

        //Make a table row to add to the table!
        $.each(songs, function(key, value) {
            (buildTableRow(value)).appendTo(table);
        });
        //Make it visible
        table.appendTo("#songtable");
        //Need to do this, otherwise in like 25% of the cases it doesn't work... bug or not?
        setTableHeaderWidth()
    };

    var setTableHeaderWidth = function() {
        for (var i = 0; i < 5; i++) {
            //Get width and add 12 to fix jQuery padding bug
            var tableCellWidth = $("#thetable").find("td").eq(i).width() + 12;
            //Apply to table header
            $("#thetable thead").find("th").eq(i).width(tableCellWidth);
        }
    };

    var getSongs = function(key) {
        if (typeof key == "string") {
            return $.parseJSON(localStorage[key]);
        } else {
            var list = $.parseJSON(localStorage[key[0]]);
            if (key.length == 2) {
                var list = $.parseJSON(list[key[1]]);
            }
            return list;
        }
    };

    //Gets called when next song is pressed. 
    //Is needed for making the "previous" button work
    var addToHistory = function(song) {
        console.log(song);
        constructor().previousSongs.push(song);
        return constructor().previousSongs;
    };

    var addToQueue = function(song, where) {
        //You can specify if you want them at the end of the queue or at the beginning.
        //This is being used for the previous button!
        if (where == "end") {
            constructor().comingUp.push(song);
        } else if (where == "start") {
            //Add the song to the beginning of the queue
            constructor().comingUp.reverse();
            constructor().comingUp.push(song);
            constructor().comingUp.reverse();
        }
    };

    var addSong = function(song, list) {
        //First, get the songs from the localStorage
        var array = getSongs(list);
        //Check if song is not already in library!
        if (checkIfExists(song, list) == true) {
            console.log("Track already in library!");
        } else {
            //Finally, push it to the array and save it!
            array.push(song);
            localStorage.songs = JSON.stringify(array);
            //Update the table!
            if (list == $("#songtable").attr("data-list")) {
                updateTable(list);
            }
        }
    };

    //Method for checking if a song is already in the users library
    var checkIfExists = function(bsong, list) {
        //Variables asong and bsong are used for checking.
        var exists = false;
        var songs = getSongs(list);
        $.each(songs, function(key, asong) {
            //Compare lastfmid's
            if (asong.lastfmid == bsong.lastfmid) {
                exists = true;
            }
        });
        return exists;
    };

    //Tricky one, but the hard things are made on the server...
    //Checks which songs need to be added and which should be deleted
    var compareSongs = function(list) {
        //If not specified, assume to delete from main list...
        list = (list == undefined) ? "songs" : list;
        //Make a empty array
        var songs = [];
        //Collect all lastfmid's
        $.each(getSongs(list), function(k, v) {
            songs.push(v.lastfmid);
        });
        //Make a CSV to send to the server
        var joinedsongs = songs.join(",");
        //Get authentication
        var authkey = localStorage["authkey"];
        //Make daaaa request!
        $.ajax({
            url: "http://songbuzz.host56.com/backend/fb/compareSongs.php?authkey=" + authkey + "&list=" + list,
            dataType: "json",
            data: { "songs": joinedsongs },
            type: 'POST',
            success: function(json) {
                $.each(json.add, function(k, v) {
                    //Loop through songs to add and add them!
                    addSong(v, list);
                });
                $.each(json.remove, function(k, v) {
                    //Loop through songs to remove and remove them!
                    removeSong(v, list);
                });
            }
        });
    };

    var removeSong = function(lastfmid, list) {
        //If no list specified, assume that it is the main library
        list = (list == undefined) ? "songs" : list;
        //Get tha songs!
        var array = getSongs(list);
        //Loop through songs...
        $.each(array, function(key, value) {
            //...find the song...
            if (value.lastfmid == lastfmid) {
                //..remove it...
                array.splice(key, 1);
                return false;
            }
        });
        //...and save it!
        localStorage.songs = JSON.stringify(array);
        //Update th table!
        if (list == $("#songtable").attr("data-list")) {
            $("tr[data-lastfmid=" + lastfmid + "]").remove();
        }
        //Wait... did we forget something?
        //Remove the song on the server too!
        var data = {
            "song": lastfmid,
            "authkey": localStorage["authkey"],
            "list": list
        };
        //Make the request to the server!
        $.ajax({
            url: "http://songbuzz.host56.com/backend/fb/removeSong.php",
            data: data,
            dataType: "json",
            success: function() {
                //It's gone!
            }
        });
    };

    //Makes a table song
    var buildTableRow = function(value) {
        var tr = $("<tr>", {
            //song class specifies everything which is a song and has metadata attached to the dom
			//song-list class specified everything which is in a song list
			//recognized class specifies every recognized song
			//in-library class specifies songs who are in the users library regardless the current list
            'class': "song song-list recognized in-library",
            //Add metdata to it!
            "data-title": value.title,
            "data-artists": value.artists,
            "data-album": value.album,
            "data-albumid": value.albumid,
            "data-artistsid": value.artistsid,
            "data-countries": value.countries,
            "data-cover": value.cover,
            "data-hoster": value.hoster,
            "data-hosterid": value.hosterid,
            "data-lastfmid": value.lastfmid,
            "data-duration": value.duration,
            "data-plays": value.plays
        });

        //The cells...
        $("<td>").addClass("playing-indicator").appendTo(tr);
        $("<td>").addClass("list-title").text(value.title).appendTo(tr);
        $("<td>").addClass("list-duration").text(Helpers.prettyPrintTime(value.duration)).appendTo(tr);
        $("<td>").addClass("list-artist").text(value.artists).appendTo(tr);
        var albumtd = $("<td>").addClass("list-album").text(value.album);
        if (value.albumid == "" || value.albumid == undefined) {
            albumtd.attr("data-navigate", "Album/" + value.album + "_" + value.artists);
        }
        else {
            albumtd.attr("data-navigate", "Album/" + value.albumid);
        }
        albumtd.appendTo(tr);
        //Add class "nowplaying if needed"
        var nowplaying = constructor().nowPlaying;
        if (nowplaying != null && nowplaying.lastfmid == value.lastfmid) {
            tr.addClass("nowplaying");
        }

        return tr;
    };

    var isInLibrary = function(song) {
        var songs = getSongs("songs");
        var inLibrary = false;
        $.each(songs, function(k, v) {
            if (v.lastfmid == song.lastfmid) {
                inLibrary = true;
            }
        });
        return inLibrary;
    };

    //Does not redraw the table, only updates it!
    //Currently does not work with sorting
    var updateTable = function(list) {
        //Get the table songs
        var tablesongs = $("#thetable .song");
        var tablesongsarray = [];
        $.each(tablesongs, function(key, value) {
            tablesongsarray.push(makeSongOutOfTr($(value)));
        });
        //Get the songs
        var songs = getSongs(list);
        //Compare!
        $.each(songs, function(key, value) {
            //Add songs that must be added!
            var isthere = false;
            $.each(tablesongsarray, function(k, v) {
                if (value.lastfmid == v.lastfmid) {
                    isthere = true;
                }
            });
            if (isthere == false) {
                var tr = buildTableRow(value);
                tr.appendTo("#thetable");
            }
        });
        $.each(tablesongsarray, function(key, value) {
            //Remove songs that must be removed!
            var isthere = false;
            $.each(songs, function(k, v) {
                if (value.lastfmid == v.lastfmid) {
                    isthere = true;
                }
            });
            if (isthere == false) {
                console.log(value);
                $(".song[data-hosterid=" + value.hosterid + "]").remove();
            }
        });
    };

    var playSong = function(song) {
        $("#now-cover").attr("src", song.cover);
        //TODO: is LoadVideo always successfully called?
        player.loadVideo(song.hosterid);
        constructor().nowPlaying = song;
        //remove from every other song which is being stopped
        $(".song").removeClass("nowplaying");
        //Add class to current song
        $(".song[data-lastfmid=" + song.lastfmid + "]").addClass("nowplaying");

        //Add +1 listen to the server!
        $.ajax({
            url: "http://songbuzz.host56.com/backend/songs/listen.php",
            data: { "songid": song.lastfmid },
            dataType: "json",
            success: function() {
                console.log("Now playing: ", song, "Listen added.");
            }
        });
    };

    var createList = function(list) {
        //Function checks if it is an array or object
        var currentList;
        if (list.substr(0, 2) == "[{") {
            currentList = $.parseJSON(list);
        } else {
            currentList = list.split(",");
        }
        return currentList;
    };

    var makeSongOutOfTr = function(node) {
        var attrs = ["album", "albumid", "artists", "artistsid", "countries", "cover", "duration", "hoster", "hosterid", "lastfmid", "title"];
        var song = { };
        $.each(attrs, function(key, value) {
            song[value] = $(node).attr("data-" + value);
        });
        return song;
    };
    var constructor = _.once(function() {
        return {
            //Setup a played recently array!
            previousSongs: [],
            nowPlaying: null,
            comingUp: [],
            //Is being used when comingUp is empty
            endQueue: []
        };
    });
    return {
        setTableHeaderWidth: setTableHeaderWidth,
        get previousSongs() {
            return constructor().previousSongs;
        },
        get nowPlaying() {
            return constructor().nowPlaying;
        },
        get comingUp() {
            return constructor().comingUp;
        },
        get endQueue() {
            return constructor().endQueue;
        },
        set NowPlaying(value) {
            constructor().nowPlaying = value;
        },
        set EndQueue(value) {
            constructor().endQueue = value;
        },
        //Gets called when website is opened.
        start: function() {
            //No songs saved on the client side? Ok, load them all!
            if (localStorage.songs == "null" || localStorage.songs == null) {
                //Create array in localStorage
                localStorage.songs = "[]";
                loadAllSongs();
            }
                //First, check for new songs/deleted songs, then draw the table
            else {
                compareSongs("songs");
                drawTable("songs");
            }
        },
        //Right-click to add to the queue. 
        //Queue songs are always played first, then the auto-generated songs will be played
        addToQueue: addToQueue,
        //Method for adding a song to the library
        addSong: addSong,
        //Removes a song from the library!
        removeSong: removeSong,
        //Shorthand for getting the songs from the localStorage!
        getSongs: getSongs,
        //Calls drawTable with exta parameters. Valid values for sort are title, artist*s* and album as well as duration
        sortTable: function(sort, reverse) {
            var list = $("#songtable").attr("data-list");
            //If it is a JSON, parse it!
            var currentList = createList(list);
            drawTable(currentList, sort, reverse);
        },
        //Draws the whole song list!
        drawTable: drawTable,
        //Let's make some musssic!
        playSong: playSong,
        //Move to the next track!
        playNext: function() {
            //Add current to history
            addToHistory(constructor().nowPlaying);
            //If no songs are in the user queue, continue with auto-generated songs
            if (constructor().comingUp.length == 0) {
                //Remove the first song in the queue and return it
                var songtoplay = constructor().endQueue.slice(0, 1);
                //Make song out of talbe row and play it
                playSong(makeSongOutOfTr($(songtoplay)));
                //Autogenerate new songs
                constructor().endQueue = $(".nowplaying").nextAll(".song");
            } else {
                //This line removes the first element of the array
                //and plays it
                var songtoplay = constructor().comingUp.shift();
                playSong(songtoplay);
            }
        },
        //Plays the previous song
        playPrevious: function() {
            //when pressing forward, the nowplaying song will be played
            addToQueue(constructor().nowPlaying, "start");
            //This line gets the song to play and takes it from the history
            var songtoplay = constructor().previousSongs.pop(); //Turn it up
            playSong(songtoplay);

        },
        //Makes a song object out of the metadata saved in the DOM
        makeSongOutOfTr: makeSongOutOfTr,
        createList: createList,
        isInLibrary: isInLibrary
    };
});