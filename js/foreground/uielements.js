//UI Elements consist of:
//  * Content Tabs.
//  * Buttons
//  * Current / Total Time
//  * Header (Song Title)
//  * URL Input (Add Songs)
//  * Current Playlist Songs
//  * Volume Slider
//  * Song Progress Bar
function UiElements() {
    "use strict";
    var playerControls = new PlayerControls();
    var header = new Header();

    var songsTab = new SongsTab();
    var playlistsTab = new PlaylistsTab();    

    //TODO: Move into songs tab.
    var songList = new SongList();

    //No public methods so no object returned.  
    new TimeDisplay();
    new ContentButtons();

    return {
        //Refereshes the visual state of the UI after the Player broadcasts a message.
        //This keeps the UI synced with the background.
        updateWithMessage: function (message) {
            var playerState = message.playerState;
            switch (playerState) {
                case PlayerStates.ENDED:
                case PlayerStates.VIDCUED:
                case PlayerStates.PAUSED:
                    playerControls.setPlayPauseButtonToPlay();
                    break;
                case PlayerStates.PLAYING:
                    //Volume only becomes available once a video has become cued or when popup reopens.
                    var volume = Player.getVolume();
                    playerControls.setVolume(volume);
                    playerControls.setPlayPauseButtonToPlay();
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
            playlistsTab.setContentHeaderTitle(playlistTitle);
            playlistsTab.reloadList();
        }
    };
}