define(function() {
	'use strict';
	//Setup a played recently array!
window.previousSongs = [];
window.nowPlaying = null;
window.comingUp = [];
//Is being used when comingUp is empty
window.endQueue = [];


//Add a yellow background when clicked.
//To play, the user must doubleclick.
$(".recognized").live("click", function() {
	$(".song").removeClass("selected")
	$(this).addClass("selected")
})
//Play a song!
.live("dblclick", function() {
	//Remove all other nowplaying classes and give them to this one
	$(".song").removeClass("nowplaying selected")
	$(this).addClass("selected nowplaying")
	//Defining the <tr> and getting attributes
	var node = $(this)
	var song = libraryController.makeSongOutOfTr(node);
	endQueue = $(this).nextAll(".recognized")
	libraryController.playSong(song)
})
$("#play").live("click", function() {
	ytplayer.playVideo()
})
$("#pause").live("click", function() {
	ytplayer.pauseVideo()
})
$("#next").live("click", function() {
	libraryController.playNext()
})
$("#previous").live("click", function() {
	libraryController.playPrevious()
})
$(".list-album").live("click", function() {
	albums.showAlbumDialogue($(this));
})
$("#closepopup").live("click", function() {
	$("#popup").removeClass("popupvisible")
	$("#popup").html(this);
})
$(".db-not-in-db .db-recognize").live("click", function() {
	albums.recognizeTrack($(this))
})
$(".db-in-db .db-recognize").live("click", function() {
	var song = libraryController.makeSongOutOfTr($(this).parent(".song"))
	$(this).parent("tr").addClass("in-library").find(".db-status").text(s.inLibrary[language])
	libraryController.addSong(song, "songs")
})
$("#album-recognize-all").live("click", function() {
	albums.recognizeAll()
})
$("#songtable th").live("click", function() {
	var node = $(this)
	node.siblings().removeClass("ascending descending sorted");
	var sort = node.attr("data-sort-key");
	if (node.hasClass("descending")) {
		libraryController.sortTable(sort);
	}
	else if (node.hasClass("ascending")) {
		libraryController.drawTable($("#songtable").attr("data-list"))
	}
	else {
		libraryController.sortTable(sort, true)
	}
})
window.updateIcon = function(newState) {
	if (newState == 0) {
		libraryController.playNext()
	}
	if (newState == 0 || newState == 1) {
		$("#play").hide()
		$("#pause").show()
	}
	else {
		$("#play").show()
		$("#pause").hide()
	}
}
})