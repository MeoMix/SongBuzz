define(['yt_helper', 'song_builder'], function(ytHelper, songBuilder){
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
            //LocalStorage has a 5MB storage limit - don't storage playlists in it!
            //localStorage.setItem(playlist.id, JSON.stringify(playlist));
            function onRequestFileSystemSuccess(fileSystem) {
                var fileName = playlist.id + '.txt';
                fileSystem.root.getFile(playlist.id + '.txt', {create: true, exclusive: false}, function(fileEntry) {
                    // Create a FileWriter object for our FileEntry (log.txt).
                    fileEntry.createWriter(function(fileWriter) {
                        fileWriter.onwriteend = function(e) {
                            console.log('Successfully saved playlist:', playlist.title);
                        };

                        fileWriter.onerror = function(e) {
                            console.error('Write failed: ' + e.toString());
                        };

                        // Create a new Blob and write it to log.txt.
                        //TODO: application/json maybe?
                        var playlistJson = JSON.stringify(playlist);
                        var blob = new Blob([playlistJson], {type: 'text/plain'});
                        fileWriter.write(blob);
                    }, function(){
                        console.error("Failed to create writer while attempting to write to file:", fileName);
                    });
                }, function(){
                    console.error("Failed to get file for write:", fileName);
                });
            };

            //Start off with 10MB. Probably drop back down to 5 and request more later.
            window.webkitRequestFileSystem(window.PERSISTENT, 1024 * 10240, onRequestFileSystemSuccess, function(){
                console.error("Failed to successfully request 10MB of filesystem storage space.");
            });
        };

        var loadPlaylist = function(){
            function onRequestFileSystemSuccess(fileSystem) {
                var fileName = playlist.id + '.txt';
                fileSystem.root.getFile(fileName, {}, function(fileEntry) {

                    // Get a File object representing the file,
                    // then use FileReader to read its contents.
                    fileEntry.file(function(file) {

                        // fileEntry.remove(function(){
                        //     console.log("File removed.");
                        // }, function(){
                        //     console.error("Failed to remove file entry:", fileName);
                        // });
                        var reader = new FileReader();

                        reader.onloadend = function(e) {
                            console.log("parsing playlist ", this.result);
                            playlist = JSON.parse(this.result);
                            console.log("playlist after parse:", playlist);

                            //THIS IS LEGACY SUPPORT. Remove at some point in the future.
                            if(!playlist || playlist.songs.length === 0){
                                console.log("using legacy support");
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
                            }
                        };

                        reader.readAsText(file);
                    }, function(){
                        console.error("Failed to open file for read:", fileName);
                    });
                }, function(){
                    console.error("Failed to get file for read:", fileName);
                });
            };
            //Start off with 10MB. Probably drop back down to 5 and request more later.
            window.webkitRequestFileSystem(window.PERSISTENT, 1024 * 10240, onRequestFileSystemSuccess, function(){
                console.error("Failed to successfully request 10MB of filesystem storage space.");
            });
        }();

        var syncRelatedVideos = function(){
            ytHelper.getRelatedVideos(playlist.songs, function(relatedVideos){
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

        var loadShuffledSongs = function(){
            $.extend(playlist.shuffledSongs, playlist.songs);
            playlist.shuffledSongs = _.shuffle(playlist.shuffledSongs);
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
                playlist.shuffledSongs = _.reject(playlist.shuffledSongs, function(s) {return s.id === id; });

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
                return _.find(playlist.songs, function(s){ return s.id === id; });
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
                _.each(songs, function(song){
                    playlist.songs.push(song);
                    playlist.shuffledSongs.push(song);
                })

                playlist.shuffledSongs = _.shuffle(playlist.shuffledSongs);
                syncRelatedVideos();
                save();
            },
            addSong: function(song){ 
                playlist.songs.push(song);
                playlist.shuffledSongs.push(song);
                playlist.shuffledSongs = _.shuffle(playlist.shuffledSongs);
                syncRelatedVideos();
                save();
            },
            addSongByVideoId: function (videoId, callback) {
                var self = this;
                ytHelper.getVideoInformation(videoId, function(videoInformation){
                    var song = songBuilder.buildSong(videoInformation);
                    self.addSong(song);
                    callback(song);
                })
            },
            removeSongById: function (id) {
                syncRelatedVideos();
                this.syncShuffledSongs(id);
                playlist.songs = _.reject(playlist.songs, function(s) {return s.id === id; });
                save();
            },
            //Naieve implementation
            //Sync is used to ensure proper song order after the user drag-and-drops a song on the playlist. 
            sync: function (ids) {
                var syncedSongs = [];

                var self = this;
                $(ids).each(function(){
                    var song = self.getSongById(this);
                    syncedSongs.push(song);
                });

                playlist.songs = syncedSongs;
                save();
            },
            //Randomizes the playlist and then saves it.
            shuffle: function(){
                playlist.songs = _.shuffle(playlist.songs);
                save();
            }
        };
    }
});