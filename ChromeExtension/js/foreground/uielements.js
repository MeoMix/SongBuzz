//Load mousewheel here because it isn't needed in foreground and is not wrapped in a require block (so it might get loaded before jQuery if put in foreground)
define(['player_controls/player_controls', 'header', 'settings_tab/settings', 'songs_tab/songs_tab', 'playlists_tab/playlists_tab', 
    'time_display', 'progress_bar', 'content_buttons'],
 function(playerControls, header, settings, songsTab, playlistsTab, timeDisplay, progressBar){
    'use strict';
    progressBar.selector.bind('manualTimeChange', timeDisplay.update);

    //Keep the current time display in sync with progressBar (i.e. when user is dragging progressBar)
    $('#' + progressBar.id).change(function(){
        timeDisplay.update(progressBar.value);
    });

    var refreshUI;
    (refreshUI = function () {
        playerControls.refreshControls();
        header.updateTitle();
        songsTab.reload();
        playlistsTab.reload();   
    })();

    return {
        //Refereshes the visual state of the UI to keep foreground synced with background.
        refreshUI: refreshUI
    };
});