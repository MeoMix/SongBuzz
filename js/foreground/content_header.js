function contentHeader(selector){
	var _selector = $(selector);

	var html = '<h1>Playlist title</h1>' +
					'<div id="addSongButton" class="addButton">' +
               			'<svg id="addIcon" width="12" height="12">' +
                 			'<rect x="4.625" y="0" width="2.75" height="12" fill="#555" />' +
                 			'<rect x="0" y="4.625" width="12" height="2.75" fill="#555" />' +
               			'</svg>' +
               			'<span id="addText">Add Songs</span>' +
               			'<input id="addSongInput" class="addInput" type="text" placeholder="Search for artists or songs">' +
               			'<div id="addSongCancelIcon" class="addCancelIcon">' +
                 		'<svg width="12" height="12">' +
                      		'<path d="M0,2 L2,0 L12,10 L10,12z" fill="#555" />' +
                      		'<path d="M12,2 L10,0 L0,10 L2,12z" fill="#555" />' +
                 		'</svg>' +
              		 '</div>' +
            	'</div>';

	_selector.html(html);




	var contentHeader = {
		
	}

}