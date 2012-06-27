//The buttons, sliders, etc. which serve as the middle-men between user interactions and player responses.
//Created as a child of uielements.

function playerControls() {
    //Private Fields
    var _wrapper = $('#Controls').on('mouseleave', function () { _volumeSlider.fadeOut('fast'); }).end();
    var _volumeSlider = null;
    var _muteButton = null;
    var _toggleMusicButton = null;
    var _skipButton = null;
    var _shuffleButton = null;

    var playerControls = {
        _initialize: function () {
            _toggleMusicButton = this._buildToggleMusicButton('#ToggleMusicButton');
            _skipButton = this._buildSkipButton('#SkipButton');
            _shuffleButton = this._buildShuffleButton('#ShuffleButton');

            _muteButton = this._buildMuteButton('#ToggleMuteButton');
            _volumeSlider = this._buildVolumeSlider('#VolumeSlider');
        },

        setVolume: function (volume) {
            _volumeSlider.slider('value', volume);
        },

        setEnableShuffleButton: function (enable) {
            enable ? _shuffleButton.enable() : _shuffleButton.disable();
        },

        setToggleMusicToPlay: function () {
            _toggleMusicButton.setToPlay();
        },

        setToggleMusicToPause: function () {
            _toggleMusicButton.setToPause();
        },

        setEnableToggleMusicButton: function (enable) {
            enable ? _toggleMusicButton.enable() : _toggleMusicButton.disable();
        },

        setEnableSkipButton: function (enable) {
            enable ? _skipButton.enable() : _skipButton.disable();
        },

        _buildToggleMusicButton: function (selector) {
            var element = $(selector);

            element.setToPlay = function () {
                this.attr('src', 'images/play.png').attr('title', 'Play').off('click').on('click', function () { return Player.play(); });
            }

            element.setToPause = function () {
                this.attr('src', 'images/pause.png').attr('title', 'Pause').off('click').on('click', function () { return Player.pause(); });
            }

            element.enable = function () {
                if (this.hasClass('disabled')) {
                    var enabledSrcImage = this.attr('src').replace('-disabled', '');
                    this.attr('src', enabledSrcImage).removeClass('disabled');
                }
            }

            element.disable = function () {
                if (!this.hasClass('disabled')) {
                    this.setToPlay();
                    var disabledSrcImage = this.attr('src').replace('.png', '-disabled.png');
                    this.attr('src', disabledSrcImage).addClass('disabled').off('click');
                }
            }

            return element;
        },

        _buildSkipButton: function (selector) {
            var element = $(selector);

            element.disable = function () {
                if (!this.hasClass('disabled')) {
                    this.attr('src', "images/skip-disabled.png").addClass('disabled').off('click');
                }
            };

            element.enable = function () {
                if (this.hasClass('disabled')) {
                    this.attr('src', "images/skip.png").removeClass('disabled').off('click').one('click', SkipSong);
                    var self = this;
                    function SkipSong() {
                        Player.skipSong();

                        //Prevent spamming by only allowing a next click once a second.
                        setTimeout(function () { self.off('click').one('click', SkipSong) }, 1000);
                    };
                }
            };

            return element;
        },

        _buildShuffleButton: function (selector) {
            var element = $(selector);

            element.disable = function () {
                this.attr('src', "images/shuffle-disabled.png").addClass('disabled').off('click');
            };

            element.enable = function () {
                this.attr('src', "images/shuffle.png").removeClass('disabled').off('click').one('click', ShuffleSong);

                var self = this;
                function ShuffleSong() {
                    //This will trigger an update.
                    Player.shuffle();
                    //Prevent spamming by only allowing a shuffle click once a second.
                    setTimeout(function () { self.off('click').one('click', ShuffleSong) }, 1000);
                };
            };

            return element;
        },

        _buildMuteButton: function (selector) {
            var element = $(selector);

            element.on('click', function () {
                var isMuted = _volumeSlider.toggleMute();
                var title = isMuted ? 'Unmute' : 'Mute';
                $(this).attr('title', title);
            }).on('mouseenter', function () {
                _volumeSlider.fadeIn('fast');
            });

            element.updateWithVolume = function (volume) {
                if (volume > 50)
                    this.prop('src', 'images/speaker-volume.png');
                else if (volume > 25)
                    this.prop('src', 'images/speaker-volume-low.png');
                else if (volume > 0)
                    this.prop('src', 'images/speaker-volume-none.png');
                else
                    this.prop('src', 'images/speaker-volume-control-mute.png');
            }

            return element;
        },

        //A specific slider element which is responsible for controlling the volume indicator of the UI.
        //TODO: Fix rapid hovering in and out causing flickering.
        _buildVolumeSlider: function (selector) {
            var MUSICMUTED_LOCALSTORAGEKEY = 'musicMuted';
            var MUSICVOLUME_LOCALSTORAGEKEY = 'musicVolume';

            //When foreground is closed the music's volume is forgotten, but the player may continue to play.
            //Upon re-opening we need the last known values.
            //TODO: An unhandled scenario is when a user interacts with the YouTube player outside of SongBuzz, toggles mute, and then reopens SongBuzz -- incorrect values will display.
            var _musicVolume = JSON.parse(localStorage.getItem(MUSICVOLUME_LOCALSTORAGEKEY)) || 100;
            var _isMuted = JSON.parse(localStorage.getItem(MUSICMUTED_LOCALSTORAGEKEY)) || false;

            var _onVolumeChanged = function (event, volume) {
                _isMuted = volume == 0;
                localStorage.setItem(MUSICMUTED_LOCALSTORAGEKEY, JSON.stringify(_isMuted));
                if (volume != 0) {
                    //Remember old music value if muting so that unmute is possible.
                    _musicVolume = volume;
                    localStorage.setItem(MUSICVOLUME_LOCALSTORAGEKEY, JSON.stringify(_musicVolume));
                }

                //TODO: Loosely couple Player with VolumeSlider.
                Player.setVolume(volume);
                _muteButton.updateWithVolume(volume || 'Muted');
            }

            var volumeSlider = Slider.buildSlider(selector, _onVolumeChanged);
            //Changes the muted state of the player and returns the state after toggling.
            volumeSlider.toggleMute = function () {
                if (_isMuted)
                    this.slider('value', _musicVolume);
                else
                    this.slider('value', 0);

                //This value is the opposite of above because setting slider volume has side-effects.
                return _isMuted;
            }

            return volumeSlider;
        }
    }

    playerControls._initialize();
    return playerControls;
}