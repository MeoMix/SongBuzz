//TODO: These variables need to persist because they maintain state when GUI isn't open, but this does not seem like the right place for them to be.
var _player = null;
var _currentSong = null;
var _port = null;
var _ready = false;
var _exploreEnabled = false;
var _playlist = null;

//Handles communications between the GUI and the YT Player API.
function player() {
    //errorMessage is optional, used to display errors to GUI.
    var _sendUpdate = function (errorMessage) {
        var playerState = _player.getPlayerState();
        _port.postMessage({playerState: playerState, songs: _playlist.getSongs(), currentSong: _currentSong, errorMessage: errorMessage });
    };

    //Open a port between background and foreground. Connection closes every time foreground closes.
    if (!_port) {
        _port = chrome.extension.connect({ name: "statusPoller" });
        _port.onDisconnect.addListener(function () { _port = null; });
    }

    if (_player) {
        //GUI has been re-opened and player is already initialized -- send an update to the GUI.
        _sendUpdate();
    }
    else {
        _playlist = playlist();

        //Create YT player iframe.
        YT_ready(function () {
            var frameID = getFrameID("MusicHolder");
            if (frameID) {
                _player = new YT.Player(frameID, {
                    events: {
                        "onReady": function () {
                            //player functionality not available until ready   
                            _ready = true;

                            //If there is a song to cue might as well have it ready to go.
                            if (_playlist.songCount() > 0)
                                player.cueSongById(_playlist.getSongs()[0].id);
                        },
                        "onStateChange": function (playerState) {
                            //If the UI is closed we can't post a message to it -- so need to handle next song in background.
                            //The player can be playing in the background and UI changes may try and be posted to the UI, need to prevent.
                            if (playerState.data == PlayerStates.ENDED) {
                                if (_playlist.songCount() > 1)
                                    player.loadSongById(player.getNextSong().id);
                            }
                            else if (_port) {
                                _sendUpdate();
                            }
                        },
                        "onError": function (error) {
                            switch (error.data) {
                                case 2:
                                    _sendUpdate("Request contains an invalid parameter. For example, this error occurs if you specify a video ID that does not have 11 characters, or if the video ID contains invalid characters, such as exclamation points or asterisks.");
                                    break;
                                case 100:
                                    _sendUpdate("Video requested is not found. This occurs when a video has been removed (for any reason), or it has been marked as private.");
                                    break;
                                case 101:
                                case 150:
                                    _sendUpdate("Video requested does not allow playback in the embedded players");
                                    break;
                                default:
                                    _sendUpdate("I received an error and I don't know what happened!");
                                    break;
                            }
                        }
                    }
                });
            }
        });
    }

    var player = {
        getSongs: function () {
            return _playlist.getSongs();
        },

        getCurrentSong: function () {
            return _currentSong;
        },

        getSongById: function(id){
            return _playlist.getSongById(id);
        },

        setCurrentSongById: function (id) {
            _currentSong = _playlist.getSongById(id);
        },

        setExploreEnabled: function (enable) {
            _exploreEnabled = enable;
        },

        getExploreEnabled: function () {
            return _exploreEnabled;
        },

        getNextSong: function () {
            return _playlist.getNextSong(_currentSong.id);
        },

        setVolume: function (volume) {
            volume ? _player.setVolume(volume) : _player.mute();
        },

        //Will return undefined until PlayerStates.VIDCUED
        getVolume: function () {
            return _player.getVolume();
        },

        sync: function (songIds) {
            _playlist.sync(songIds);
        },
        //TODO: Simplify
        removeSongById: function (id) {
            var song = _playlist.getSongById(id);
            var nextSong = this.getNextSong();

            _playlist.removeSongById(id);

            //Deleting the visually-selected song.
            if (_currentSong.id == song.id) {
                //No songs left to delete because getNextSong looped around.
                if (nextSong.id == _currentSong.id) {
                    //**WARNING**: Do not use clearVideo(); here. Doing so will fire VIDCUED events.
                    _currentSong = null;

                    //Send a message either via pauseVideo or a custom message -- no event sent if video isn't playing.
                    if (_player.getPlayerState() == PlayerStates.PLAYING)
                        _player.pauseVideo();
                    else
                        _sendUpdate();
                }
                else
                    this.cueSongById(nextSong.id);
            }
            else {
                //If state of player hasn't changed (due to stopping or cueing) send a message to inform of song removal.
                _sendUpdate();
            }
        },
        //Adds a song to the playlist. If it is the first song in the playlist, that song is loaded as the current song.
        addSongById: function (id) {
            var self = this;
            _playlist.addSongById(id, function (song) {
                var songCount = _playlist.songCount();
                if (songCount == 1)
                    self.cueSongById(song.id);

                _sendUpdate();
            });
        },
        //Returns the elapsed time of the currently loaded song. Returns 0 if no song is playing.
        //Returns the total time of the song if the song has ended to prevent having the GUI be 1 second off sometimes after the song ends.
        getCurrentTime: function () {
            var currentTime = null;
            var timeInSeconds = 0;

            if (_ready && _currentSong) {
                if (_player.getPlayerState() == PlayerStates.ENDED)
                    currentTime = _currentSong.totalTime;
                else {
                    timeInSeconds = _player.getCurrentTime() || 0;
                    currentTime = timeInSeconds;
                }
            }
            return currentTime;
        },
        //Gets the total time of the currently loaded song. Returns 0 if there is no song loaded.
        getTotalTime: function () {
            var totalTime = 0;
            if (_currentSong) {
                totalTime = _currentSong.totalTime;
            }

            return totalTime;
        },

        play: function () {
            if (_player.getPlayerState() != PlayerStates.PLAYING)
                _player.playVideo();
        },

        pause: function () {
            _player.pauseVideo();
        },

        loadSongById: function (id) {
            _currentSong = _playlist.getSongById(id);
            _player.loadVideoById(_currentSong.songId);
        },

        cueSongById: function (id) {
            _currentSong = _playlist.getSongById(id);
            _player.cueVideoById(_currentSong.songId);
        },
        //Shuffles the playlist but doesn't affect current state.
        shuffle: function () {
            _playlist.shuffle();
            _sendUpdate();
        },
        //Skips to the next song. Will start playing the song if the player was already playing.
        skipSong: function () {
            var nextSong = this.getNextSong();
            if (_player.getPlayerState() == PlayerStates.PLAYING)
                this.loadSongById(nextSong.id)
            else
                this.cueSongById(nextSong.id);
        }
    }

    return player;
}

