function SongsTab(){
    var contentHeader = ContentHeader('#CurrentSongDisplay', 'Add Songs', 'Search for artists or songs');
    UrlInput(contentHeader); 

	return {
		setContentHeaderTitle: function(title){
			contentHeader.setTitle(title);
		}
	};
}