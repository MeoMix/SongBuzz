// if the user is on youtube viewing a song
// provide a quick add bar when they click
// the popup button

var YtQuickAdd = {

		providedSong: null,
	    ele : function(){ return $('#YtQuickAddBar')},
	    _title : function(){ return $('#YTQATitle')},
	    promptShow : function(ytid) {
	    	var song = new Song(ytid, function(){
	    		//TODO check if song is already in playlist
	    		var playable = YTHelper.isPlayable(song.songId, function (isPlayable) {
	    			if(playable != false) { //getting playable = undefined ..?
	    				YtQuickAdd._renderInfo(song);
	    			}
	    		});
	    	});
	    },
	    promptHide : function( /* optional function */ callback) {
	    	// hide the bar
	    	YtQuickAdd.ele().animate({"top": "-36px"});
	    	YtQuickAdd.providedSong = null;
	    },
	    _renderInfo : function( /* song.js:Song */ song) {
	    	YtQuickAdd.providedSong = song;
	    	YtQuickAdd._title().text(song.name);
	    	YtQuickAdd.ele().animate({"top": "0px"});
	    },
	    _addToPlayList : function() {
	    	Player.addSongById(YtQuickAdd.providedSong.songId);
	    	//some visual feedback to the user
	    	$('#YTQAYes').css({
	    		color: "rgba(0, 128, 0, 0.85)",
	    		"border-color" : "rgba(0, 128, 0, 0.85)"
	    	});

	    	YtQuickAdd.promptHide(function(){
	    		$('#YTQAYes').css({
			    	color: "",
			    	"border-color" : ""
	    		});
	    	});
	    }
};

// close if clicked outside the alert
$(document).ready(function(){
	$('#content').click(function(){
		YtQuickAdd.promptHide();
	});
	$('#YTQANo').click(function(){
		YtQuickAdd.providedSong = null;
		YtQuickAdd.promptHide();
	});
	$('#YTQAYes').click(function(){
		YtQuickAdd._addToPlayList();
	});
});