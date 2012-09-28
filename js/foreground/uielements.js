var UIElements;

//Load mousewheel here because it isn't needed in foreground and is not wrapped in a require block (so it might get loaded before jQuery if put in foreground)
define(['player_controls/player_controls', 'header', 'songs_tab/songs_tab', 'playlists_tab/playlists_tab', 'time_display', 'progress_bar', 'content_buttons', '../playerstates', 'player'],
 function(playerControls, header, songsTab, playlistsTab, timeDisplay, progressBar, contentButtons, playerStates, player){
    UIElements = function() {
        "use strict";
        progressBar.selector.bind('manualTimeChange', timeDisplay.update);

        //TODO: This shouldn't be here. It's terrible!
        $('#' + progressBar.id).change(function(){
            timeDisplay.update(progressBar.value);
        });

        var update;
        (update = function () {
            switch (player.playerState) {
                case PlayerStates.ENDED:
                case PlayerStates.VIDCUED:
                case PlayerStates.PAUSED:
                    if(!player.isSeeking){
                        playerControls.setPlayPauseButtonToPlay();
                    }
                    break;
                case PlayerStates.PLAYING:
                    //Volume only becomes available once a video has become cued or when popup reopens.
                    playerControls.volume = player.volume;
                    playerControls.setPlayPauseButtonToPause();
                    break;
            }

            playerControls.setEnableToggleMusicButton(player.currentSong && player.songs.length > 0);
            playerControls.setEnableSkipButton(player.currentSong && player.songs.length > 1);

            songsTab.reloadSongList(player.songs, player.currentSong);
            header.updateTitle(player.currentSong);

            songsTab.contentHeaderTitle = player.playlistTitle;
            playlistsTab.contentHeaderTitle = player.playlistTitle;
            playlistsTab.reloadList();
        })();

        return {
            //Refereshes the visual state of the UI after the player broadcasts a message.
            //This keeps the UI synced with the background.
            update: update
        };
    }
});