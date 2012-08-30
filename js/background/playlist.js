//Maintains a list of song objects as an array and exposes methods to affect those objects to Player.
//TODO: Introduce a new object call Songs which will hold Song objects.
function Playlist(id, name) {
    "use strict";
    //If no playlistid or name provided assume default playlist and create default song list.
    var isDefaultPlaylist = !(id && name);
    var playlist = {
        id: id ? id : Helpers.generateGuid(),
        title: name ? name : "New Playlist",
        selected: false,
        songs: !isDefaultPlaylist ? [] : [{ 
                "id": "ec5367e5-0026-4abf-8202-6a6b8fd10878", 
                "videoId": "_U4KUmr36Q0", 
                "url": "http://youtu.be/_U4KUmr36Q0", 
                "name": "Dj Alias and Benson - San Francisco Bay", 
                "totalTime": "274" 
            }, { 
                "id": "3bc1b5e6-0055-4d55-bca0-ee472c8474ed", 
                "videoId": "bU639WhxTIs", 
                "url": "http://youtu.be/bU639WhxTIs", 
                "name": "Bondax - All Inside | HD", 
                "totalTime": "235" 
            }, {
                "id": "a7b60601-636f-41db-ac96-5e0fd1a0f7d0", 
                "videoId": "CxHFnVCZDRo", 
                "url": "http://youtu.be/CxHFnVCZDRo", 
                "name": "The Beatles - Don't Let Me Down (Gramatik 2012 Remix)", 
                "totalTime": "327"
            }]
    };

    var save = function () {
        localStorage.setItem(playlist.id, JSON.stringify(playlist));
    };

    var loadPlaylist = function(){
        //Methods are unable to be serized to localStorage.
        var playlistJson = localStorage.getItem(playlist.id)

        try {
            if (playlistJson){
                playlist = JSON.parse(playlistJson);
            }
        }
        catch(exception){
            console.error(exception);
        }
    }();

    //Takes a song's UID and returns the index of that song in the playlist if found.
    var getSongIndexById = function (id) {
        var songIndex = -1;
        for (var i = 0; i < playlist.songs.length; i++) {
            if (playlist.songs[i].id === id) {
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
        //TODO: Is there any way to have this be a property instead of a method, but not expose the setter?
        getId: function(){
            return playlist.id;
        },
        getTitle: function(){
            return playlist.title;
        },
        setTitle: function(value){
            playlist.title = value;
            save();
        },
        clear: function(){
            playlist.songs = [];
            save();
        },
        getSelected: function(){
            return playlist.selected;
        },
        setSelected: function(value){
            playlist.selected = value;
            save();
        },
        //Takes a song's UID and returns the full song object if found.
        getSongById: function (id) {
            var song = null;

            for (var i = 0; i < playlist.songs.length; i++) {
                if (playlist.songs[i].id === id) {
                    song = playlist.songs[i];
                    break;
                }
            }

            if (song === null){
                throw "Couldn't find song with UID:  " + id;
            }

            return song;
        },
        getFirstSong: function(){
            var firstSong = playlist.songs[0];
            return firstSong;
        },
        //Takes a song and returns the next song object by index.
        getNextSong: function (currentId) {
            var nextSongIndex = getSongIndexById(currentId) + 1;

            //Loop back to the front if at end. Should make this togglable in the future.
            if (playlist.songs.length <= nextSongIndex){
                nextSongIndex = 0;
            }

            return playlist.songs[nextSongIndex];
        },
        getPreviousSong: function (currentId) {
            var previousSongIndex = getSongIndexById(currentId) - 1;

            // Goes to the end of the current playlist.
            if (previousSongIndex < 0){
                previousSongIndex = songs.length - 1;
            }
            
            return playlist.songs[previousSongIndex];
        },
        songCount: function () {
            return playlist.songs.length;
        },
        getSongs: function () {
            return playlist.songs;
        },
        addSongById: function (videoId, callback) {
            YTHelper.getVideoInformation(videoId, function(videoInformation){
                var song = new Song(videoInformation);
                playlist.songs.push(song);
                save();
                callback(song);
            })
        },
        removeSongById: function (id) {
            var index = getSongIndexById(id);

            if (index !== -1) {
                playlist.songs.splice(index, 1);
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

            playlist.songs = syncedSongs;
            save();
        },
        //Randomizes the playlist and then saves it.
        shuffle: function () {
            var i, j, t;
            for (i = 1; i < playlist.songs.length; i++) {
                j = Math.floor(Math.random() * (1 + i));  // choose j in [0..i]
                if (j !== i) {
                    t = playlist.songs[i];                        // swap songs[i] and songs[j]
                    playlist.songs[i] = playlist.songs[j];
                    playlist.songs[j] = t;
                }
            }

            save();
        }
    };
}

