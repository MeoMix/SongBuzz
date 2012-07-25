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
    console.log("Reloading playerControls");
    var playerControls = new PlayerControls();
    var header = new Header();

    var songsTab = new SongsTab();
    var playlistsTab = new PlaylistsTab();    

    var songList = new SongList();
    var settings = new Settings();

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
            playlistsTab.setContentHeaderTitle(playlistTitle);
            playlistsTab.reloadList();
        }
    };
}