var YoutubePlayer = null;
define(['playlistManager', 'playerBuilder', 'ytHelper'], function(playlistManager, playerBuilder, ytHelper) {
    'use strict';
    //Handles communications between the GUI and the YT Player API.
    YoutubePlayer = (function() {
        //The actual youtubePlayer API object.
        var player = null;
        //Current queued or loaded song.
        var currentSong = null;
        //A communication port to the foreground. Needs to be re-established everytime foreground opens.
        var port = null;
        //The currently loaded playlist.
        var activePlaylist = playlistManager.activePlaylist;

        //Initialize the player
        (function () {
            var onReady = function() {
                //If there is a song to cue might as well have it ready to go.
                if (activePlaylist.songCount > 0) {
                    cueSongById(activePlaylist.songs[0].id);
                }
                refreshUI();
            };

            var onStateChange = function(playerState) {
                //If the song stopped playing and there's another song to skip to, do so.
                if (playerState.data === PlayerStates.ENDED) {
                    //Don't pass message to UI if it is closed. Handle sock change in the background.
                    //The player can be playing in the background and UI changes may try and be posted to the UI, need to prevent.
                    var isRadioModeEnabled = JSON.parse(localStorage.getItem('isRadioModeEnabled')) || false;
                    var nextSong;
                    if (isRadioModeEnabled) {
                        nextSong = activePlaylist.getRelatedVideo();
                        activePlaylist.addSong(nextSong);
                        loadSongById(nextSong.id);
                    } else {
                        if (activePlaylist.songCount > 1) {
                            nextSong = activePlaylist.getNextSong();
                            loadSongById(nextSong.id);
                        }
                    }
                }

                refreshUI();
            };

            var onPlayerError = function(error) {
                if (currentSong !== null) {
                    //Replace an unplayable song with a similiar, playable song.
                    //Shouldn't happen very often at all.
                    (function () {
                        var unplayableSong = currentSong;
                        ytHelper.findPlayableByVideoId(unplayableSong.videoId, function(playableSong) {
                            addSongByVideoId(playableSong.videoId, function(song) {
                                loadSongById(song.id);
                                removeSongById(unplayableSong.id);
                                player.playVideo();
                            });
                        });
                    })();
                }

                switch (error.data) {
                case 100:
                    alert("Video requested is not found. This occurs when a video has been removed or it has been marked as private.");
                    break;
                case 101:
                case 150:
                    alert("Video requested does not allow playback in the embedded players. Finding replacement song.");
                    break;
                }
            };

            console.log("trying to build player");
            //Create YT player iframe.
            playerBuilder.buildPlayer('MusicHolder', onReady, onStateChange, onPlayerError, function(builtPlayer) {
                console.log("successfully built player");
                player = builtPlayer;
            });
        })();

        var refreshUI = function() {
            if (port && port.postMessage) {
                port.postMessage();
            }
        };

        var cueSongById = function(id) {
            currentSong = activePlaylist.getSongById(id);
            player.cueVideoById(currentSong.videoId);
            activePlaylist.addSongToHistory(currentSong);
            activePlaylist.syncShuffledSongs(id);
        };

        var loadSongById = function(id) {
            currentSong = activePlaylist.getSongById(id);
            player.loadVideoById(currentSong.videoId);
            activePlaylist.addSongToHistory(currentSong);
            activePlaylist.syncShuffledSongs(id);
        };

        var addSongByVideoId = function(videoId, callback) {
            activePlaylist.addSongByVideoId(videoId, function(song) {
                if (activePlaylist.songCount === 1) {
                    cueSongById(song.id);
                }

                refreshUI();

                if (callback) {
                    callback(song);
                }
            });
        };

        var removeSongById = function(id) {
            if (currentSong && currentSong.id === id) {
                //Get nextSong before removing currentSong because the position of currentSong is important.
                var nextSong = activePlaylist.getNextSong();

                currentSong = null;
                player.pauseVideo();

                //nextSong will equal id when deleting the last song because getNextSong loops around to front of list.
                if (nextSong.id !== id) {
                    cueSongById(nextSong.id);
                }
            }

            activePlaylist.removeSongById(id);
            refreshUI();
        };

        return {
            isSeeking: false,
            wasPlayingBeforeSeek: false,
            get playlistTitle() {
                return activePlaylist.title;
            },
            set playlistTitle(value) {
                activePlaylist.title = value;
                refreshUI();
            },
            get playlists() {
                return playlistManager.playlists;
            },
            get playerState() {
                return (player && player.getPlayerState) ? player.getPlayerState() : PlayerStates.UNSTARTED;
            },
            get songs() {
                return activePlaylist.songs;
            },
            get currentSong() {
                return currentSong;
            },
            //Returns the elapsed time of the currently loaded song. Returns 0 if no song is playing.
            get currentTime() {
                return (player && player.getCurrentTime) ? player.getCurrentTime() : 0;
            },
            //Gets the total time of the currently loaded song. Returns 0 if there is no song loaded.
            get totalTime() {
                return currentSong ? currentSong.duration : 0;
            },
            //Return undefined until player has state VIDCUED
            get volume() {
                return (player && player.getVolume) ? player.getVolume() : 0;
            },
            set volume(value) {
                if (value) {
                    player.setVolume(value);
                } else {
                    player.mute();
                }
            },
            connect: function() {
                //Open a connection between the background and foreground. The connection will become invalid every time the foreground closes.
                port = chrome.extension.connect({ name: "statusPoller" });
                port.onDisconnect.addListener(function() {
                    port = null;
                });
            },
            selectPlaylist: function(playlistId) {
                if (activePlaylist.id !== playlistId) {
                    this.pause();
                    activePlaylist = playlistManager.getPlaylistById(playlistId);
                    playlistManager.activePlaylist = activePlaylist;

                    //If the newly loaded playlist has a song to play cue it to replace the currently loaded song.
                    if (activePlaylist.songCount > 0) {
                        cueSongById(activePlaylist.songs[0].id);
                    } else {
                        currentSong = null;
                    }

                    refreshUI();
                }
            },
            addPlaylist: function(playlistName, songs) {
                playlistManager.addPlaylist(playlistName, songs);
                refreshUI();
            },
            removePlaylistById: function(playlistId) {
                //Don't allow removing of active playlist.
                //TODO: Perhaps just don't allow deleting the last playlist? More difficult.
                if (activePlaylist.id !== playlistId) {
                    playlistManager.removePlaylistById(playlistId);
                    refreshUI();
                }
            },
            addSongToPlaylist: function(videoId, playlistId){
                var playlist = playlistManager.getPlaylistById(playlistId);
                playlist.addSongByVideoId(videoId);
            },
            getSongById: function(id) {
                return activePlaylist.getSongById(id);
            },
            setCurrentSongById: function(id) {
                currentSong = activePlaylist.getSongById(id);
            },
            sync: function(ids) {
                activePlaylist.sync(ids);
            },
            //Called when the user clicks mousedown on the progress bar dragger.
            seekStart: function() {
                this.isSeeking = true;
                //Need to record this to decide if should be playing after seek ends. You'd think that seek would handle this, but
                //it does it incorrectly when a song hasn't been started. It will start to play a song if you seek in an unplayed song.
                this.wasPlayingBeforeSeek = player.getPlayerState() === PlayerStates.PLAYING;
                this.pause();
            },
            seekTo: function(timeInSeconds) {
                //Once the user has seeked to the new value let our update function run again.
                //Wrapped in a set timeout because there is some delay before the seekTo finishes executing and I want to prevent flickering.
                var self = this;
                setTimeout(function() {
                    self.isSeeking = false;
                }, 1500);

                //allowSeekAhead determines whether the player will make a new request to the server if the time specified is outside of the currently buffered video data.
                player.seekTo(timeInSeconds, true);
                if (this.wasPlayingBeforeSeek) {
                    this.play();
                } else {
                    this.pause();
                }
            },
            removeSongById: removeSongById,
            //Adds a song to the activePlaylist. If it is the first song in the activePlaylist, that song is loaded as the current song.
            addSongByVideoId: addSongByVideoId,
            play: function() {
                player.playVideo();
            },
            pause: function() {
                player.pauseVideo();
            },
            toggleSong: function(){
                if(player.getPlayerState() === PlayerStates.PLAYING){
                    this.pause();
                }
                else{
                    this.play();
                }
            },
            loadSongById: function(id) {
                loadSongById(id);
            },
            cueSongById: function(id) {
                cueSongById(id);
            },
            //Skips to the next song. Will start playing the song if the player was already playing.
            //if where == "next" it'll skip to the next song. otherwise it will skip to the previous song.
            skipSong: function(where) {
                var nextSong = null;

                if (where == "next") {
                    var isRadioModeEnabled = JSON.parse(localStorage.getItem('isRadioModeEnabled')) || false;

                    if (isRadioModeEnabled) {
                        nextSong = activePlaylist.getRelatedVideo();
                        activePlaylist.addSong(nextSong);
                    } else {
                        nextSong = activePlaylist.getNextSong();
                    }
                } else if (where == "previous") {
                    nextSong = activePlaylist.getPreviousSong();
                }

                if (this.playerState === PlayerStates.PLAYING) {
                    loadSongById(nextSong.id);
                } else {
                    cueSongById(nextSong.id);
                }
            }
        };
    })();
});