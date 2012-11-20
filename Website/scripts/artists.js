define(["libraryController", "audioScrobbler", "albums"], function(libraryController, audioScrobbler, albums) {
	return {
		drawPage: function(artist) {
			//Check if an mbid or artist name was passed
			if (artist.indexOf("mbid-") != -1) {
				//MBID was passed
				var mbid = artist.substr(5)
				var parameter = "?mbid=" + mbid
			}
			else {
				//Artistname was passed
				var parameter = "?artist=" + artist
			}
			audioScrobbler.searchArtistInfo(parameter, function(json) {
				console.log(json)
				var artistdiv = $("<div>")
				var artistheader = $("<div>", {id: "artistheader"})
				var tags = $("<div>", {id: "artisttags"})
				if (json.artist != undefined) {
					var artist = json.artist
					if (artist.image) {
						$("<img>", {
							src: artist.image[artist.image.length-1]['#text'],
							class: "artistspage-headerimage"
						}).appendTo(artistdiv)
					}
					if (artist.name != undefined) {
						$("<h1>").text(artist.name).appendTo(artistheader)
					}
					if (artist.tags != undefined) {
						$.each(artist.tags.tag, function(key, value) {
							$("<div>", {
								class: "tag"
							}).text(value.name).appendTo(tags)
						})
					}
					if (artist.similar != undefined) {
						var similarartistdiv = $("<div>", {
							class: "similarartistdiv"
						})
						$("<p>").text(s.similarartists[language]).appendTo(similarartistdiv)
						$.each(artist.similar.artist, function(key,simartist) {
							$("<img>", {
								src: simartist.image[1]['#text'],
								"data-navigate": "Artist/" +simartist.name,
								class: 'similarartist',
								'data-artist': simartist.name
							}).appendTo(similarartistdiv)
						})
						similarartistdiv.appendTo(artistheader) 
					}
				}
				tags.appendTo(artistheader)
				artistheader.appendTo(artistdiv)
				artistdiv.appendTo("#songtable")
				audioScrobbler.getTopAlbums(parameter, function(json) {
					//Draw album list
					var loopAlbum = function(k,album) {
						//Only draw 5 albums
						if (k < 5) {
							var mbid = album.mbid,
								title = album.name,
								artist = album.artist.name
							var albumListCallback = function(table, tracks, popup) {
								var albumdiv = $("<div>", {
									class: "artistpage-album"
								})
								var albumstring = (mbid == "") ? title + "_" + artist : mbid;
								$("<h2>", {
									"data-navigate": "Album/" + albumstring,
									class: "link"
								}).text(title).appendTo(albumdiv)
								$("<img>", {
									src: (_.last(album.image))['#text'],
									class: 'artistpage-cover'
								}).appendTo(albumdiv)
								$(table).appendTo(albumdiv)
								albumdiv.appendTo(artistdiv)
								albums.checkIfInDataBase(table, tracks)
							}
							if (mbid != "") {
								audioScrobbler.getAlbumInfo(albumListCallback, mbid, albums.asCallback);
							}
							else {
								audioScrobbler.getAlbumInfo(albumListCallback, "", albums.asCallback, title, artist);
							}
						}
						}
					if (json.topalbums != undefined) {
						//1 album or multiple?
						if (json.topalbums.album.length == undefined) {
							loopAlbum(0, json.topalbums.album)
						}
						else {
							$.each(json.topalbums.album, loopAlbum)
						}
						
					}
				})
			})
		}
	}
})