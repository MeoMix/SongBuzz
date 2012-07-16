//Maintains a list of song objects as an array and exposes methods to affect those objects to Player.
function Playlist(id, name) {
    var _songs = null;

    if(!id)
        id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) { var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8); return v.toString(16); });

    //Get songs from localstorage.
    try {
        var item = localStorage.getItem(id);
        if (item && item != 'undefined')
            _songs = JSON.parse(item);
    }
    catch (exception) {
        console.error(exception);
    }

    //Provide some default songs for first timers.
    if (!_songs)
        _songs = [{ "id": "ec5367e5-0026-4abf-8202-6a6b8fd10878", "songId": "_U4KUmr36Q0", "url": "http://youtu.be/_U4KUmr36Q0", "name": "Dj Alias and Benson - San Francisco Bay", "totalTime": "274" }, { "id": "3bc1b5e6-0055-4d55-bca0-ee472c8474ed", "songId": "bU639WhxTIs", "url": "http://youtu.be/bU639WhxTIs", "name": "Bondax - All Inside | HD", "totalTime": "235" }, { "id": "a7b60601-636f-41db-ac96-5e0fd1a0f7d0", "songId": "CxHFnVCZDRo", "url": "http://youtu.be/CxHFnVCZDRo", "name": "The Beatles - Don't Let Me Down (Gramatik 2012 Remix)", "totalTime": "327"}];

    var _ensureValidState = function () {
        for (var i = 0; i < _songs.length; i++) {
            var song = _songs[i];
            if (!song || !song.url || !song.id || !song.songId || !song.name) {
                _songs.splice(i, 1);
                i--;
            }
        }
    };
    //Remove any corrupt entries from playlist.
    _ensureValidState();

    var _save = function () {
        localStorage.setItem(id, JSON.stringify(_songs));
    };

    //Takes a song's UID and returns the index of that song in the playlist if found.
    var _getSongIndexById = function (id) {
        var songIndex = -1;
        for (var i = 0; i < _songs.length; i++) {
            if (_songs[i].id === id) {
                songIndex = i;
                break;
            }
        }

        if (songIndex == -1)
            throw "Couldn't find song with UID: " + id;

        return songIndex;
    };

    console.log("hi");

    var title = name ? name : "New Playlist";
    console.log("title: " + title);

    var playlist = {
        id: id,
        title: title,
        selected: false,

        clear: function(){
            _songs = [];
            _save();
        },

        //Takes a song's UID and returns the full song object if found.
        getSongById: function (id) {
            var song = null;

            for (var i = 0; i < _songs.length; i++) {
                if (_songs[i].id == id) {
                    song = _songs[i];
                    break;
                }
            }

            if (song == null)
                throw "Couldn't find song with UID:  " + id;

            return song;
        },

        //Takes a song and returns the next song object by index.
        getNextSong: function (currentSongId) {
            console.log("getNextSong");
            var nextSongIndex = _getSongIndexById(currentSongId) + 1;

            //Loop back to the front if at end. Should make this togglable in the future.
            if (_songs.length <= nextSongIndex)
                nextSongIndex = 0;

            return _songs[nextSongIndex];
        },

        songCount: function () {
            return _songs.length;
        },

        getSongs: function () {
            return _songs;
        },

        addSongById: function (songId, callback) {
            var song = new Song(songId, function () {
                _songs.push(song);
                _save();
                callback(song);
            });
        },

        removeSongById: function (id) {
            console.log("removeSongById");
            var index = _getSongIndexById(id);

            if (index != -1) {
                _songs.splice(index, 1);
                _save();
            }
        },

        //Naieve implementation
        //Sync is used to ensure proper song order after the user drag-and-drops a song on the playlist. 
        sync: function (songIds) {
            var syncedSongs = new Array();

            for (var i = 0; i < songIds.length; i++)
                syncedSongs.push(this.getSongById(songIds[i]));

            _songs = syncedSongs;
            _save();
        },

        //Randomizes the playlist and then saves it.
        shuffle: function () {
            var i, j, t;
            for (i = 1; i < _songs.length; i++) {
                j = Math.floor(Math.random() * (1 + i));  // choose j in [0..i]
                if (j != i) {
                    t = _songs[i];                        // swap _songs[i] and _songs[j]
                    _songs[i] = _songs[j];
                    _songs[j] = t;
                }
            }

            _save();
        }
    }

    return playlist;
}

