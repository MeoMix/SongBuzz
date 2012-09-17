var Dialogs = (function(){
	"use strict";
	
	return {
		showReplacedSongNotification: function(){
			var replacedSongDialog = $('#ReplacedSongDialog');
			var dontDisplay = localStorage.getItem('ShowReplacedSongDialog');

			if(dontDisplay === "false"){
				//Show the dialog once everything is ready.
				replacedSongDialog.dialog({
					autoOpen: true,
					modal: true,
					buttons: {
						"Confirm": function () {
							$(this).dialog("close");

							localStorage.setItem('ShowReplacedSongDialog', replacedSongDialog.find('input').is(':checked'));
						},
						"Cancel": function () {
							$(this).dialog("close");
						}
					}
				});	
			}
		},
		showBannedSongDialog: function(){
			var bannedSongDialog = $('#BannedSongDialog');

			bannedSongDialog.dialog({
				autoOpen: true,
				modal: true,
				buttons: {
					"Ok": function () {
						$(this).dialog("close");
					}
				}
			});
		}
	}

})();