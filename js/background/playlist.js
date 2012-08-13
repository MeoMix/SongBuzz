//Maintains a list of song objects as an array and exposes methods to affect those objects to Player.
function Playlist(id, name) {
    "use strict";
    var songs = null;

    //If ID has not been defined then generate a new unique ID.
    if(!id){
        id = Helpers.generateGuid();
    }

    //Get songs from localstorage.
    try {
        var item = localStorage.getItem(id);
        if (item){
            songs = JSON.parse(item);
        }
    }
    catch (exception) {
        console.error(exception);
    }

    //Provide some default songs for first timers.
    if (!songs){
        songs = [{ "id": "ec5367e5-0026-4abf-8202-6a6b8fd10878", "videoId": "_U4KUmr36Q0", "url": "http://youtu.be/_U4KUmr36Q0", "name": "Dj Alias and Benson - San Francisco Bay", "totalTime": "274" }, { "id": "3bc1b5e6-0055-4d55-bca0-ee472c8474ed", "videoId": "bU639WhxTIs", "url": "http://youtu.be/bU639WhxTIs", "name": "Bondax - All Inside | HD", "totalTime": "235" }, { "id": "a7b60601-636f-41db-ac96-5e0fd1a0f7d0", "videoId": "CxHFnVCZDRo", "url": "http://youtu.be/CxHFnVCZDRo", "name": "The Beatles - Don't Let Me Down (Gramatik 2012 Remix)", "totalTime": "327"}];
    }

    //Remove any corrupt entries from playlist.
    var ensureValidState = function () {
        for (var i = 0; i < songs.length; i++) {
            var song = songs[i];
            if (!song || !song.url || !song.id || !song.videoId || !song.name) {
                songs.splice(i, 1);
                i--;
            }
        }   
    }();

    var save = function () {
        localStorage.setItem(id, JSON.stringify(songs));
    };

    //Takes a song's UID and returns the index of that song in the playlist if found.
    var getSongIndexById = function (id) {
        var songIndex = -1;
        for (var i = 0; i < songs.length; i++) {
            if (songs[i].id === id) {
                songIndex = i;
                break;
            }
        }

        if (songIndex === -1){
            throw "Couldn't find song with UID: " + id;
        }

        return songIndex;
    };

    return {
        id: id,
        title: name ? name : "New Playlist",
        selected: false,
        setTitle: function(value){
            this.title = value;
            save();
        },
        clear: function(){
            songs = [];
            save();
        },
        deselect: function(){
            this.selected = false;
            save();
        },
        select: function(){
            this.selected = true;
            save();
        },
        //Takes a song's UID and returns the full song object if found.
        getSongById: function (id) {
            var song = null;

            for (var i = 0; i < songs.length; i++) {
                if (songs[i].id === id) {
                    song = songs[i];
                    break;
                }
            }

            if (song === null){
                throw "Couldn't find song with UID:  " + id;
            }

            return song;
        },
        getFirstSong: function(){
            var firstSong = songs[0];
            return firstSong;
        },
        //Takes a song and returns the next song object by index.
        getNextSong: function (currentId) {
            var nextSongIndex = getSongIndexById(currentId) + 1;

            //Loop back to the front if at end. Should make this togglable in the future.
            if (songs.length <= nextSongIndex){
                nextSongIndex = 0;
            }

            return songs[nextSongIndex];
        },
        getPreviousSong: function (currentId) {
            var previousSongIndex = getSongIndexById(currentId) - 1;

            // Goes to the end of the current playlist.
            if (previousSongIndex < 0){
                previousSongIndex = songs.length - 1;
            }
            
            return songs[previousSongIndex];
        },
        songCount: function () {
            return songs.length;
        },
        getSongs: function () {
            return songs;
        },
        addSongById: function (videoId, callback) {
            YTHelper.getVideoInformation(videoId, function(videoInformation){
                var song = new Song(videoInformation);
                songs.push(song);
                save();
                callback(song);
            })
        },
        removeSongById: function (id) {
            var index = getSongIndexById(id);

            if (index !== -1) {
                songs.splice(index, 1);
                save();
            }
        },
        //Naieve implementation
        //Sync is used to ensure proper song order after the user drag-and-drops a song on the playlist. 
        sync: function (ids) {
            var syncedSongs = [];

            $(ids).each(function(){
                var song = this.getSongById(this);
                syncedSongs.push(song);
            });

            songs = syncedSongs;
            save();
        },
        //Randomizes the playlist and then saves it.
        shuffle: function () {
            var i, j, t;
            for (i = 1; i < songs.length; i++) {
                j = Math.floor(Math.random() * (1 + i));  // choose j in [0..i]
                if (j !== i) {
                    t = songs[i];                        // swap songs[i] and songs[j]
                    songs[i] = songs[j];
                    songs[j] = t;
                }
            }

            save();
        }
    };
}

