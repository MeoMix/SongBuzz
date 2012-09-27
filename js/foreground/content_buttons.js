var ContentButtons;

require([], function(){
    ContentButtons = function(){
        "use strict";
        var menuButtons = $('.menubutton');
        var content = $('.content');
        var homeContent = $('#HomeContent');
        var playlistsContent = $('#PlaylistsContent');
        var settingsContent = $('#SettingsContent');

        //User clicks on a different button on the LHS, possible change of content display.
        menuButtons.click(function(){
            //If the user clicked a button that isn't the current button.
            if(!$(this).hasClass('active')){
                //Clear content and show new content based on button clicked.
                menuButtons.removeClass('active');
                $(this).addClass('active');
                
                content.hide();
                switch(this.id){
                    case 'HomeMenuButton':
                        homeContent.show();
                    break;
                    case 'PlaylistsMenuButton':
                        playlistsContent.show();
                    break;
                    case 'SettingsMenuButton':
                        settingsContent.show();
                    break;
                }
            }
        });
    }
});