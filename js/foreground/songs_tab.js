function songsTab(){
    var contentHeader = contentHeader('#CurrentSongDisplay', 'Add Songs', 'Search for artists or songs');
    urlInput(contentHeader); 

	return {
		setContentHeaderTitle: function(title){
			contentHeader.setTitle(title);
		}
	};
}