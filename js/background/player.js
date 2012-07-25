//TODO: These variables need to persist because they maintain state when GUI isn't open, but this does not seem like the right place for them to be.
var player = null;
var currentSong = null;
var ready = false;
var exploreEnabled = false;
var playlists = null;
var playlist = null;

//Handles communications between the GUI and the YT Player API.
function YoutubePlayer() {
    "use strict";

    //Open a connection between the background and foreground. The connection will become invalid every time the foreground closes.
    var port = chrome.extension.connect({ name: "statusPoller" })
    port.onDisconnect.addListener(function () { port = null; });

    //errorMessage is optional, used to display errors to GUI.
    var sendUpdate = function (errorMessage) {
        var playerState = player.getPlayerState();
        port.postMessage({playerState: playerState, songs: playlist.getSongs(), currentSong: currentSong, errorMessage: errorMessage });
    };

    var cueSongById = function(id) {
        currentSong = playlist.getSongById(id);
        player.cueVideoById(currentSong.songId);
    };
    
    if (player) {
        //GUI has been re-opened and player is already initialized -- send an update to the GUI.
        sendUpdate();
    }
    else {
        playlists = new Playlists();
        playlist = playlists.getCurrentPlaylist();

        //Create YT player iframe.
        YTPlayerApiHelper.ready(function () {
            var frameID = YTPlayerApiHelper.getFrameID("MusicHolder");
            if (frameID) {
                //https://developers.google.com/youtube/iframe_api_reference#Loading_a_Video_Player
                //After the API's JavaScript code loads, the API will call the onYouTubeIframeAPIReady function.
                //At which point you can construct a YT.Player object to insert a video player on your page. 
                player = new YT.Player(frameID, {
                    events: {
                        "onReady": function () {
                            //player functionality not available until ready   
                            ready = true;

                            //If there is a song to cue might as well have it ready to go.
                            if (playlist.songCount() > 0){
                                var defaultSongId = playlist.getSongs()[0].id;
                                cueSongById(defaultSongId);
                            }
                        },
                        "onStateChange": function (playerState) {
                            //If the UI is closed we can't post a message to it -- so need to handle next song in background.
                            //The player can be playing in the background and UI changes may try and be posted to the UI, need to prevent.
                            if (playerState.data === PlayerStates.ENDED) {
                                if (playlist.songCount() > 1){
                                    player.loadSongById(player.getNextSong().id);  
                                }
                            }
                            else if(playerState.data === PlayerStates.VIDCUED){
                                //Don't leave the player in the VIDCUED state because it does not work well with seekTo.
                                //If the vid is cued (not playing) and the user seeks to the middle of the song it will start playing.
                                //If the vid is paused (not playing) and the user seeks to the middle of the song it will not start playing.
                                player.playVideo();
                                player.pauseVideo();
                            }
                            else if (port) {
                                sendUpdate();
                            }
                        },
                        "onError": function (error) {
                            switch (error.data) {
                                case 2:
                                    sendUpdate("Request contains an invalid parameter. For example, this error occurs if you specify a video ID that does not have 11 characters, or if the video ID contains invalid characters, such as exclamation points or asterisks.");
                                    break;
                                case 100:
                                    sendUpdate("Video requested is not found. This occurs when a video has been removed (for any reason), or it has been marked as private.");
                                    break;
                                case 101:
                                case 150:
                                    sendUpdate("Video requested does not allow playback in the embedded players");
                                    break;
                                default:
                                    sendUpdate("I received an error and I don't know what happened!");
                                    break;
                            }
                        }
                    }
                });
            }
        });
    }

    return {
        getPlaylistTitle: function(){
            return playlist.title;
        },

        getPlaylists: function(){
            return playlists.getPlaylists();
        },

        selectPlaylist: function(playlistId){
            if(playlist.id !== playlistId){
                this.pause();
                playlist.deselect();
                playlist = playlists.getPlaylistById(playlistId);
                playlist.select();

                //If the newly loaded playlist has a song to play cue it to replace the currently loaded song.
                var firstSongInPlaylist = playlist.getFirstSong();

                if(firstSongInPlaylist){
                    this.cueSongById(firstSongInPlaylist.id);
                }
                else{
                    currentSong = null;
                }

                sendUpdate();
            }
        },

        addPlaylist: function(playlistName){
            playlists.addPlaylist(playlistName);
             sendUpdate();
        },

        removePlaylistById: function(playlistId){
            //Don't allow removing of active playlist.
            //TODO: Perhaps just don't allow deleting the last playlist? More difficult.

            if(playlist.id !== playlistId){
                playlists.removePlaylistById(playlistId);
                sendUpdate();
            }
        },

        getSongs: function () {
            return playlist.getSongs();
        },

        getCurrentSong: function () {
            return currentSong;
        },

        getSongById: function(id){
            return playlist.getSongById(id);
        },

        setCurrentSongById: function (id) {
            currentSong = playlist.getSongById(id);
        },

        setExploreEnabled: function (enable) {
            exploreEnabled = enable;
        },

        getExploreEnabled: function () {
            return exploreEnabled;
        },

        getNextSong: function () {
            return playlist.getNextSong(currentSong.id);
        },

        setVolume: function (volume) {
            if(volume){
                player.setVolume(volume);
            }
            else{
                player.mute();
            }
        },

        //Will return undefined until PlayerStates.VIDCUED
        getVolume: function () {
            return player.getVolume();
        },

        sync: function (songIds) {
            playlist.sync(songIds);
        },

        //The allowSeekAhead parameter determines whether the player will make a new request to the server if the seconds parameter specifies a time outside of the currently buffered video data.
        //Set to false when dragging and true when drag complete.
        seekTo: function(timeInSeconds){
            var allowSeekAhead = true;
            player.seekTo(timeInSeconds, allowSeekAhead);
        },

        //TODO: Simplify
        removeSongById: function (id) {
            var song = playlist.getSongById(id);
            var nextSong = this.getNextSong();

            playlist.removeSongById(id);

            //Deleting the visually-selected song.
            if (currentSong.id === song.id) {
                //No songs left to delete because getNextSong looped around.
                if (nextSong.id === currentSong.id) {
                    //**WARNING**: Do not use clearVideo(); here. Doing so will fire VIDCUED events.
                    currentSong = null;

                    //Send a message either via pauseVideo or a custom message -- no event sent if video isn't playing.
                    if (player.getPlayerState() === PlayerStates.PLAYING){
                        player.pauseVideo();
                    }
                    else{
                        sendUpdate();
                    }
                }
                else{
                    this.cueSongById(nextSong.id); 
                }
            }
            else {
                //If state of player hasn't changed (due to stopping or cueing) send a message to inform of song removal.
                sendUpdate();
            }
        },
        //Adds a song to the playlist. If it is the first song in the playlist, that song is loaded as the current song.
        addSongById: function (id) {
            var self = this;
            playlist.addSongById(id, function (song) {
                var songCount = playlist.songCount();
                if (songCount === 1){
                    self.cueSongById(song.id);
                }

                sendUpdate();
            });
        },
        //Returns the elapsed time of the currently loaded song. Returns 0 if no song is playing.
        //Returns the total time of the song if the song has ended to prevent having the GUI be 1 second off sometimes after the song ends.
        getCurrentTime: function () {
            var currentTime = null;
            var timeInSeconds = 0;

            if (ready && currentSong) {
                if (player.getPlayerState() === PlayerStates.ENDED){
                    currentTime = currentSong.totalTime; 
                }
                else {
                    timeInSeconds = player.getCurrentTime() || 0;
                    currentTime = timeInSeconds;
                }
            }
            return currentTime;
        },
        //Gets the total time of the currently loaded song. Returns 0 if there is no song loaded.
        getTotalTime: function () {
            var totalTime = 0;
            if (currentSong) {
                totalTime = currentSong.totalTime;
            }

            return totalTime;
        },

        play: function () {
            player.playVideo();
        },

        pause: function () {
            player.pauseVideo();
        },

        loadSongById: function (id) {
            currentSong = playlist.getSongById(id);
            player.loadVideoById(currentSong.songId);
        },

        cueSongById: function (id) {
            cueSongById(id);
        },
        //Shuffles the playlist but doesn't affect current state.
        shuffle: function () {
            playlist.shuffle();
            sendUpdate();
        },
        //Skips to the next song. Will start playing the song if the player was already playing.
        skipSong: function () {
            var nextSong = this.getNextSong();
            if (player.getPlayerState() === PlayerStates.PLAYING){
                this.loadSongById(nextSong.id);
            }
            else{
                this.cueSongById(nextSong.id);  
            }
        }
    };
}