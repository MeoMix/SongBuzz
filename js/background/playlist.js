function playlist() {
    var _songs = null;

    try {
        var item = localStorage.getItem('playlist');

        if (item && item != 'undefined')
            _songs = JSON.parse(item);
    }
    catch (exception) {
        console.error(exception);
    }

    //Provide some default songs for first timers.
    if (!_songs)
        _songs = [{ "id": "5e2e8a2d-fb87-4193-b279-5914fcb629cf", "songId": "KCXVCpcopa8", "url": "http://youtu.be/KCXVCpcopa8", "name": "Black Violin \"Brandenburg\" - Music Video", "totalTime": "04:12" }, { "id": "1406b9a8-130a-45e9-94f4-d4f93de4d7a7", "songId": "6gZzTAD7DeQ", "url": "http://youtu.be/6gZzTAD7DeQ", "name": "Haywyre - Mindchamber (OFFICIAL MUSIC VIDEO)", "totalTime": "05:52" }, { "id": "15770327-f761-490b-bd3e-c89ca0632e1e", "songId": "geyzTbIU4S0", "url": "http://youtu.be/geyzTbIU4S0", "name": "Infected Mushroom - U R So Fucked (Opiuo Remix)", "totalTime": "05:38" }, { "id": "f2bfa3da-8dc3-435b-842d-b4a58fb4a86a", "songId": "SyORw8bee4o", "url": "http://youtu.be/SyORw8bee4o", "name": "Coyote Kisses - Acid Wolfpack", "totalTime": "05:40"}]

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
        localStorage.setItem('playlist', JSON.stringify(_songs));
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
            throw "Couldn't find song with UID:  " + id;

        return songIndex;
    };

    var playlist = {
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
            var index = _getSongIndexById(id);

            if (index != -1) {
                _songs.splice(index, 1);
                _save();
            }
        },

        //Naieve implementation
        sync: function (songIds) {
            var syncedSongs = new Array();

            for (var i = 0; i < songIds.length; i++)
                syncedSongs.push(this.getSongById(songIds[i]));

            _songs = syncedSongs;
            _save();
        },

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

