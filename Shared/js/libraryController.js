	window.libraryController = {
		//Gets called when website is opened.
		start: function() {
			//No songs saved on the client side? Ok, load them all!
			if (localStorage.songs == "null" || localStorage.songs == null) {
				//Create array in localStorage
				localStorage.songs = "[]";
				libraryController.loadAllSongs();
			}
			//First, check for new songs/deleted songs, then draw the table
			else {
				libraryController.compareSongs("songs");
				libraryController.drawTable("songs");
			}
		},
		//method to load *all* songs from the server. This request can be huge, so it is only called the first time
		loadAllSongs: function() {
			//Authkey is being fetched from localStorage. It is needed and personal for every user.
		 	var data = {
		 		authkey: localStorage['authkey']
		 	}
		 	//Make the AJAX request!
		 	var url = "http://songbuzz.host56.com/backend/fb/loadSongs.php"
		 	$.ajax({
		 		url: url,
		 		data: data,
		 		//Leave this line in for FF support!
		 		dataType: "json",
		 		success: function(json) {
		 			//Loop through received songs and add them to the library
		 			$.each(json, function(key, song) {
		 				libraryController.addSong(song, "songs");
		 			})
		 			//Then, redraw the table!
		 			//The method updateTable is not needed, since no songs are on the table atm
		 			libraryController.drawTable("songs")
		 		}
		 	})
		},
		//Gets called when next song is pressed. 
		//Is needed for making the "previous" button work
		addToHistory: function(song) {
			//previousSongs is a global object
			previousSongs.push(song);
			return previousSongs;
		},
		//Right-click to add to the queue. 
		//Queue songs are always played first, then the auto-generated songs will be played
		addToQueue: function(song,where) {
			//You can specify if you want them at the end of the queue or at the beginning.
			//This is being used for the previous button!
			if (where == "end") {
				comingUp.push(song)
			}
			else if (where == "start") {
				//Add the song to the beginning of the queue
				comingUp.reverse()
				comingUp.push(song)
				comingUp.reverse()
			}
		},
		//Method for adding a song to the library
		addSong: function(song, list) {
			//First, get the songs from the localStorage
			var array = libraryController.getSongs(list)
			//Check if song is not already in library!
			if (libraryController.checkIfExists(song, list) == true) {
				console.log("Track already in library!")
			}
			else {
				//Finally, push it to the array and save it!
				array.push(song);
				localStorage.songs = JSON.stringify(array);
				//Update the table!
				libraryController.updateTable(list)
			}
		},
		//Method for checking if a song is already in the users library
		checkIfExists: function(bsong, list) {
			//Variables asong and bsong are used for checking.
			var exists = false;
			var songs = libraryController.getSongs(list);
			$.each(songs, function(key, asong) {
				//Compare lastfmid's
				if (asong.lastfmid == bsong.lastfmid) {
					exists = true
				}
			})
			return exists;

		},
		//Removes a song from the library!
		removeSong: function(lastfmid, list) {
			//If no list specified, assume that it is the main library
			list = (list == undefined) ? "songs" : list;
			//Get tha songs!
			var array = libraryController.getSongs(list);
			//Loop through songs...
			$.each(array, function(key,value) {
				//...find the song...
				if (value.lastfmid == lastfmid) {
					//..remove it...
					array.splice(key,1);
					return false;
				}
			})
			//...and save it!
			localStorage.songs = JSON.stringify(array);
			//Update th table!
			libraryController.updateTable(list);
			//Wait... did we forget something?
			//Remove the song on the server too!
			var data = {
				"song": lastfmid,
				"authkey": localStorage["authkey"],
				"list": list
			}
			//Make the request to the server!
			$.ajax({
				url: "http://songbuzz.host56.com/backend/fb/removeSong.php",
				data: data,
				dataType: "json",
				success: function(json) {
					//It's gone!
				}
			})
		},
		//Shorthand for getting the songs from the localStorage!
		getSongs: function(list) {
			return $.parseJSON(localStorage[list]);
		},
		//Tricky one, but the hard things are made on the server...
		//Checks which songs need to be added and which should be deleted
		compareSongs: function(list) {
			//If not specified, assume to delete from main list...
			var list = (list == undefined) ? "songs" : list;
			//Make a empty array
			var songs = [];
			//Collect all lastfmid's
			$.each(libraryController.getSongs(list), function(k,v) {
				songs.push(v.lastfmid)
			})
			//Make a CSV to send to the server
			var joinedsongs = songs.join(",");
			//Get authentication
			var authkey = localStorage["authkey"];
			//Make daaaa request!
			$.ajax({
				url: "http://songbuzz.host56.com/backend/fb/compareSongs.php?authkey=" + authkey + "&list=" + list,
				dataType: "json",
				data: {"songs": joinedsongs},
				type: 'POST',
				success: function(json) {
					$.each(json.add, function(k,v) {
						//Loop through songs to add and add them!
						libraryController.addSong(v, list);
					})
					$.each(json.remove, function(k,v) {
						//Loop through songs to remove and remove them!
						libraryController.removeSong(v, list)
					})
				}
			})
		},
		//Calls drawTable with exta parameters. Valid values for sort are title, artist*s* and album as well as duration
		sortTable: function(sort, reverse) {
			var currentList = $("#songtable").attr("data-list")
			libraryController.drawTable(currentList, sort, reverse)
		},
		//Draws the whole song list!
		drawTable: function(list, sort, reverse) {
			//First, clear the table and add the list name to it
			$("#songtable").html("").attr("data-list", list);
			//Get daaa songs!
			var songs = libraryController.getSongs(list);
			//If it should sort, sort it!
			if (sort) {
				//Underscore FTW!
				var songs = _.sortBy(libraryController.getSongs(list), function(song) {return song[sort]})
			}
			//Descending? Reverse the array!
			if (reverse) {
				var songs = songs.reverse()
			}
			//Make a table!
			var table = $("<table>", {
				id: "thetable",
				border: 0
			})
			//Make a table header!
			var th = $("<tr>")
			//first value is table header label, second is sort value!
			var labels = [["", ""],["Title", "title"],["Duration","duration"], ["Artists", "artists"], ["Album", "album"]];
			//Add the table headers!
			$.each(labels, function(k,v) {
				var td = $("<th>").text(v[0]).attr("data-sort-key", v[1])
				if (sort == v[1]) {
					//Add classes for sorting
					var asordesc = (reverse == true) ? "descending" : "ascending"
					td.addClass(asordesc + " sorted")
				}
				td.appendTo(th)
			})
			th.appendTo(table)
			//Make a table row to add to the table!
			$.each(songs, function(key,value) {
				(libraryController.buildTableRow(value)).appendTo(table)
			})
			//Make it visibleè
			table.appendTo("#songtable")
		},
		//Makes a table song
		buildTableRow: function(value) {
			var tr = $("<tr>", {
					//song class specifies everything which is a song and has metadata attached to the dom
					//song-list class specified everything which is in a song list
					//recognized class specifies every recognized song
					//in-library class specifies songs who are in the users library regardless the current list
					class: "song song-list recognized in-library",
					//Add metdata to it!
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
					"data-duration": value.duration,
					"data-plays": value.plays,
					"data-title": value.title,
				})
				//The cells...
				$("<td>").addClass("playing-indicator").appendTo(tr);
				$("<td>").text(value.title).appendTo(tr);
				$("<td>").text(Helpers.prettyPrintTime(value.duration)).appendTo(tr)
				$("<td>").text(value.artists).appendTo(tr);
				$("<td>").addClass("list-album").text(value.album).appendTo(tr)
				return tr
		},
		//Does not redraw the table, only updates it!
		//Currently does not work with sorting
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
		//Authenticated through Facebook?
		isLoggedIn: function() {
			if (localStorage['name']) {
				return true
			}
			else {
				return false;
			}
		//Let's make some musssic!
		playSong: function(song) {
			$("#now-cover").attr("src", song.cover);
			//YouTube global variable
			if (ytplayerready) {
				//load into player
				ytplayer.loadVideoById(song.hosterid)
				//Global variable
				nowPlaying = song;
				//remove from every other song which is being stopped
				$(".song").removeClass("nowplaying")
				//Add class to current song
				$(".song[data-lastfmid="+song.lastfmid+"]").addClass("nowplaying")
			}
			//Add +1 listen to the server!
			$.ajax({
				url: "http://songbuzz.host56.com/backend/songs/listen.php",
				data: {"songid": song.lastfmid},
				dataType: "json",
				success: function(json) {
					console.log("Now playing: ", song, "Listen added.");
				}
			})
		},
		//Check if song is playing
		isPlaying: function() {
			if (ytplayer.playerState == 1) {
				return true
			}
			else {
				return false;
			}
		},
		//Move to the next track!
		playNext: function() {
			//Add current to history
			libraryController.addToHistory(nowPlaying);
			//If no songs are in the user queue, continue with auto-generated songs
			if (comingUp.length == 0) {
				//Remove the first song in the queue and return it
				var songtoplay = endQueue.slice(0,1)
				//Make song out of talbe row and play it
				libraryController.playSong(libraryController.makeSongOutOfTr($(songtoplay)));
				//Autogenerate new songs
				endQueue = $(".nowplaying").nextAll(".song")
			}
			else {
				//This line removes the first element of the array
				//and plays it
				var songtoplay = comingUp.shift()
				libraryController.playSong(songtoplay);

			}
		},
		//Plays the previous song
		playPrevious: function() {
			//when pressing forward, the nowplaying song will be played
			libraryController.addToQueue(nowPlaying, "start");
			//This line gets the song to play and takes it from the history
			var songtoplay = previousSongs.pop()
			//Turn it up
			libraryController.playSong(songtoplay);

		},
		//Makes a song object out of the metadata saved in the DOM
		makeSongOutOfTr: function(node) {
			var attrs = ["album", "albumid", "artists", "artistsid", "countries", "cover", "duration", "hoster", "hosterid", "lastfmid", "title"]
			var song = {}
			$.each(attrs, function(key, value) {
				song[value] = node.attr("data-" + value);
			})
			return song;
		}
 	}