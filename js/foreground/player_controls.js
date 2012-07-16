//The buttons, sliders, etc. which serve as the middle-men between user interactions and player responses.
function playerControls() {
    //Private methods.
    var _buildToggleMusicButton = function (selector) {
        var toggleMusicButton = $(selector);

        //Change the music button to the 'Play' image and cause a song to play upon click.
        toggleMusicButton.setToPlay = function () {
            this.attr('title', 'Play').off('click').on('click', function () { return Player.play(); });
            $('#pauseIcon').hide();
            $('#playIcon').show();
        }

        //Change the music button to the 'Pause' image and cause a song to pause upon click.
        toggleMusicButton.setToPause = function () {
            this.attr('title', 'Pause').off('click').on('click', function () { return Player.pause(); });
            $('#pauseIcon').show();
            $('#playIcon').hide();
        }

        //Enable the button such that it can be clicked.
        //TODO: Remove dependency on checking for class.
        toggleMusicButton.enable = function () {
            if (this.hasClass('disabled')) {
                this.removeClass('disabled');
                $(this).find('.path').css('fill', 'black');
            }
        }

        //Disable the button such that it cannot be clicked.
        //TODO: Remove dependency on checking for class.
        //NOTE: Pause button is never able to be shown disabled.
        toggleMusicButton.disable = function () {
            if (!this.hasClass('disabled')) {
                this.setToPlay();
                this.addClass('disabled').off('click');
                $(this).find('.path').css('fill', 'gray');
            }
        }

        return toggleMusicButton;
    }

    var _buildSkipButton = function (selector) {
        var skipButton = $(selector);

        //TODO: Remove dependency on checking for class.
        skipButton.enable = function () {
            if (this.hasClass('disabled')) {
                $(this).find('.path').css('fill', 'black');
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
        skipButton.disable = function () {
            if (!this.hasClass('disabled')) {
                this.attr('src', "images/skip-disabled.png").addClass('disabled').off('click');
                $(this).find('.path').css('fill', 'gray');
            }
        };

        return skipButton;
    }

    var _buildShuffleButton = function (selector) {
        var shuffleButton = $(selector);

        //TODO: Remove dependency on checking for class.
        shuffleButton.disable = function () {
            $(this).find('.path').css('fill', 'gray');
            this.attr('src', "images/shuffle-disabled.png").addClass('disabled').off('click');
        };

        //TODO: Remove dependency on checking for class.
        shuffleButton.enable = function () {
            this.attr('src', "images/shuffle.png").removeClass('disabled').off('click').one('click', ShuffleSong);
            $(this).find('.path').css('fill', 'white');
            var self = this;
            function ShuffleSong() {
                //This will trigger an update. Necessary since no state change.
                Player.shuffle();
                //Prevent spamming by only allowing a shuffle click once a second.
                setTimeout(function () { self.off('click').one('click', ShuffleSong) }, 1000);
            };
        };

        return shuffleButton;
    }

    var _buildMuteButton = function (selector) {
        var muteButton = $(selector);

        //Toggles the muted icon.
        muteButton.on('click', function () {
            var isMuted = _volumeSlider.toggleMute();
            var title = isMuted ? 'Unmute' : 'Mute';
            $(this).attr('title', title);
        });

        $("#MuteButton, #soundSlider").hover(function(){
            $("#soundSlider").css("top","70px");
        }, function(){
          $("#soundSlider").css("top","-35px");
        });

        return muteButton;
    }

    //A specific slider element which is responsible for controlling the volume indicator of the UI.
    //TODO: Fix rapid hovering in and out causing flickering.
    var _buildVolumeSlider = function (selector) {
        var MUSICMUTED_LOCALSTORAGEKEY = 'musicMuted';
        var MUSICVOLUME_LOCALSTORAGEKEY = 'musicVolume';

        //When foreground is closed the music's volume is forgotten, but the player may continue to play.
        //Upon re-opening we need the last known values.
        //TODO: An unhandled scenario is when a user interacts with the YouTube player outside of SongBuzz, toggles mute, and then reopens SongBuzz -- incorrect values will display.
        var _musicVolume = 100;
        var _storedMusicVolume = localStorage.getItem(MUSICVOLUME_LOCALSTORAGEKEY);

        //I've managed to serialize 'undefined' back to the stored volume. That should be treated as null, though.
        if(_storedMusicVolume && _storedMusicVolume != 'undefined')
            _musicVolume = JSON.parse(_storedMusicVolume);

        var _isMuted = false;
        var _storedIsMuted = localStorage.getItem(MUSICMUTED_LOCALSTORAGEKEY);

        //I've managed to serialize 'undefined' back to the stored volume. That should be treated as null, though.
        if(_storedIsMuted && _storedIsMuted != 'undefined')
            _isMuted = JSON.parse(_storedIsMuted);

        var _onVolumeChanged = function (event, volume) {
            _isMuted = volume == 0;
            localStorage.setItem(MUSICMUTED_LOCALSTORAGEKEY, JSON.stringify(_isMuted));
            if (volume != 0) {
                //Remember old music value if muting so that unmute is possible.
                _musicVolume = volume;
                localStorage.setItem(MUSICVOLUME_LOCALSTORAGEKEY, JSON.stringify(_musicVolume));
            }

            Player.setVolume(volume);
        }

        var _updateSoundIcon = function(volume){
            //Repaint the amount of white filled in the bar showing the distance the grabber has been dragged.
            $(selector).css('background-image', '-webkit-gradient(linear,left top, right top, from(#ccc), color-stop('+ volume/100 +',#ccc), color-stop('+ volume/100+',rgba(0,0,0,0)), to(rgba(0,0,0,0)))')

            //Paint the various bars indicating the sound level. 
            var fillColor = volume >= 25 ? '#fff' : '#555';
            $('#volume1').css('fill', fillColor);

            fillColor = volume >= 50 ? '#fff' : '#555';
            $('#volume2').css('fill', fillColor);

            fillColor = volume >= 75 ? '#fff' : '#555';
            $('#volume3').css('fill', fillColor);

            fillColor = volume == 100 ? '#fff' : '#555';
            $('#volume4').css('fill', fillColor);
        }

        $(selector).change(function(event, ui){
            _onVolumeChanged(event, this.value);
            _updateSoundIcon(this.value);
        });

        $(selector).val(_musicVolume);
        _updateSoundIcon(_musicVolume);

        var volumeSlider = {
            //Changes the muted state of the player and returns the state after toggling.
            toggleMute: function(){
                _isMuted ? this.setVolume(_musicVolume) : this.setVolume(0);
                //This value is the opposite of above because setting slider volume has side-effects.
                return _isMuted;
            },

            setVolume: function(volume){
                $(selector).val(volume);
                _updateSoundIcon(volume);
                _isMuted = volume == 0;

                //Don't record value if muting so value can be set back when unmuting.
                if(volume)
                    _musicVolume = volume;
            }
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
            _volumeSlider.setVolume(volume);
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