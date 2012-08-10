function ContentHeader(selector, addText, addInputPlaceholder){
  "use strict";
	var contentHeader = $(selector);

  var headerTitle = $('<span/>', {
    'class': 'headerTitle'
  }).appendTo(contentHeader);

  var headerLabel = $('<label/>', {
    'data-type': 'editable',
    'data-for': '.headerInput',
    text: Player.getPlaylistTitle()
  }).appendTo(headerTitle);

  $('<input/>', {
    'class': 'headerInput',
    type: 'text',
  }).appendTo(headerTitle);

  var addButton = $('<div/>', {
    'class': 'addButton'
  }).appendTo(contentHeader);
  //jQuery does not support appending paths to SVG elements. You MUST declare element inside of svg's HTML mark-up.
  addButton.append('<svg id="addButtonSvg"><rect x="4.625" y="0" width="2.75" height="12"/><rect x="0" y="4.625" width="12" height="2.75"/></svg>');

  $('<span/>', {
    'class': 'addText',
    text: addText
  }).appendTo(addButton);

  var addInput = $('<input/>', {
    'class': 'addInput',
    type: 'text',
    placeholder: addInputPlaceholder,
  }).appendTo(addButton);

  var addCancelIcon = $('<div/>', {
    'class': 'addCancelIcon'
  }).appendTo(addButton);  
  //jQuery does not support appending paths to SVG elements. You MUST declare element inside of svg's HTML mark-up.
  addCancelIcon.append('<svg id="addCancelIconSvg"><path d="M0,2 L2,0 L12,10 L10,12z"/><path d="M12,2 L10,0 L0,10 L2,12z"/></svg>');

  var expand = function(){
      addInput.css('opacity', 1).css('cursor', "auto").focus();
      addCancelIcon.css('right', '0px').one('click', contract);
      addButton.width('350px');
  };
  addButton.one('click', expand);

  var contract = function(){
      addInput.css('opacity', 0).css('cursor', "pointer").val('').blur();
      addCancelIcon.css('right', '-30px');
      addButton.width('120px').one('click', expand);
      //Prevent click event from bubbling up so button does not expand on click.
      return false; 
  };

  $('body').editables({
    editOn: 'click',
    onFreeze: function(e, i){
      if(this.val() != ''){
        
      }
    }
  });

  return {
    setTitle: function(title){
      headerLabel.text(title);
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