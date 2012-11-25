//This file handles all navigation and is capable of making a site hierarchy

define(['playlists', 'libraryController', 'audioScrobbler', 'albums', 'artists'], function(playlists, libraryController, audioScrobbler, albums, artists) {
	var menu = {
		"Playlists": function(name) {
			//Just draw the table and pass in the playlist name
			libraryController.drawTable(["playlists", name]);
		},
		"Library": function(name) {
			name = formatstring(name)
			//Pass in the name of the list ("songs" and in future also "favorites")
			libraryController.drawTable(name)
		},
		"Feeds": function(name) {
			name = formatstring(name)
			//Remove spaces and make it lowercase
			//Fetch the feed from the server
			var domain = "http://songbuzzapp.com/backend/songs";
			//Make the request and draw the table
			$.getJSON(domain + "/" + name + ".php", function(json) {
				libraryController.drawTable(json)
			})
		},
		"Album": function(name) {
			var popup = $("#songtable").addClass("albumlist").html("")
        	var format = "json"
        	var apiKey = "29c1ce9127061d03c0770b857b3cb741"
        	//Let's do it like this: If the string contains a _, then it is meant as album
        	//and artist, if not, then as mbid
        	var drawTable = function(table, tracks, popup) { 
        	    table.appendTo(popup);
        		albums.checkIfInDataBase(table, tracks);
        	}
        	if (name.indexOf("_") != -1) {
        		var album = name.substr(0,name.indexOf("_")),
        			artist = name.substr(name.indexOf("_")+1)
        	    audioScrobbler.getAlbumInfo(drawTable, "", albums.asCallback, album, artist);
        	}
        	else {
        	    audioScrobbler.getAlbumInfo(drawTable, name, albums.asCallback);
        	}
		},
		"Artist": function(name) {
			$("#songtable").html("").addClass("artistpage")
			artists.drawPage(name)
		}
	}
	var formatstring = function(name) {
		return name.replace(/ /g, "").toLowerCase()
	}
	var to = function(to) {
			//TODO: method fails when album name contains a /. F.e: "One Day / Reckoning song"
			console.log("Navigated to:", to)
			//Split the navigation into a hierarchy. f.e.: "Playlists/Cool music" into ["Playlist", "Cool music"]
			var array = to.split("/");
			//Get the menu
			var obj = menu
			//Access the menu... f.e.: turns into menu["Playlist"]("Cool music")
			for (i=0;i<array.length-1;i++) {
				obj = obj[array[i]]
			}
			//Need to find a more elegant way to do this
			$("#songtable").removeClass("albumlist artistpage")
			$("#autocomplete").fadeOut()
			$("[data-navigate]").removeClass("menuselected")
			$("#leftbar [data-navigate='"+to+"']").addClass("menuselected");
			//Execute it!
			obj(array[array.length-1]);
			//Change window URL
			//Important: Only when not already so!
			if (history.state == null || history.state.scheme != to) {
				var stateObj = { scheme: to };
				history.pushState(stateObj, null, "/" + to);
			}
			
		}
	return {
		to: to,
		start: function() {
            //No songs saved on the client side? Ok, load them all!
            if (localStorage.songs == "null" || localStorage.songs == null) {
                //Create array in localStorage
                localStorage.songs = "[]";
                if (localStorage.authkey != undefined) {
                	libraryController.loadAllSongs();
                }
                
            }
                //First, check for new songs/deleted songs, then draw the table
            else {
                if (originalState == "" && Helpers.getUrlParamaterValueByName(window.location.href, "name") == "") {
                	libraryController.compareSongs("songs");
                	to("Library/Songs")
                }
                else if (Helpers.getUrlParamaterValueByName(window.location.href, "name") != "") {
                	//If FB credentials passed, do nothing!!
                }
                else {
                	libraryController.compareSongs("songs");
                	to(originalState)
                }
                
            }
        }
	}
})