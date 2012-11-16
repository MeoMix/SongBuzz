define(["libraryController", "audioScrobbler"], function(libraryController, audioScrobbler) {
	"use strict";
	var searchLastFm = function() {

	}
	return {
		buildQuery: function() {
			var query = $("#searchinput").val();
			if (query !=  "") {
				$("#autocomplete").show()
				audioScrobbler.searchAlbum(query, function(json) {
					$("#auto-albums").html("")
					if (typeof json.results.albummatches != "string") {
						$.each(json.results.albummatches.album, function(key, album) {
							if (album.image != undefined)
							var image = album.image[0]["#text"];
							var albumname = album.name;
							var albumartist = album.artist;
							var mbid = album.mbid
							var navigate = (mbid == undefined || mbid == "") ? "Album/" + albumname + "_" + albumartist : "Album/" + mbid
							var albumdiv = $("<div>", {
								class: 'searchresult',
								'data-navigate': navigate
							})
							$("<img>", {
								src: image,
								class: 'search-album-cover'
							}).appendTo(albumdiv)
							$("<div>", {
								class: 'search-title'
							}).text(albumname).appendTo(albumdiv)
							$("<div>", {
								class: 'search-subtitle'
							}).text(albumartist).appendTo(albumdiv)
							$("#auto-albums").append(albumdiv)
						})
					}
				})
			}
			else {
				$("#autocomplete").fadeOut(200);
			}
			
		}
	}
})