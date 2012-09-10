var Dialogs = (function(){
	var buildRestrictedSongList = function(restrictedSongs){
        var restrictedSongList = restrictedSongDialog.find('#RestrictedSongList ul');

        restrictedSongList.empty();
        //Build up each row of song item + checkbox.
        $(restrictedSongs).each(function(){
            var listItem = $('<li/>').appendTo(restrictedSongList);

            var restrictedSongLink = $('<a/>', {
                id: this.id,
                href: '#' + this.videoId,
                text: this.name
            }).appendTo(listItem);

            var findPlayableCheckBox = $('<input/>', {
                type: 'checkbox',
                videoId: this.videoId
            }).appendTo(listItem);
        });

        return restrictedSongList;
	};

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

	    //A dialog which displays any songs that were found to have content restrictions.
	    //The dialog comes with check boxes on the side which allow the user to indicate which
	    //songs they want to attempt to find replacements for and which songs to ditch.
		showRestrictedSongDialog: function(restrictedSongs){
	        if(restrictedSongs) {
	        	var restrictedSongDialog = $('#RestrictedSongDialog');
				var restrictedSongList = buildRestrictedSongDialog(restrictedSongs);

	            //Show the dialog once everything is ready.
	            restrictedSongDialog.dialog({
	                autoOpen: true,
	                modal: true,
	                buttons: {
	                    "Confirm": function () {
	                        $(this).dialog("close");

	                        //If the user confirms then go find each checked song and find a replacement for it.
	                        restrictedSongList.find('input').each(function(){
	                            if(this.checked){
	                                YTHelper.findPlayableByVideoId($(this).attr('videoId'), function(playableSong){
	                                    Player.addSongById(playableSong.videoId);
	                                });
	                            }
	                        });
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