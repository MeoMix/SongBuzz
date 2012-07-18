function contentHeader(headerSelector, addText, addInputPlaceholder){
	var _selector = $(headerSelector);

	var html = '<h1 class="headerTitle"></h1>' +
					'<div class="addButton">' +
               			'<svg id="addIcon" width="12" height="12">' +
                 			'<rect x="4.625" y="0" width="2.75" height="12" fill="#555" />' +
                 			'<rect x="0" y="4.625" width="12" height="2.75" fill="#555" />' +
               			'</svg>' +
               			'<span class="addText"></span>' +
               			'<input class="addInput" type="text">' +
               			'<div class="addCancelIcon">' +
                 		'<svg width="12" height="12">' +
                      		'<path d="M0,2 L2,0 L12,10 L10,12z" fill="#555" />' +
                      		'<path d="M12,2 L10,0 L0,10 L2,12z" fill="#555" />' +
                 		'</svg>' +
              		 '</div>' +
            	'</div>';

	_selector.html(html);

  //These properties are specific to what header is being displayed.
  $(headerSelector + ' .addText').text(addText);
  $(headerSelector + '.addInput').attr('placeholder', addInputPlaceholder);

  //These properties are general -- each header should have these.
  var _headerTitle = $('.headerTitle');
  var _addInput = $('.addInput');
  var _addButton = $('.addButton');
  var _addCancelIcon = $('.addCancelIcon');

  //Set currently loaded playlist title.
  _headerTitle.text(Player.getPlaylistTitle());

  var _expand = function(){
      _addInput.css('opacity', 1).css('cursor', "auto");
      _addCancelIcon.css('right', '0px');
      _addButton.width('350px');
      _addInput.focus();
      _addCancelIcon.one('click', _contract);
  }

  var _contract = function(){
      _addInput.css('opacity', 0).css('cursor', "pointer").blur();
      _addCancelIcon.css('right', '-30px');
      _addButton.width('120px').one('click', _expand);
      return false; //Clicking the 'X' icon bubbles the click event up to the parent button causing expand to call again.
  }

  _addButton.one('click', _expand);

  var contentHeader = {
    setTitle: function(title){
      _headerTitle.text(title);
    }
  }

  return contentHeader;
}