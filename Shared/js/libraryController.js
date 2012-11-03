	window.libraryController = {
		start: function() {
			if (localStorage.songs == "null" || localStorage.songs == null || localStorage.songs == undefined || localStorage.songs == "undefined") {
				localStorage.songs = "[]";
				libraryController.loadAllSongs();
			}
			else {
				libraryController.compareSongs("songs");
				libraryController.drawTable("songs");
			}
		},
		loadAllSongs: function() {
		 	var data = {
		 		authkey: localStorage['authkey']
		 	}
		 	var url = "http://songbuzz.host56.com/backend/fb/loadSongs.php"
		 	$.ajax({
		 		url: url,
		 		data: data,
		 		dataType: "json",
		 		success: function(json) {
		 			$.each(json, function(key, song) {
		 				libraryController.addSong(song, "songs");
		 			})
		 			libraryController.drawTable("songs")
		 		}
		 	})
		},
		addToHistory: function(song) {
			previousSongs.push(song);
			return previous;
		},
		addToQueue: function(song,where) {
			if (where == "end") {
				comingUp.push(song)
			}
			else if (where == "start") {
				comingUp.reverse()
				comingUp.push(song)
				comingUp.reverse()
			}
		},
		addSong: function(song, list) {
			var array = $.parseJSON(localStorage.songs);
			if (libraryController.checkIfExists(song, list) == true) {
				console.log("Track already in library!")
			}
			else {
				array.push(song);
				localStorage.songs = JSON.stringify(array);
				libraryController.updateTable(list)
			}
		},
		checkIfExists: function(bsong, list) {
			var exists = false;
			var songs = libraryController.getSongs(list);
			$.each(songs, function(key, asong) {
				if (asong.lastfmid == bsong.lastfmid) {
					exists = true
				}
			})
			return exists;

		},
		removeSong: function(lastfmid, list) {
			list = (list == undefined) ? "songs" : list;
			var array = $.parseJSON(localStorage.songs);
			$.each(array, function(key,value) {
				if (value.lastfmid == lastfmid) {
					array.splice(key,1);
					return false;
				}
			})
			localStorage.songs = JSON.stringify(array);
			libraryController.updateTable(list);
			var data = {
				"song": lastfmid,
				"authkey": localStorage["authkey"],
				"list": list
			}
			$.ajax({
				url: "http://songbuzz.host56.com/backend/fb/removeSong.php",
				data: data,
				dataType: "json",
				success: function(json) {
				}
			})
		},
		getSongs: function(list) {
			return $.parseJSON(localStorage[list]);
		},
		compareSongs: function(list) {
			var list = (list == undefined) ? "songs" : list;
			var songs = [];
			$.each(libraryController.getSongs(list), function(k,v) {
				songs.push(v.lastfmid)
			})
			var joinedsongs = songs.join(",");
			var authkey = localStorage["authkey"]
			$.ajax({
				url: "http://songbuzz.host56.com/backend/fb/compareSongs.php?songs=" + joinedsongs + "&authkey=" + authkey + "&list=" + list,
				dataType: "json",
				success: function(json) {
					$.each(json.add, function(k,v) {
						libraryController.addSong(v, list);
					})
					$.each(json.remove, function(k,v) {
						libraryController.removeSong(v, list)
					})
				}
			})
		},
		drawTable: function(list) {
			$("#songtable").html("")
			var songs = libraryController.getSongs(list);
			var table = $("<table>", {
				id: "thetable",
				border: 0
			})
			var th = $("<tr>")
			var labels = ["","Title","Duration", "Artist", "Album"];
			$.each(labels, function(k,v) {
				$("<th>").text(v).appendTo(th)
			})
			th.appendTo(table)
			$.each(songs, function(key,value) {
				(libraryController.buildTableRow(value)).appendTo(table)
			})
			table.appendTo("#songtable")
		},
		buildTableRow: function(value) {
			var tr = $("<tr>", {
					class: "song song-list recognized in-library",
					"data-title": value.title,
					"data-artists": value.artists,
					"data-album": value.album,
					"data-albumid": value.albumid,
					"data-artistsid": value.artistsid,
					"data-countries": value.countries,
					"data-cover": value.cover,
					"data-hoster": value.hoster,
					"data-hosterid": value.hosterid,
					"data-lastfmid": value.lastfmid,
					"data-durarion": value.duration,
					"data-plays": value.plays,
					"data-title": value.title,
				})
				$("<td>").addClass("playing-indicator").appendTo(tr);
				$("<td>").text(value.title).appendTo(tr);
				$("<td>").text(Helpers.prettyPrintTime(value.duration)).appendTo(tr)
				$("<td>").text(value.artists).appendTo(tr);
				$("<td>").addClass("list-album").text(value.album).appendTo(tr)
				return tr
		},
		updateTable: function(list) {
			//Get the table songs
			var tablesongs = $("#thetable .song");
			var tablesongsarray = []
			$.each(tablesongs, function(key, value) {
				tablesongsarray.push(libraryController.makeSongOutOfTr($(value)));
			})
			//Get the songs
			var songs = libraryController.getSongs(list);
			//Compare!
			$.each(songs, function(key,value) {
				//Add songs that must be added!
				var isthere = false;
				$.each(tablesongsarray, function(k,v) {
					if (value.lastfmid == v.lastfmid) {
						isthere = true
					}
				})
				if (isthere == false) {
					var tr = libraryController.buildTableRow(value);
					tr.appendTo("#thetable")
				}
			})
			$.each(tablesongsarray, function(key,value) {
				//Remove songs that must be removed!
				var isthere = false;
				$.each(songs, function(k,v) {
					if (value.lastfmid == v.lastfmid) {
						isthere = true
					}
				})
				if (isthere == false) {
					console.log(value)
					$(".song[data-hosterid="+value.hosterid+"]").remove()
				}
			})

		},
		isLoggedIn: function() {
			if (localStorage['name']) {
				return true
			}
			else {
				return false;
			}
		},
		playSong: function(song) {
			$("#now-cover").attr("src", song.cover);
			if (ytplayerready) {
				ytplayer.loadVideoById(song.hosterid)
				nowPlaying = song;
				$(".song").removeClass("nowplaying")
				$(".song[data-lastfmid="+song.lastfmid+"]").addClass("nowplaying")
			}
			$.ajax({
				url: "http://songbuzz.host56.com/backend/songs/listen.php",
				data: {"songid": song.lastfmid},
				dataType: "json",
				success: function(json) {
					console.log("Now playing: ", song, "Listen added.");
				}
			})
		},
		isPlaying: function() {
			if (ytplayer.playerState == 1) {
				return true
			}
			else {
				return false;
			}
		},
		playNext: function() {
			libraryController.addToHistory(nowPlaying);
			if (comingUp.length == 0) {
				var songtoplay = endQueue.slice(0,1)
				libraryController.playSong(libraryController.makeSongOutOfTr($(songtoplay)));
				endQueue = $(".nowplaying").nextAll(".song")
			}
			else {
				//This line removes the first element of the array
				//and plays it
				var songtoplay = comingUp.shift()
				libraryController.playSong(songtoplay);

			}
		},
		playPrevious: function() {
			libraryController.addToQueue(nowPlaying, "start");
			//This line gets the song to play and takes it from the history
			var songtoplay = previousSongs.pop()
			libraryController.playSong(songtoplay);

		},
		makeSongOutOfTr: function(node) {
			var attrs = ["album", "albumid", "artists", "artistsid", "countries", "cover", "duration", "hoster", "hosterid", "lastfmid", "title"]
			var song = {}
			$.each(attrs, function(key, value) {
				song[value] = node.attr("data-" + value);
			})
			return song;
		}
 	}