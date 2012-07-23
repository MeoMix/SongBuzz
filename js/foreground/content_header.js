function contentHeader(selector, addText, addInputPlaceholder){
	var contentHeader = $(selector);

  $('<h1/>', {
    class: 'headerTitle'
  }).appendTo(contentHeader);

  var addButton = $('<div/>', {
    class: 'addButton'
  }).appendTo(contentHeader);

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
  contentHeader.find('.addText').text(addText);
  contentHeader.find('.addInput').attr('placeholder', addInputPlaceholder);

  //These properties are general -- each header should have these.
  var headerTitle = $('.headerTitle');
  var addInput = $('.addInput');
  var addButton = $('.addButton');
  var addCancelIcon = $('.addCancelIcon');

  //Set currently loaded playlist title.
  headerTitle.text(Player.getPlaylistTitle());

  var expand = function(){
      addInput.css('opacity', 1).css('cursor', "auto").focus();
      addCancelIcon.css('right', '0px').one('click', contract);
      addButton.width('350px');
  }
  addButton.one('click', expand);

  var contract = function(){
      addInput.css('opacity', 0).css('cursor', "pointer").val('').blur();
      addCancelIcon.css('right', '-30px');
      addButton.width('120px').one('click', expand);

      //Clicking the 'X' icon bubbles the click event up to the parent button causing expand to call again.
      return false; 
  }

  return {
    setTitle: function(title){
      headerTitle.text(title);
    },
    
    //Display a message for X milliseconds inside of the input. 
    flashMessage: function(message, durationInMilliseconds){
        var placeholder = addInput.attr('placeholder');
        addInput.val('').blur().attr('placeholder', message);
        window.setTimeout(function () {
            addInput.attr('placeholder', placeholder);
        }, durationInMilliseconds);
    }
  };
}