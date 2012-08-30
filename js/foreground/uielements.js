function UiElements() {
    "use strict";
    var playerControls = new PlayerControls();
    var header = new Header();

    var songsTab = new SongsTab();
    var playlistsTab = new PlaylistsTab();   

    //No public methods so no object returned.  
    new TimeDisplay();
    new ContentButtons();

    var update = function (playerState, songs, currentSong) {
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
                playerControls.setPlayPauseButtonToPause();
                break;
        }

        playerControls.setEnableToggleMusicButton(currentSong && songs.length > 0);
        playerControls.setEnableSkipButton(currentSong && songs.length > 1);
        playerControls.setEnableShuffleButton(currentSong && songs.length > 1);

        songsTab.reloadSongList(songs, currentSong);
        header.updateTitle(currentSong);

        var playlistTitle = Player.getPlaylistTitle();
        songsTab.setContentHeaderTitle(playlistTitle);
        playlistsTab.setContentHeaderTitle(playlistTitle);
        playlistsTab.reloadList();
    };

    if(!Player.isReady){
        $('#overlay').css({
            opacity: 0.5,
            top: $('#SongList').offset().top,
            left: $('#SongList').offset().left,
            width: $('#SongList').outerWidth(),
            height: $('#SongList').outerHeight()
        });

        $('#floatingCirclesG').css({
            top: ($('#SongList').height() / 2) - $('#floatingCirclesG').height()/2,
            left: ($('#SongList').width() /2) - $('#floatingCirclesG').width()/2
        });

        $('#overlay').fadeIn();
    }

    if(Player){
        update(Player.getPlayerState(), Player.getSongs(), Player.getCurrentSong());
    }
    return {
        //Refereshes the visual state of the UI after the Player broadcasts a message.
        //This keeps the UI synced with the background.
        update: update
    };
}