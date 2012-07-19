function contentHeader(selector, addText, addInputPlaceholder){
	var _contentHeader = $(selector);

  $('<h1/>', {
    class: 'headerTitle'
  }).appendTo(_contentHeader);

  var addButton = $('<div/>', {
    class: 'addButton'
  }).appendTo(_contentHeader);

  //jQuery does not support appending paths to SVG elements. You MUST declare element inside of svg's HTML mark-up.
  addButton.append('<svg id="addButtonSvg"><rect x="4.625" y="0" width="2.75" height="12"/><rect x="0" y="4.625" width="12" height="2.75"/></svg>');

  $('<span/>', {
    class: 'addText'
  }).appendTo(addButton);

  $('<input/>', {
    class: 'addInput',
    type: 'text'
  }).appendTo(addButton);

  var addCancelIcon = $('<div/>', {
    class: 'addCancelIcon'
  }).appendTo(addButton);
                
  //jQuery does not support appending paths to SVG elements. You MUST declare element inside of svg's HTML mark-up.
  addCancelIcon.append('<svg id="addCancelIconSvg"><path d="M0,2 L2,0 L12,10 L10,12z"/><path d="M12,2 L10,0 L0,10 L2,12z"/></svg>');

  //These properties are specific to what header is being displayed.
  _contentHeader.find('.addText').text(addText);
  _contentHeader.find('.addInput').attr('placeholder', addInputPlaceholder);

  //These properties are general -- each header should have these.
  var _headerTitle = $('.headerTitle');
  var _addInput = $('.addInput');
  var _addButton = $('.addButton');
  var _addCancelIcon = $('.addCancelIcon');

  //Set currently loaded playlist title.
  _headerTitle.text(Player.getPlaylistTitle());

  var _expand = function(){
      _addInput.css('opacity', 1).css('cursor', "auto").focus();
      _addCancelIcon.css('right', '0px').one('click', _contract);
      _addButton.width('350px');
  }
  _addButton.one('click', _expand);

  var _contract = function(){
      _addInput.css('opacity', 0).css('cursor', "pointer").val('').blur();
      _addCancelIcon.css('right', '-30px');
      _addButton.width('120px').one('click', _expand);

      //Clicking the 'X' icon bubbles the click event up to the parent button causing expand to call again.
      return false; 
  }

  var contentHeader = {
    setTitle: function(title){
      _headerTitle.text(title);
    },
    
    //Display a message for X milliseconds inside of the input. 
    flashMessage: function(message, durationInMilliseconds){
        var placeholder = _addInput.attr('placeholder');
        _addInput.val('').blur().attr('placeholder', message);
        window.setTimeout(function () {
            _addInput.attr('placeholder', placeholder);
        }, durationInMilliseconds);
    }
  }

  return contentHeader;
}