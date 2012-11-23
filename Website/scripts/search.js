define(["libraryController", "audioScrobbler"], function(libraryController, audioScrobbler) {
	"use strict";
	return {
		buildQuery: function() {
			var query = $("#searchinput").val();
			if (query !=  "") {
				audioScrobbler.searchAlbum(query, function(json) {
					$("#autocomplete").show()
					if (typeof json.results.albummatches != "string") {
						$("#auto-albums").html("")
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
				audioScrobbler.searchArtist(query, function(json) {
					$("#autocomplete").show()
					if (typeof json.results.artistmatches != "string") {
						$("#auto-artists").html("")
						var callback = function(key, artist) {
							if (artist.image != undefined)
							var image = artist.image[0]["#text"];
							var artistname = artist.name;
							var mbid = artist.mbid
							var navigate = (mbid == undefined || mbid == "") ? "Artist/" + artistname : "Artist/mbid-" + mbid
							var artistdiv = $("<div>", {
								class: 'searchresult',
								'data-navigate': navigate
							})
							$("<img>", {
								src: image,
								class: 'search-album-cover'
							}).appendTo(artistdiv)
							$("<div>", {
								class: 'search-title'
							}).text(artistname).appendTo(artistdiv)
							$("#auto-artists").append(artistdiv)
						}
						console.log(json.results.artistmatches.artist[0])
						if (json.results.artistmatches.artist[0] == undefined) {
							callback(0, json.results.artistmatches.artist)
						}
						else {
							$.each(json.results.artistmatches.artist, callback)
						}
						
					}
				})
			}
			else {
				$("#autocomplete").fadeOut(200);
			}
			
		}
	}
})