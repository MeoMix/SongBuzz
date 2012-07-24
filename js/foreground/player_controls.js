//The buttons, sliders, etc. which serve as the middle-men between user interactions and player responses.
function PlayerControls() {
    "use strict";
    var buildToggleMusicButton = function (selector) {
        var toggleMusicButton = $(selector);

        //Change the music button to the 'Play' image and cause a song to play upon click.
        toggleMusicButton.setToPlay = function () {
            this.off('click').on('click', function () { return Player.play(); });
            $('#pauseIcon').hide();
            $('#playIcon').show();
        };

        //Change the music button to the 'Pause' image and cause a song to pause upon click.
        toggleMusicButton.setToPause = function () {
            this.off('click').on('click', function () { return Player.pause(); });
            $('#pauseIcon').show();
            $('#playIcon').hide();
        };

        //Enable the button such that it can be clicked.
        //TODO: Remove dependency on checking for class.
        toggleMusicButton.enable = function () {
            if (this.hasClass('disabled')) {
                this.removeClass('disabled');
                $(this).find('.path').css('fill', 'black');
            }
        };

        //Disable the button such that it cannot be clicked.
        //TODO: Remove dependency on checking for class.
        //NOTE: Pause button is never able to be shown disabled.
        toggleMusicButton.disable = function () {
            if (!this.hasClass('disabled')) {
                this.setToPlay();
                this.addClass('disabled').off('click');
                $(this).find('.path').css('fill', 'gray');
            }
        };

        return toggleMusicButton;
    };

    var buildSkipButton = function (selector) {
        var skipButton = $(selector);

        function skipSong() {
            Player.skipSong();
            //Prevent spamming by only allowing a next click once a second.
            setTimeout(function () { 
                skipButton.off('click').one('click', skipSong);
            }, 1000);
        }

        //TODO: Remove dependency on checking for class.
        skipButton.enable = function () {
            if (this.hasClass('disabled')) {
                $(this).find('.path').css('fill', 'black');
                this.prop('src', "images/skip.png").removeClass('disabled').off('click').one('click', skipSong);
            }
        };

        //TODO: Remove dependency on checking for class.
        skipButton.disable = function () {
            if (!this.hasClass('disabled')) {
                this.prop('src', "images/skip-disabled.png").addClass('disabled').off('click');
                $(this).find('.path').css('fill', 'gray');
            }
        };

        return skipButton;
    };

    var buildShuffleButton = function (selector) {
        var shuffleButton = $(selector);

        //TODO: Remove dependency on checking for class.
        shuffleButton.disable = function () {
            $(this).find('.path').css('fill', 'gray');
            this.prop('src', "images/shuffle-disabled.png").addClass('disabled').off('click');
        };

        //TODO: Remove dependency on checking for class.
        shuffleButton.enable = function () {
            this.prop('src', "images/shuffle.png").removeClass('disabled').off('click').one('click', ShuffleSong);
            $(this).find('.path').css('fill', 'white');
            var self = this;
            function ShuffleSong() {
                //This will trigger an update. Necessary since no state change.
                Player.shuffle();
                //Prevent spamming by only allowing a shuffle click once a second.
                setTimeout(function () {
                    self.off('click').one('click', ShuffleSong);
                }, 1000);
            }
        };

        return shuffleButton;
    };

    var buildMuteButton = function (selector) {
        //Toggles the muted icon.
        $(selector).on('click', function () {
            var isMuted = volumeSlider.toggleMute();
        });

        $("#MuteButton, #soundSlider").hover(function(){
            $("#soundSlider").css("top","70px");
        }, function(){
          $("#soundSlider").css("top","-35px");
        });

        return {};
    };

    //A specific slider element which is responsible for controlling the volume indicator of the UI.
    //TODO: Fix rapid hovering in and out causing flickering.
    var buildVolumeSlider = function (selector) {
        var MUSICMUTED_LOCALSTORAGEKEY = 'musicMuted';
        var MUSICVOLUME_LOCALSTORAGEKEY = 'musicVolume';

        //When foreground is closed the music's volume is forgotten, but the player may continue to play.
        //Upon re-opening we need the last known values.
        //TODO: An unhandled scenario is when a user interacts with the YouTube player outside of SongBuzz, toggles mute, and then reopens SongBuzz -- incorrect values will display.
        var musicVolume = 100;
        var storedMusicVolume = localStorage.getItem(MUSICVOLUME_LOCALSTORAGEKEY);

        //I've managed to serialize 'undefined' back to the stored volume. That should be treated as null, though.
        if(storedMusicVolume && storedMusicVolume !== 'undefined'){
            musicVolume = JSON.parse(storedMusicVolume);
        }

        var isMuted = false;
        var storedIsMuted = localStorage.getItem(MUSICMUTED_LOCALSTORAGEKEY);

        //I've managed to serialize 'undefined' back to the stored volume. That should be treated as null, though.
        if(storedIsMuted && storedIsMuted !== 'undefined'){
            isMuted = JSON.parse(storedIsMuted);
        }

        var updateWithNewVolume = function(volume){
            isMuted = volume === 0;
            localStorage.setItem(MUSICMUTED_LOCALSTORAGEKEY, JSON.stringify(isMuted));
            if (volume !== 0) {
                //Remember old music value if muting so that unmute is possible.
                musicVolume = volume;
                localStorage.setItem(MUSICVOLUME_LOCALSTORAGEKEY, JSON.stringify(musicVolume));
            }

            updateSoundIcon(volume);
            Player.setVolume(volume);
        };

        var updateSoundIcon = function(volume){
            //Repaint the amount of white filled in the bar showing the distance the grabber has been dragged.
            var backgroundImage = '-webkit-gradient(linear,left top, right top, from(#ccc), color-stop('+ volume/100 +',#ccc), color-stop('+ volume/100+',rgba(0,0,0,0)), to(rgba(0,0,0,0)))';
            $(selector).css('background-image', backgroundImage);

            //Paint the various bars indicating the sound level. 
            var fillColor = volume >= 25 ? '#fff' : '#555';
            $('#volume1').css('fill', fillColor);

            fillColor = volume >= 50 ? '#fff' : '#555';
            $('#volume2').css('fill', fillColor);

            fillColor = volume >= 75 ? '#fff' : '#555';
            $('#volume3').css('fill', fillColor);

            fillColor = volume === 100 ? '#fff' : '#555';
            $('#volume4').css('fill', fillColor);
        };

        $(selector).change(function(event, ui){
            updateWithNewVolume(this.value);
        });

        $(selector).val(musicVolume);
        updateSoundIcon(musicVolume);

        //TODO: This returns a custom object but other methods return the DOM element. Need to decide on a pattern.
        return {
            //Changes the muted state of the player and returns the state after toggling.
            toggleMute: function(){
                if(isMuted){
                    this.setVolume(musicVolume);
                }
                else{
                    this.setVolume(0);
                }

                //This value is the opposite of above because setting slider volume has side-effects.
                return isMuted;
            },

            setVolume: function(volume){
                $(selector).val(volume);
                updateWithNewVolume(volume);
            }
        };
    };

    //Private Fields
    var volumeSlider = buildVolumeSlider('#VolumeSlider');
    var toggleMusicButton = buildToggleMusicButton('#ToggleMusicButton');
    var skipButton = buildSkipButton('#SkipButton');
    var shuffleButton = buildShuffleButton('#ShuffleButton');
    buildMuteButton('#MuteButton');

    return {
        setVolume: function (volume) {
            volumeSlider.setVolume(volume);
        },

        setEnableShuffleButton: function (enable) {
            if(enable){
                shuffleButton.enable();
            }
            else{
                shuffleButton.disable();
            }
        },

        setToggleMusicToPlay: function () {
            toggleMusicButton.setToPlay();
        },

        setToggleMusicToPause: function () {
            toggleMusicButton.setToPause();
        },

        setEnableToggleMusicButton: function (enable) {
            if(enable){
                toggleMusicButton.enable();
            }
            else {
                toggleMusicButton.disable();
            }
        },

        setEnableSkipButton: function (enable) {
            if(enable){
                skipButton.enable();
            }
            else{
                skipButton.disable();
            }
        }
    };
}