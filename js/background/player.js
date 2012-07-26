//TODO: These variables need to persist because they maintain state when UI isn't open, but this does not seem like the right place for them.
var player = null;
var currentSong = null;
var port = null;
var playlists = null;
var playlist = null;

//Handles communications between the GUI and the YT Player API.
function YoutubePlayer() {
    "use strict";                            
    //Open a connection between the background and foreground. The connection will become invalid every time the foreground closes.
    port = chrome.extension.connect({ name: "statusPoller" });
    port.onDisconnect.addListener(function () { port = null; });
    
    if (!player) {
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
                            //If there is a song to cue might as well have it ready to go.
                            if (playlist.songCount() > 0){
                                cueSongById(playlist.getSongs()[0].id);
                            }
                        },
                        "onStateChange": function (playerState) {
                            //Don't pass message to UI if it is closed. Handle sock change in the background.
                            //The player can be playing in the background and UI changes may try and be posted to the UI, need to prevent.
                            if (playerState.data === PlayerStates.ENDED && playlist.songCount() > 1) {
                                var nextSong = playlist.getNextSong(currentSong.id);
                                player.loadSongById(nextSong.id);  
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
                            }
                        }
                    }
                });
            }
        });
    }

    //errorMessage is optional, used to pass error messages to the UI.
    var sendUpdate = function (errorMessage) {
        port.postMessage({
            playerState: player.getPlayerState(),
            songs: playlist.getSongs(),
            currentSong: currentSong,
            errorMessage: errorMessage
        });
    };

    var cueSongById = function(id) {
        currentSong = playlist.getSongById(id);
        player.cueVideoById(currentSong.videoId);
    };

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
                    cueSongById(firstSongInPlaylist.id);
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
        getPlayerState: function(){
            var playerState = PlayerStates.UNSTARTED;
            //When the UI first loads it may request the player state before the API is ready to give it up.
            if(player.getPlayerState)
                playerState = player.getPlayerState();
            return playerState;
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
        getNextSong: function () {
            var nextSong = null;
            if(currentSong)
                nextSong = playlist.getNextSong(currentSong.id);

            return nextSong;
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
        sync: function (ids) {
            playlist.sync(ids);
        },
        //The allowSeekAhead parameter determines whether the player will make a new request to the server if the seconds parameter specifies a time outside of the currently buffered video data.
        //Set to false when dragging and true when drag complete.
        seekTo: function(timeInSeconds){
            //YouTube's seekTo method will cause the video to play if it is left in the VIDCUED state.
            if(player.getPlayerState() === PlayerStates.VIDCUED){
                player.pause();
            }

            var allowSeekAhead = true;
            player.seekTo(timeInSeconds, allowSeekAhead);
        },
        removeSongById: function (id) {
            if(id === currentSong.id){
                currentSong = null;
                player.pauseVideo();
            }

            playlist.removeSongById(id);

            var nextSong = this.getNextSong();
            if(nextSong){
                cueSongById(nextSong.id);
            }

            sendUpdate();
        },
        //Adds a song to the playlist. If it is the first song in the playlist, that song is loaded as the current song.
        addSongById: function (id) {
            playlist.addSongById(id, function (song) {
                if (playlist.songCount() === 1){
                    cueSongById(song.id);
                }

                sendUpdate();
            });
        },
        //Returns the elapsed time of the currently loaded song. Returns 0 if no song is playing.
        //Returns the total time of the song if the song has ended to prevent having the GUI be 1 second off sometimes after the song ends.
        getCurrentTime: function () {
            var currentTime = null;
            var timeInSeconds = 0;

            if (currentSong) {
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
            player.loadVideoById(currentSong.videoId);
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
                cueSongById(nextSong.id);  
            }
        }
    };
}