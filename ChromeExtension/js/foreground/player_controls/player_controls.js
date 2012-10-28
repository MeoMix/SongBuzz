//The buttons, sliders, etc. which serve as the middle-men between user interactions and player responses.
define(['volume_slider', 'playpause_button', 'skip_button', 'previous_button', 'shuffle_button'], 
    function(volumeSlider, playPauseButton, skipButton, previousButton){
    'use strict';
    return {
        refreshControls: function(){
            var player = chrome.extension.getBackgroundPage().YoutubePlayer;

            if(player.playerState === PlayerStates.PLAYING){
                //Volume only becomes available once a video has become cued or when popup reopens.
                volumeSlider.volume = player.volume;
                playPauseButton.setToPause();
            }
            else if(!player.playerIsSeeking){
                playPauseButton.setToPlay();
            }

            if(player.currentSong){
                playPauseButton.enable();

                if(JSON.parse(localStorage.getItem('isRadioModeEnabled')) || false){
                    skipButton.enable();
                }

                if(player.songs.length > 1){
                    skipButton.enable();
                    previousButton.enable();
                }
            }
            else{
                playPauseButton.disable();
                skipButton.disable();
                previousButton.disable();
            }
        }
    };
});