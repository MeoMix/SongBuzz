function SongsTab(){
	"use strict";
    var contentHeader = new ContentHeader('#CurrentSongDisplay', 'Add Songs', 'Search for artists or songs');
    new UrlInput(contentHeader); 

	return {
		setContentHeaderTitle: function(title){
			contentHeader.setTitle(title);
		}
	};
}