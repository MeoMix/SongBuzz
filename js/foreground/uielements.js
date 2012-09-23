function UiElements() {
    "use strict";
    var playerControls = new PlayerControls();
    var header = new Header();

    var songsTab = new SongsTab();
    var playlistsTab = new PlaylistsTab();   

    //No public methods so no object returned.  
    new TimeDisplay();
    new ContentButtons();

    var update = function () {
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
    };

    //TODO: call this better.
    update();

    return {
        //Refereshes the visual state of the UI after the Player broadcasts a message.
        //This keeps the UI synced with the background.
        update: update
    };
}