function ContentButtons(){
    "use strict";

	//User clicks on a different button on the LHS, possible change of content display.
    $('.menubutton').click(function(){
        //If the user clicked a button that isn't the current button.
        if(!$(this).hasClass('active')){
            //Clear content and show new content based on button clicked.
            $('.menubutton').removeClass('active');
            $(this).addClass('active');
            $('.content').hide();

            switch(this.id){
                case 'HomeMenuButton':
                    $('#HomeContent').show();
                break;
                case 'PlaylistsMenuButton':
                    $('#PlaylistsContent').show();
                break;
                case 'SettingsMenuButton':
                    $('#SettingsContent').show();
                break;
            }
        }
    });
}