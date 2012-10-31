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
		 		authkey: localStorage['authKey']
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
		addSong: function(song, list) {
			var array = $.parseJSON(localStorage.songs);
			array.push(song);
			localStorage.songs = JSON.stringify(array);
			libraryController.drawTable(list)
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
			var data = {
				"song": lastfmid,
				"authkey": localStorage["authKey"],
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
			console.log(songs);
			var data = {
				"songs": songs.join(","),
				"authkey": localStorage["authKey"],
				"list": list
			}
			$.ajax({
				url: "http://songbuzz.host56.com/backend/fb/compareSongs.php",
				data: data,
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
			var labels = ["Title", "Artist", "Album"];
			$.each(labels, function(k,v) {
				$("<th>").text(v).appendTo(th)
			})
			th.appendTo(table)
			$.each(songs, function(key,value) {
				console.log(value)
				var tr = $("<tr>", {
					class: "song song-list",
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
					"data-length": value.length,
					"data-plays": value.plays,
					"data-title": value.title,
				})
				$("<td>").text(value.title).appendTo(tr);
				$("<td>").text(value.artists).appendTo(tr);
				$("<td>").text(value.album).appendTo(tr)
				tr.appendTo(table)
			})
			table.appendTo("#songtable")
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
			console.log(song)
			$("#now-cover").attr("src", song.cover);
		}
	}