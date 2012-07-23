//UI Elements consist of:
//  * Content Tabs.
//  * Buttons
//  * Current / Total Time
//  * Header (Song Title)
//  * URL Input (Add Songs)
//  * Current Playlist Songs
//  * Volume Slider
//  * Song Progress Bar
function uiElements() {
    var playerControls = playerControls();
    var header = header();

    var songsTab = songsTab();
    var playlistsTab = playlistsTab();    

    var songList = songList();
    var settings = settings();

    //No public methods so no object returned.  
    timeDisplay();
    contentButtons();

    return {
        //Refereshes the visual state of the UI after the Player broadcasts a message.
        //This keeps the UI synced with the background.
        updateWithMessage: function (message) {
            var playerState = message.playerState;
            switch (playerState) {
                case PlayerStates.ENDED:
                case PlayerStates.VIDCUED:
                case PlayerStates.PAUSED:
                    playerControls.setToggleMusicToPlay();
                    break;
                case PlayerStates.PLAYING:
                    //Volume only becomes available once a video has become cued or when popup reopens.
                    var volume = Player.getVolume();
                    playerControls.setVolume(volume);
                    playerControls.setToggleMusicToPause();
                    break;
            }

            var songs = message.songs;
            playerControls.setEnableToggleMusicButton(songs.length > 0);
            playerControls.setEnableSkipButton(songs.length > 1);
            playerControls.setEnableShuffleButton(songs.length > 1);

            var currentSong = message.currentSong;
            songList.reload(songs, currentSong);
            header.updateTitle(currentSong);

            var playlistTitle = Player.getPlaylistTitle();
            songsTab.setContentHeaderTitle(playlistTitle);
            playlistsTab.setContentHeaderTitle(playlistTitle)
            playlistsTab.reloadList();
        }
    };
}