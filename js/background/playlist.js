//Maintains a list of song objects as an array and exposes methods to affect those objects to Player.
//TODO: Introduce a new object call Songs which will hold Song objects.
function Playlist(id, name) {
    "use strict";
    //If no playlistid or name provided assume default playlist and create default song list.
    var isDefaultPlaylist = !(id && name);
    var playlist = {
        id: id ? id : Helpers.generateGuid(),
        title: name ? name : "New Playlist",
        selected: true,
        shuffledSongs: [],
        songHistory: [],
        songs: !isDefaultPlaylist ? [] : [{ 
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
        var key = playlist.id.toString();

        var keyValuePair = {};
        keyValuePair[playlist.id] = JSON.stringify(playlist)

        chrome.storage.sync.set(keyValuePair);
    };

    var loadPlaylist = function(){
        //Methods are unable to be serialized.
        chrome.storage.sync.get(playlist.id, function(result){
            var backupPlaylist = playlist;

            try{
                if(result[playlist.id]){
                    playlist = JSON.parse(result[playlist.id]);
                } 
            }
            catch(exception){
                console.error(exception);
                playlist = backupPlaylist;
            }

            legacySupport();
        });

        var legacySupport = function(){
            if(!playlist.shuffledSongs) playlist.shuffledSongs = [];
            if(!playlist.songHistory) playlist.songHistory = [];
            if(!playlist.songs) playlist.songs = [];
        };
    }();

    var shuffle = function (songs) {
        var i, j, t;
        for (i = 1; i < songs.length; i++) {
            j = Math.floor(Math.random() * (1 + i));  // choose j in [0..i]
            if (j !== i) {
                t = songs[i];                        // swap songs[i] and songs[j]
                songs[i] = songs[j];
                songs[j] = t;
            }
        }
    }

    var loadShuffledSongs = function(){
        $.extend(playlist.shuffledSongs, playlist.songs);
        shuffle(playlist.shuffledSongs);
    }

    //Takes a song's UID and returns the index of that song in the playlist if found.
    var getSongIndexById = function (songs, id) {
        var songIndex = -1;
        for (var i = 0; i < songs.length; i++) {
            if (songs[i] && songs[i].id === id) {
                songIndex = i;
                break;
            }
        }
        
        return songIndex;
    };

    return {
        syncShuffledSongs: function(id){
            var index = getSongIndexById(playlist.shuffledSongs, id);

            if (index !== -1) {
                playlist.shuffledSongs.splice(index, 1);
                console.log("removed song from shuffledSongs", playlist.shuffledSongs);
            }

            if(playlist.shuffledSongs.length == 0){
                loadShuffledSongs();
            }
        },
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
            console.log("selected:", playlist.selected);
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
        addSongToHistory: function(song){
            console.log("Add song to history");
            playlist.songHistory.unshift(song);
        },
        //Takes a song and returns the next song object by index.
        getNextSong: function (currentId) {
            console.log("currentId:", currentId);

            var currentSongIndex = getSongIndexById(playlist.songs, currentId);
            var nextSongIndex = currentSongIndex + 1;

            //Loop back to the front if at end. Should make this togglable in the future.
            if (playlist.songs.length <= nextSongIndex){
                // var pandoraModeActivated = true;
                nextSongIndex = 0;        
            }

            return playlist.songs[nextSongIndex];
        },
        getRandomSong: function(){
            console.log("returning random song from", playlist.shuffledSongs, playlist.shuffledSongs[0]);
            return playlist.shuffledSongs[0];
        },
        getPreviousSong: function (currentId) {
            var currentSong = playlist.songHistory.shift();
            console.log("Current song should not be null", currentSong);
            playlist.shuffledSongs.unshift(currentSong);

            var previousSong = playlist.songHistory.shift();
            console.log("Did previous song exist?", previousSong);
            if(!previousSong){
                var previousSongIndex = getSongIndexById(playlist.songs, currentId) - 1;

                   // Goes to the end of the current playlist.
                if (previousSongIndex < 0){
                    previousSongIndex = playlist.songs.length - 1;
                }

                previousSong = playlist.songs[previousSongIndex];
            }

            return previousSong;
        },
        songCount: function () {
            return playlist.songs.length;
        },
        getSongs: function () {
            return playlist.songs;
        },
        addSongByVideoId: function (videoId, callback) {
            YTHelper.getVideoInformation(videoId, function(videoInformation){
                var song = new Song(videoInformation);
                playlist.songs.push(song);

                console.log("Pushing song onto shuffledSongs", song);
                playlist.shuffledSongs.push(song);
                shuffle(playlist.shuffledSongs);
                save();
                callback(song);
            })
        },
        removeSongById: function (id) {
            var index = getSongIndexById(playlist.songs, id);

            this.syncShuffledSongs(id);

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
        shuffle: function(){
            shuffle(playlist.songs)
            save();
        }
    };
}

