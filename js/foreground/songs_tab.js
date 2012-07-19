function songsTab(){
    var _contentHeader = contentHeader('#CurrentSongDisplay', 'Add Songs', 'Search for artists or songs');

    urlInput(_contentHeader); 

	var songsTab = {
		setContentHeaderTitle: function(title){
			_contentHeader.setTitle(title);
		}
	}

	return songsTab;
}