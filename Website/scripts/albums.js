define(['audioScrobbler', 'backend', 'ytHelper', 'songDecorator', 'libraryController', 'playlists'],
 function (audioScrobbler, backend, ytHelpers, songDecorator, libraryController, playlists) {
    'use strict';

    //Private functions:
	var buildAlbumList = function(tracks) {
		var table = $("<table>");
		if (tracks.length == undefined) {
			var albumTableRow = buildAlbumTableRow(0, tracks);
			albumTableRow.appendTo(table);
		}
		else {
			$.each(tracks, function(key,track) {
				var albumTableRow = buildAlbumTableRow(key, track)
				albumTableRow.appendTo(table)
			})
		}

		table.appendTo(popup);
		checkIfInDataBase(tracks);
	};

	var asCallback = function(json, mbid) {
		if (json.error != undefined) {
			$("<h2>", {
				text: json.message
			}).appendTo(popup);
		}
		else {
			var album = json.album;
			
			$("<h2>", {
				text: album.name,
				'data-mbid': mbid
			}).appendTo(popup);

			$("<h3>", {
				text: album.artist
			}).appendTo(popup);

			$("<p>", {
				html: album.wiki ? album.wiki.summary : ''
			}).appendTo(popup);

			var albumcover = album.image.length > 3 ? album.image[3]['#text'] : album.image[length-1]['#text'];
			$("<img>", {
				src: albumcover,
				'class': "album"
			}).appendTo(popup);

			$("<div>", {
				id: "album-recognize-all",
				'class': "button",
				text: s.recognizeAll[language]
			}).appendTo(popup);
			$("<div>", {
				id: "album-addasplaylist",
				'class': "button",
				text: s.addasplaylist[language]
			}).appendTo(popup);

			buildAlbumList(album.tracks.track);
		}
	};

	var drawPopup = function (mbid, album, artist) {
		var popup = $("#popup")
		var format = "json"
		var apiKey = "29c1ce9127061d03c0770b857b3cb741"
		if (mbid == "" || mbid == undefined) {
			audioScrobbler.getAlbumInfo("", asCallback, album, artist);
		}
		else {
			audioScrobbler.getAlbumInfo(mbid, asCallback);
		}
    };

	var buildAlbumTableRow = function(key,track) {
		var songs = libraryController.getSongs("songs");
		var albumTableRow = $("<tr>", {
			'class': 'song db-pending ' + 'mbid-' + track.mbid,
			'data-duration': track.duration,
			'data-mbid': track.mbid
		});

		$("<td>").appendTo(albumTableRow);
		$("<td>", {
			text: key + 1
		}).appendTo(albumTableRow);

		$("<td>", {
			'class': 'album-list-title',
			text: track.name
		}).appendTo(albumTableRow);

		$("<td>", {
			text: Helpers.prettyPrintTime(track.duration)
		}).appendTo(albumTableRow);

		$("<td>", {
			'class': 'db-status',
			text: 'Checking...'
		}).appendTo(albumTableRow);

		$("<td>", {
			'class': 'db-recognize',
			text: strings.recognize[language]
		}).appendTo(albumTableRow);

		$.each(songs, function() {
			if (this.title == track.name) {
				albumTableRow.removeClass("db-pending").addClass("recognized in-library");
				albumTableRow.find(".db-status").text(s.inLibrary[language]);
				bindTrackToDOM(this, albumTableRow);
			}
		});
			
		return albumTableRow;
	};

    var checkIfInDataBase = function(tracks) {
		var array = []
		$.each(tracks, function(k,v) {
			if (v.mbid == "") {
				$(".db-pending").eq(k).removeClass("db-pending").addClass("db-not-in-db").find("td.db-status").text(s.notInDataBase[language]);
			}
			array.push(v.mbid)
		});

		$.ajax({
			url: "http://songbuzz.host56.com/backend/songs/checkmbid.php",
			data: {
				"mbids": array.join(",")
			},
			dataType: "json",
			success: function(json) {
				$.each(json, function(k,v) {
					if (v.mbid != "") {
						var songdiv = $(".mbid-"+v.mbid).removeClass("db-pending db-not-in-db").addClass("db-in-db").addClass("recognized")
						$(".mbid-"+v.mbid+":not(.in-library)").find(".db-status").text(s.inDatabase[language]);
						$(".mbid-"+v.mbid+":not(.in-library)").find(".db-recognize").text(s.addToLibrary[language]);
						$.each(v, function(a,b) {
							songdiv.attr("data-"+a,b)
						})
					}
				})
				var songs = libraryController.getSongs("songs")
				$(".db-pending").removeClass("db-pending").addClass("db-not-in-db").find("td.db-status").text(s.notInDataBase[language]);
				recognizeAll()
			}
		})
	};

	var bindTrackToDOM = function (song, node) {
        $(node).addClass("recognized db-in-db").removeClass("db-not-in-db")
        $.each(song, function (a, b) {
            $(node).attr("data-" + a, b)
        });
    };
    var recognizeAll = function() {
			$(".db-not-in-db .db-recognize").click();
	}
   	//Public methods
    return {
		recognizeAll: recognizeAll,
		addAlbumAsPlaylist: function() {
			var playlistname = $("#popup h3").text() + " - " + $("#popup h2").text()
			playlists.addPlaylist(playlistname);
			var songs = $("#popup .recognized");
			$.each(songs, function(k, songdiv) {
				var song = libraryController.makeSongOutOfTr(songdiv)
				playlists.addSongToPlaylist(playlistname, song)
			})
		},
    	showAlbumDialogue: function (node) {
			//Pop up popup
			$("#popup").addClass("popupvisible");
			var mbid = $(node).parent("tr").attr("data-albumid");
			var album = $(node).parent("tr").attr("data-album");
			var artist = $(node).parent("tr").attr("data-artists");
			drawPopup(mbid, album, artist);
	    },
	    recognizeTrack: function (node) {
	    	var nodeParent = node.parent();

	        var song = {
	            hoster: "youtube",
	            duration: parseFloat($(nodeParent).attr("data-duration")),
	            title: $(nodeParent).find(".album-list-title").text(),
	            artists: $("#popup h3").text(),
	            album: $("#popup h2").text(),
	            cover: $("#popup img").attr("src"),
	            mbid: $(nodeParent).attr("data-mbid"),
	            albumid: $("#popup h2").attr("data-mbid"),
	            artistsid: $("#popup h3").attr("data-mbid")
	        };

	        ytHelpers.findVideo(song, function (foundVideo) {
	            songDecorator.decorateWithYouTubeInformation(foundVideo, song, undefined,function(song, json) {
	                if (json.error != undefined) {
	                    $(nodeParent).find(".db-recognize").text("Track not found");
	                }

	                song.lastfmid = json.track.id;
	                song.artistsid = json.track.artist.mbid;

	                backend.saveData(song, true);
	                bindTrackToDOM(song, nodeParent);
	                $(nodeParent).find(".db-status").text(s.inDatabase[language]);
	                $(nodeParent).find(".db-recognize").text(s.addToLibrary[language]);
	            });
	        });
    	}
    };
})
