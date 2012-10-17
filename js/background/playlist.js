define(['yt_helper'], function(ytHelper){
    //Maintains a list of song objects as an array and exposes methods to affect those objects to Player.
    return function(id, name) {
        "use strict";
        var playlist = {
            id: id ? id : Helpers.generateGuid(),
            title: name ? name : "New Playlist",
            selected: false,
            shuffledSongs: [],
            songHistory: [],
            relatedVideos: [],
            songs: []
        };

        var save = function () {
            localStorage.setItem(playlist.id, JSON.stringify(playlist));
        };

        var loadPlaylist = function(){
            //Methods are unable to be serized to localStorage.
            var playlistJson = localStorage.getItem(playlist.id)
            
            var backupPlaylist = playlist;
            try {
                if (playlistJson){
                    playlist = JSON.parse(playlistJson);
                }
            }
            catch(exception){
                console.error(exception);
                playlist = backupPlaylist;
            }
        }();

        var syncRelatedVideos = function(){
            ytHelper.getRelatedVideos(playlist.songs, function(relatedVideos){
                console.log("I've set playlists related videos to:", relatedVideos);
                playlist.relatedVideos = relatedVideos;
                save();
            });
        };

        //Make sure a playlist and its songs always have the current versions properties.
        //If a user has an old version of a playlist stored in localStorage -- things could go awry.
        var legacySupport = function(){
            if(!playlist.shuffledSongs) playlist.shuffledSongs = [];
            if(!playlist.songHistory) playlist.songHistory = [];
            if(!playlist.songs) playlist.songs = [];

            if(playlist.relatedVideos == null || playlist.relatedVideos.length == 0){
                syncRelatedVideos();
            }

            //Changed to match YouTube properties more closely.
            $.each(playlist.songs, function(){
                if(this.name){
                    this.title = this.name;
                    delete this.name;
                }

                if(this.totalTime){
                    this.duration = this.totalTime;
                    delete this.totalTime;
                }
            });
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
            get id(){
                return playlist.id;
            },
            get title(){
                return playlist.title;
            },
            set title(value){
                playlist.title = value;
                save();
            },
            get isSelected(){
                return playlist.selected;
            },
            set isSelected(value){
                playlist.selected = value;
                save();
            },
            get songCount() {
                return playlist.songs.length;
            },
            get songs() {
                return playlist.songs;
            },
            loadData: function(data){
                playlist = data;
                save();
            },
            syncShuffledSongs: function(id){
                var index = getSongIndexById(playlist.shuffledSongs, id);

                if (index !== -1) {
                    playlist.shuffledSongs.splice(index, 1);
                }

                if(playlist.shuffledSongs.length == 0){
                    loadShuffledSongs();
                }
            },
            clear: function(){
                playlist.songs = [];
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
            addSongToHistory: function(song){
                playlist.songHistory.unshift(song);
            },
            getRelatedVideo: function(){
                 return playlist.relatedVideos[Math.floor(Math.random()*playlist.relatedVideos.length)];
            },
            //Takes a song and returns the next song object by index.
            getNextSong: function () {
                var nextSong = null;

                var isShuffleEnabled = JSON.parse(localStorage.getItem('isShuffleEnabled')) || false;

                if(isShuffleEnabled === true){
                    nextSong = playlist.shuffledSongs[0];
                }
                else{
                    var currentSong = playlist.songHistory[0];

                    if(currentSong){
                        var currentSongIndex = getSongIndexById(playlist.songs, currentSong.id);
                        var nextSongIndex = currentSongIndex + 1;

                        //Loop back to the front if at end. Should make this togglable in the future.
                        if (playlist.songs.length <= nextSongIndex){
                            nextSongIndex = 0;
                            nextSong = playlist.songs[nextSongIndex];
                        }
                        else{
                            nextSong = playlist.songs[nextSongIndex];
                        }
                    }

                }                

                return nextSong;
            },
            getPreviousSong: function () {
                //Move the currently playing song out of songHistory and into the front of shuffledSongs so that if
                //a user clicks 'next' or plays forward the song that was ahead will still be ahead instead of random song.
                var currentSong = playlist.songHistory.shift();
                playlist.shuffledSongs.unshift(currentSong);

                //Get the previous song by history if possible.
                var previousSong = playlist.songHistory.shift();
                //If no previous song was found in the history, then just go back one song by index.
                if(!previousSong){
                    var previousSongIndex = getSongIndexById(playlist.songs, currentSong.id) - 1;

                    // Goes to the end of the current playlist.
                    if (previousSongIndex < 0){
                        previousSongIndex = playlist.songs.length - 1;
                    }

                    previousSong = playlist.songs[previousSongIndex];
                }

                return previousSong;
            },
            addSongs: function(songs){
                $.each(songs, function(){
                    playlist.songs.push(this);
                    playlist.shuffledSongs.push(this);
                })

                shuffle(playlist.shuffledSongs);
                syncRelatedVideos();
                save();
            },
            addSong: function(song){ 
                playlist.songs.push(song);
                playlist.shuffledSongs.push(song);
                shuffle(playlist.shuffledSongs);
                syncRelatedVideos();
                save();
            },
            addSongByVideoId: function (videoId, callback) {
                var self = this;
                ytHelper.getVideoInformation(videoId, function(videoInformation){
                    var song = SongBuilder.buildSong(videoInformation);
                    self.addSong(song);
                    callback(song);
                })
            },
            removeSongById: function (id) {
                var index = getSongIndexById(playlist.songs, id);
                syncRelatedVideos();
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
});