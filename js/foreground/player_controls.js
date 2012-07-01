//The buttons, sliders, etc. which serve as the middle-men between user interactions and player responses.
//Created as a child of uielements.
function playerControls() {
    //Private methods.
    var _buildToggleMusicButton = function (selector) {
        var element = $(selector);

        //Change the music button to the 'Play' image and cause a song to play upon click.
        element.setToPlay = function () {
            this.attr('title', 'Play').off('click').on('click', function () { return Player.play(); });
            $('#pauseIcon').hide();
            $('#playIcon').show();
        }

        //Change the music button to the 'Pause' image and cause a song to pause upon click.
        element.setToPause = function () {
            this.attr('title', 'Pause').off('click').on('click', function () { return Player.pause(); });
            $('#pauseIcon').show();
            $('#playIcon').hide();
        }

        //Enable the button such that it can be clicked.
        //TODO: Remove dependency on checking for class.
        element.enable = function () {
            if (this.hasClass('disabled')) {
                this.removeClass('disabled');
                $('#playPath').css('fill', 'black');
                $('#pauseBarPath1').css('fill', 'black');
                $('#pauseBarPath2').css('fill', 'black');
            }
        }

        //Disable the button such that it cannot be clicked.
        //TODO: Remove dependency on checking for class.
        //NOTE: Pause button is never able to be shown disabled.
        element.disable = function () {
            if (!this.hasClass('disabled')) {
                this.setToPlay();
                this.addClass('disabled').off('click');
                $('#playPath').css('fill', 'gray');
                $('#pauseBarPath1').css('fill', 'gray');
                $('#pauseBarPath2').css('fill', 'gray');
            }
        }

        return element;
    }

    var _buildSkipButton = function (selector) {
        var element = $(selector);

        //TODO: Remove dependency on checking for class.
        element.enable = function () {
            if (this.hasClass('disabled')) {
               $('#skipPath').css('fill', 'black');
                this.attr('src', "images/skip.png").removeClass('disabled').off('click').one('click', SkipSong);
                var self = this;
                function SkipSong() {
                    Player.skipSong();

                    //Prevent spamming by only allowing a next click once a second.
                    setTimeout(function () { self.off('click').one('click', SkipSong) }, 1000);
                };
            }
        };

        //TODO: Remove dependency on checking for class.
        element.disable = function () {
            if (!this.hasClass('disabled')) {
                this.attr('src', "images/skip-disabled.png").addClass('disabled').off('click');
                $('#skipPath').css('fill', 'gray');
            }
        };

        return element;
    }

    var _buildShuffleButton = function (selector) {
        var element = $(selector);

        //TODO: Remove dependency on checking for class.
        element.disable = function () {
            $('#shufflePath').css('fill', 'gray');
            this.attr('src', "images/shuffle-disabled.png").addClass('disabled').off('click');
        };

        //TODO: Remove dependency on checking for class.
        element.enable = function () {
            this.attr('src', "images/shuffle.png").removeClass('disabled').off('click').one('click', ShuffleSong);
            $('#shufflePath').css('fill', 'white');
            var self = this;
            function ShuffleSong() {
                //This will trigger an update. Necessary since no state change.
                Player.shuffle();
                //Prevent spamming by only allowing a shuffle click once a second.
                setTimeout(function () { self.off('click').one('click', ShuffleSong) }, 1000);
            };
        };

        return element;
    }

    var _buildMuteButton = function (selector) {
        var element = $(selector);

        //Toggles the muted icon.
        element.on('click', function () {
            var isMuted = _volumeSlider.toggleMute();
            var title = isMuted ? 'Unmute' : 'Mute';
            $(this).attr('title', title);
        }).hover( function(){
            //Fade the slider in and out similiar to YouTube's implementation.
            $('#VolumeSliderWrapper').fadeIn('fast');
        }, function(){
            $('#VolumeSliderWrapper').fadeOut('fast');
        })

        //Change the volume icon to reflect a changing volume.
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
    }

    //A specific slider element which is responsible for controlling the volume indicator of the UI.
    //TODO: Fix rapid hovering in and out causing flickering.
    var _buildVolumeSlider = function (selector) {
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

    //Private Fields
    var _volumeSlider = _buildVolumeSlider('#VolumeSlider');
    var _muteButton = _buildMuteButton('#MuteButton');
    var _toggleMusicButton = _buildToggleMusicButton('#ToggleMusicButton');
    var _skipButton = _buildSkipButton('#SkipButton');
    var _shuffleButton = _buildShuffleButton('#ShuffleButton');

    //Object exposes public methods.
    var playerControls = {
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
        }
    }

    return playerControls;
}