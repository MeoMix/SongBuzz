//Responsible for showing options when interacting with a song list or play list
//TODO: This needs to be extended such that there is a generic contextmenu object, and then various different context menus based on what is being clicked.
var ContextMenu = (function(clickedObject){
	"use strict";
	var selector = $('#ContextMenu').empty();

	$('<a/>', {
		href: '#',
		text: 'Copy song URL',
		click: function(){
			if(clickedObject != null ){
        		chrome.extension.sendRequest({ text: clickedObject.url });
			}
		}
	}).appendTo(selector);

	$('<a/>', {
		href: '#',
		text: 'Delete song',
		click: function(){
			if(clickedObject != null ){
        		Player.removeSongById(clickedObject.id);
			}
		}
	}).appendTo(selector);

	//Hide the context menu whenever any click occurs not just when selecting an item.
	$(document).click(function(){
		selector.offset({
			top: 0,
			left: 0
		}).hide();
	});

	return {
		show: function(top, left){
			selector.offset({
				top: top,
				left: left
			}).show();
		}
	}
});