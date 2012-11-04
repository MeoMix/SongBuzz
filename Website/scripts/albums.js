define(['audioScrobbler', 'levenshtein', 'backend', 'ytHelper', 'songDecorator'],
    function (audioScrobbler, levenshtein, backend, ytHelpers, songDecorator) {
        'use strict';
        window.albums = {};
        albums.showAlbumDialogue = function (node) {
			//Pop up popup
			$("#popup").addClass("popupvisible");
			var mbid = $(node).parent("tr").attr("data-albumid")
			var album = $(node).parent("tr").attr("data-album")
			var artist = $(node).parent("tr").attr("data-artists")
			albums.drawPopup(mbid, album, artist)
        };
        albums.drawPopup = function (mbid, album, artist) {
			var popup = $("#popup")
			var format = "json"
			var apiKey = "29c1ce9127061d03c0770b857b3cb741"
			if (mbid == "" || mbid == undefined) {
				audioScrobbler.getAlbumInfo("", albums.asCallback, album, artist);
			}
			else {
				audioScrobbler.getAlbumInfo(mbid, albums.asCallback);
			}
			
        }
        albums.asCallback = function(json, mbid) {
				if (json.error != undefined) {
					$("<h2>").text(json.message).appendTo(popup);
				}
				else {
					var album = json.album;
					var albumtitle = album.name,
					albumauthor = album.artist,
					listeners = album.listners,
					releasedate = album.releasedate,
					summary = album.wiki != undefined ? album.wiki.summary  : "",
					tracks = album.tracks.track,
					albumcover = album.image.length > 3 ? album.image[3]['#text'] : album.image[length-1]["#text"];
				$("<h2>").text(albumtitle).attr("data-mbid", mbid).appendTo(popup);
				$("<h3>").text(albumauthor).appendTo(popup);
				$("<p>").html(summary).appendTo(popup);
				$("<img>", {
					src: albumcover,
					class: "album"
				}).appendTo(popup)
				$("<div>", {
					id: "album-recognize-all",
					class: "button"
				}).text(s.recognizeAll[language]).appendTo(popup)
				albums.buildAlbumList(tracks);
				}
			}
        albums.buildAlbumList = function(tracks) {
			var table = $("<table>")
			if (tracks.length == undefined) {
				var tr = albums.buildAlbumTableRow(0,tracks);
				tr.appendTo(table);
			}
			else {
				$.each(tracks, function(key,track) {
					var tr = albums.buildAlbumTableRow(key,track)
					tr.appendTo(table)
				})
			}
			table.appendTo(popup)
			albums.checkIfInDataBase(tracks);

		}
        albums.buildAlbumTableRow = function(key,track) {
			var db = libraryController.getSongs("songs");
			var tr = $("<tr>").addClass("song").addClass("mbid-"+track.mbid).addClass("db-pending").attr({
				"data-duration": track.duration,
				"data-mbid": track.mbid
			});

				$("<td>").addClass("").appendTo(tr);
				$("<td>").text(key+1).appendTo(tr);
				$("<td>").addClass("album-list-title").text(track.name).appendTo(tr);
				$("<td>").text(Helpers.prettyPrintTime(track.duration)).appendTo(tr);
				$("<td>").addClass("db-status").text("Checking...").appendTo(tr);
				$("<td>").addClass("db-recognize").text(strings.recognize[language]).appendTo(tr);
					$.each(db, function(k,v) {
				if (v.title == track.name) {
					tr.removeClass("db-pending").addClass("recognized in-library")
					tr.find(".db-status").text(s.inLibrary[language])
					albums.bindTrackToDOM(v, tr)
				}
			})
				return tr
		}
        albums.checkIfInDataBase = function(tracks) {
			var array = []
			$.each(tracks, function(k,v) {
				if (v.mbid == "") {
					$(".db-pending").eq(k).removeClass("db-pending").addClass("db-not-in-db").find("td.db-status").text(s.notInDataBase[language]);
				}
				array.push(v.mbid)
			})
			var csv = array.join(",")
				var url = "http://songbuzz.host56.com/backend/songs/checkmbid.php"
				var data = {
					"mbids": csv
				}
			$.ajax({
				url: url,
				data: data,
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
					var songs = libraryController.getSongs()
					$(".db-pending").removeClass("db-pending").addClass("db-not-in-db").find("td.db-status").text(s.notInDataBase[language])
				}
			})
		}
        albums.recognizeAll = function() {
			$(".db-not-in-db .db-recognize").click()
		}
        albums.recognizeTrack = function (node) {
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
                songDecorator.decorateWithYouTubeInformation(foundVideo, song, function (song, json) {
                    if (json.error != undefined) {
                        $(nodeParent).find(".db-recognize").text("Track not found");
                    }

                    song.lastfmid = json.track.id;
                    song.artistsid = json.track.artist.mbid;

                    backend.saveData(song, true);
                    albums.bindTrackToDOM(song, nodeParent);
                    $(nodeParent).find(".db-status").text(s.inDatabase[language]);
                    $(nodeParent).find(".db-recognize").text(s.addToLibrary[language]);
                });
            });
        };

        albums.bindTrackToDOM = function (song, node) {
            $(node).addClass("recognized db-in-db").removeClass("db-not-in-db")
            $.each(song, function (a, b) {
                $(node).attr("data-" + a, b)
            });
        };
    })
