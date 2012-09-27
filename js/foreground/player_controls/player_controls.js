//The buttons, sliders, etc. which serve as the middle-men between user interactions and player responses.
var PlayerControls 

require(['player_controls/volume_slider', 'player_controls/playpause_button', 'player_controls/skip_button', 'player_controls/previous_button', 'player_controls/shuffle_button'], function(){
    PlayerControls = (function() {
        "use strict";
        var volumeSlider = new VolumeSlider();
        var playPauseButton = new PlayPauseButton();
        var skipButton = new SkipButton();
        var previousButton = new PreviousButton();
        var shuffleButton = new ShuffleButton();

        return {
            set volume(value){
                volumeSlider.volume = value;
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
                    previousButton.enable();
                }
                else{
                    skipButton.disable();
                    previousButton.disable();
                }
            }
        };
    });
});