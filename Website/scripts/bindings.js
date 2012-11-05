define(['albums', 'libraryController'], function(albums, libraryController) {
	'use strict';

	var constructor = _.once(function(){
		return {
			//Setup a played recently array!
			previousSongs: [],
			nowPlaying: null,
			comingUp: [],
			//Is being used when comingUp is empty
			endQueue: []
		};
	});

	//Add a yellow background when clicked.
	//To play, the user must doubleclick.
	$(document).on('click', '.recognized', function() {
		$(".song").removeClass("selected")
		$(this).addClass("selected")
	}).on('dblclick', '.recognized', function() {
		//Remove all other nowplaying classes and give them to this one
		$(".song").removeClass("nowplaying selected")
		$(this).addClass("selected nowplaying")
		//Defining the <tr> and getting attributes
		var node = $(this)
		var song = libraryController.makeSongOutOfTr(node);
		constructor().endQueue = $(this).nextAll(".recognized")
		libraryController.playSong(song)
	}).on('click', '#play', function() {
		ytplayer.playVideo()
	}).on('click', '#pause', function() {
		ytplayer.pauseVideo()
	}).on('click', '#next', function() {
		libraryController.playNext()
	}).on('click', '#previous', function() {
		libraryController.playPrevious()
	}).on('click', '.list-album', function() {
		albums.showAlbumDialogue($(this));
	}).on('click', '#closepopup', function() {
		$("#popup").removeClass("popupvisible")
		$("#popup").html(this);
	}).on('click', '.db-not-in-db .db-recognize', function() {
		albums.recognizeTrack($(this))
	}).on('click', '.db-in-db .db-recognize', function() {
		var song = libraryController.makeSongOutOfTr($(this).parent(".song"))
		$(this).parent("tr").addClass("in-library").find(".db-status").text(s.inLibrary[language])
		libraryController.addSong(song, "songs")
	}).on('click', '#album-recognize-all', function() {
		albums.recognizeAll()
	}).on('click', '#songtable th', function() {
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
	});

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

	return {
		get previousSongs(){
			return constructor().previousSongs;
		},
		get nowPlaying(){
			return constructor().nowPlaying;
		},
		get comingUp(){
			return constructor().comingUp;
		},
		get endQueue(){
			return constructor().endQueue;
		}
	};
})