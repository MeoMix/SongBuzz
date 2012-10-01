//Load mousewheel here because it isn't needed in foreground and is not wrapped in a require block (so it might get loaded before jQuery if put in foreground)
define(['player_controls/player_controls', 'header', 'songs_tab/songs_tab', 'playlists_tab/playlists_tab', 'time_display', 'progress_bar', 'content_buttons', 'player'],
 function(playerControls, header, songsTab, playlistsTab, timeDisplay, progressBar, contentButtons, player){
    'use strict';
    progressBar.selector.bind('manualTimeChange', timeDisplay.update);

    //TODO: This shouldn't be here. It's terrible!
    $('#' + progressBar.id).change(function(){
        timeDisplay.update(progressBar.value);
    });

    var refreshUI;
    (refreshUI = function () {
        playerControls.refreshControls(player.playerState, player.currentSong, player.songs.length, player.isSeeking, player.volume);
        songsTab.reloadSongList(player.songs, player.currentSong);
        header.updateTitle(player.currentSong);
        songsTab.contentHeaderTitle = player.playlistTitle;
        playlistsTab.contentHeaderTitle = player.playlistTitle;
        playlistsTab.reloadList();
    })();

    return {
        //Refereshes the visual state of the UI to keep foreground synced with background.
        refreshUI: refreshUI
    };
});