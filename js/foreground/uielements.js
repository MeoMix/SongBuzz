var UIElements;

//Load mousewheel here because it isn't needed in foreground and is not wrapped in a require block (so it might get loaded before jQuery if put in foreground)
require(['../third_party/jquery.mousewheel', 'player_controls/player_controls', 'header', 'songs_tab/songs_tab', 'playlists_tab/playlists_tab', 'time_display', 'progress_bar', 'content_buttons', '../playerstates'], function(){
    UIElements = function() {
        "use strict";
        var playerControls = new PlayerControls();
        var header = new Header();

        var songsTab = new SongsTab();
        var playlistsTab = new PlaylistsTab();   
        var timeDisplay = new TimeDisplay();

        var progressBar = new ProgressBar(Player.currentTime, Player.totalTime);
        progressBar.selector.bind('manualTimeChange', timeDisplay.update);

        //TODO: This shouldn't be here. It's terrible!
        $('#' + progressBar.id).change(function(){
            timeDisplay.update(progressBar.value);
        });

        //No public method so no object returned.  
        new ContentButtons();

        var update;
        (update = function () {
            switch (Player.playerState) {
                case PlayerStates.ENDED:
                case PlayerStates.VIDCUED:
                case PlayerStates.PAUSED:
                    if(!Player.isSeeking){
                        playerControls.setPlayPauseButtonToPlay();
                    }
                    break;
                case PlayerStates.PLAYING:
                    //Volume only becomes available once a video has become cued or when popup reopens.
                    playerControls.volume = Player.volume;
                    playerControls.setPlayPauseButtonToPause();
                    break;
            }

            playerControls.setEnableToggleMusicButton(Player.currentSong && Player.songs.length > 0);
            playerControls.setEnableSkipButton(Player.currentSong && Player.songs.length > 1);

            songsTab.reloadSongList(Player.songs, Player.currentSong);
            header.updateTitle(Player.currentSong);

            songsTab.contentHeaderTitle = Player.playlistTitle;
            playlistsTab.contentHeaderTitle = Player.playlistTitle;
            playlistsTab.reloadList();
        })();

        return {
            //Refereshes the visual state of the UI after the Player broadcasts a message.
            //This keeps the UI synced with the background.
            update: update
        };
    }
});