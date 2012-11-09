var YoutubePlayer = null;
define(['playlists', 'player_builder', 'yt_helper'], function(playlists, playerBuilder, ytHelper){
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
        var playlist = playlists.selectedPlaylist;    
        
        (function initialize(){
            var onReady = function(){
                //If there is a song to cue might as well have it ready to go.
                if (playlist.songCount > 0) {
                    cueSongById(playlist.songs[0].id);
                }
                refreshUI();
            };

            var onStateChange = function (playerState) {
                //If the song stopped playing and there's another song to skip to, do so.
                if (playerState.data === PlayerStates.ENDED ) {
                    //Don't pass message to UI if it is closed. Handle sock change in the background.
                    //The player can be playing in the background and UI changes may try and be posted to the UI, need to prevent.
                    var isRadioModeEnabled =  JSON.parse(localStorage.getItem('isRadioModeEnabled')) || false;
                    var nextSong = null;
                    if(isRadioModeEnabled){
                        nextSong = playlist.getRelatedVideo();
                        playlist.addSong(nextSong);
                        loadSongById(nextSong.id);  
                    }
                    else {
                        if(playlist.songCount > 1){
                            nextSong = playlist.getNextSong();
                            loadSongById(nextSong.id);  
                        }
                    }                 
                } 

                refreshUI();
            };

            var onPlayerError = function (error) {
                console.log("errored on", currentSong);

                if(currentSong !== null){
                    (function replaceUnplayableSong(){
                        var unplayableSong = currentSong;
                        ytHelper.findPlayableByVideoId(unplayableSong.videoId, function(playableSong){
                            addSongByVideoId(playableSong.videoId, function(song){
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

            //Create YT player iframe.
            playerBuilder.buildPlayer('MusicHolder', onReady, onStateChange, onPlayerError, function(builtPlayer){
                player = builtPlayer;
            });
        })();

        var refreshUI = function () {
            if(port && port.postMessage){
                port.postMessage();  
            }
        };

        var cueSongById = function(id) {
            currentSong = playlist.getSongById(id);
            player.cueVideoById(currentSong.videoId);
            playlist.addSongToHistory(currentSong);
            playlist.syncShuffledSongs(id);
        };

        var loadSongById = function(id){
            currentSong = playlist.getSongById(id);
            player.loadVideoById(currentSong.videoId);
            playlist.addSongToHistory(currentSong);
            playlist.syncShuffledSongs(id);
        };

        var addSongByVideoId = function (videoId, callback) {
            playlist.addSongByVideoId(videoId, function (song) {
                if (playlist.songCount === 1){
                    cueSongById(song.id);
                }

                refreshUI();

                if(callback){
                    callback(song);
                }
            });
        };

        var removeSongById = function (id) {
            if(currentSong && currentSong.id === id){
                //Get nextSong before removing currentSong because the position of currentSong is important.
                var nextSong = playlist.getNextSong();

                currentSong = null;
                player.pauseVideo();

                //nextSong will equal id when deleting the last song because getNextSong loops around to front of list.
                if(nextSong.id !== id){
                    cueSongById(nextSong.id);
                }
            }

            playlist.removeSongById(id);
            refreshUI();
        };

        return {
            isSeeking: false,
            wasPlayingBeforeSeek: false,
            get playlistTitle(){
                return playlist.title;
            },
            set playlistTitle(value){
                playlist.title = value;
                refreshUI();
            },
            get playlists(){
                return playlists.playlists;
            },
            get playerState(){
                return (player && player.getPlayerState) ? player.getPlayerState() : PlayerStates.UNSTARTED;
            },
            get songs() {
                return playlist.songs;
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
            get volume(){
                return (player && player.getVolume) ? player.getVolume() : 0;
            },
            set volume(value){
                if(value){
                    player.setVolume(value);
                }
                else{
                    player.mute();
                }
            },
            connect: function(){
                //Open a connection between the background and foreground. The connection will become invalid every time the foreground closes.
                port = chrome.extension.connect({ name: "statusPoller" });
                port.onDisconnect.addListener( function () {
                    port = null; 
                });
            },
            selectPlaylist: function(playlistId){
                if(playlist.id !== playlistId){
                    this.pause();
                    playlist = playlists.getPlaylistById(playlistId);
                    playlists.selectedPlaylist = playlist;

                    //If the newly loaded playlist has a song to play cue it to replace the currently loaded song.
                    if(playlist.songCount > 0){
                        cueSongById(playlist.songs[0].id);
                    }
                    else {
                        currentSong = null;
                    }

                    refreshUI();
                }
            },
            addPlaylist: function(playlistName, songs){
                playlists.addPlaylist(playlistName, songs);
                refreshUI();
            },
            removePlaylistById: function(playlistId){
                //Don't allow removing of active playlist.
                //TODO: Perhaps just don't allow deleting the last playlist? More difficult.
                if(playlist.id !== playlistId){
                    playlists.removePlaylistById(playlistId);
                    refreshUI();
                }
            },
            getSongById: function(id){
                return playlist.getSongById(id);
            },
            setCurrentSongById: function (id) {
                currentSong = playlist.getSongById(id);
            },
            sync: function (ids) {
                playlist.sync(ids);
            },
            //Called when the user clicks mousedown on the progress bar dragger.
            seekStart: function(){
                this.isSeeking = true;
                //Need to record this to decide if should be playing after seek ends. You'd think that seek would handle this, but
                //it does it incorrectly when a song hasn't been started. It will start to play a song if you seek in an unplayed song.
                this.wasPlayingBeforeSeek = player.getPlayerState() === PlayerStates.PLAYING;
                this.pause();
            },
            seekTo: function(timeInSeconds){
                //Once the user has seeked to the new value let our update function run again.
                //Wrapped in a set timeout because there is some delay before the seekTo finishes executing and I want to prevent flickering.
                var self = this;
                setTimeout(function(){
                    self.isSeeking = false;
                }, 1500);

                //allowSeekAhead determines whether the player will make a new request to the server if the time specified is outside of the currently buffered video data.
                player.seekTo(timeInSeconds, true);
                if(this.wasPlayingBeforeSeek){
                    this.play();
                }
                else{
                    this.pause();
                }
            },
            removeSongById: removeSongById,
            //Adds a song to the playlist. If it is the first song in the playlist, that song is loaded as the current song.
            addSongByVideoId: addSongByVideoId,
            play: function () {
                player.playVideo();
            },
            pause: function () {
                player.pauseVideo();
            },
            loadSongById: function(id){
                loadSongById(id);
            },
            cueSongById: function (id) {
                cueSongById(id);
            },
            //Skips to the next song. Will start playing the song if the player was already playing.
            //if where == "next" it'll skip to the next song. otherwise it will skip to the previous song.
            skipSong: function (where) {
                var nextSong = null;

                if (where == "next"){
                    var isRadioModeEnabled = JSON.parse(localStorage.getItem('isRadioModeEnabled')) || false;

                    if(isRadioModeEnabled){
                        nextSong = playlist.getRelatedVideo();
                        playlist.addSong(nextSong);
                    }
                    else{
                        nextSong = playlist.getNextSong();
                    }
                }
                else if(where == "previous"){
                    nextSong = playlist.getPreviousSong();
                }

                if (this.playerState === PlayerStates.PLAYING){
                    loadSongById(nextSong.id);
                }
                else{
                    cueSongById(nextSong.id);  
                }   
            }
        };
     })();
});