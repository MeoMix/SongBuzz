//The buttons, sliders, etc. which serve as the middle-men between user interactions and player responses.
var PlayerControls = (function() {
    "use strict";
    var volumeSlider = new VolumeSlider();
    var playPauseButton = new PlayPauseButton();
    var skipButton = new SkipButton();
    var shuffleButton = new ShuffleButton();

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

        setPlayPauseButtonToPlay: function () {
            playPauseButton.setToPlay();
        },

        setPlayPauseButtonToPause: function () {
            playPauseButton.setToPause();
        },

        setEnableToggleMusicButton: function (enable) {
            if(enable){
                playPauseButton.enable();
            }
            else {
                playPauseButton.disable();
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
});