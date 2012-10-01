//The buttons, sliders, etc. which serve as the middle-men between user interactions and player responses.
define(['player_controls/volume_slider', 'player_controls/playpause_button', 'player_controls/skip_button', 'player_controls/previous_button', 'player_controls/shuffle_button'],
    function(volumeSlider, playPauseButton, skipButton, previousButton){
    'use strict';

    return {
        refreshControls: function(playerState, currentSong, songCount, playerIsSeeking, playerVolume){
            if(playerState === PlayerStates.PLAYING){
                //Volume only becomes available once a video has become cued or when popup reopens.
                volumeSlider.volume = playerVolume;
                playPauseButton.setToPause();
            }
            else if(!playerIsSeeking){
                playPauseButton.setToPlay();
            }

            if(currentSong){
                playPauseButton.enable();

                if(songCount > 1){
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