//This file handles all navigation and is capable of making a site hierarchy

define(['playlists', 'libraryController'], function(playlists, libraryController) {
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
			var domain = "http://songbuzz.host56.com/backend/songs";
			//Make the request and draw the table
			$.getJSON(domain + "/" + name + ".php", function(json) {
				libraryController.drawTable(json)
			})
		}
	}
	var formatstring = function(name) {
		return name.replace(/ /g, "").toLowerCase()
	}
	return {
		to: function(to) {
			console.log("Navigated to:", to)
			//Split the navigation into a hierarchy. f.e.: "Playlists/Cool music" into ["Playlist", "Cool music"]
			var array = to.split("/");
			//Get the menu
			var obj = menu
			//Access the menu... f.e.: turns into menu["Playlist"]("Cool music")
			for (i=0;i<array.length-1;i++) {
				obj = obj[array[i]]
			}
			//Execute it!
			obj(array[array.length-1]);
			//Need to find a more elegant way to do this
			$("#songtable").removeClass("albumlist")
			$("[data-navigate]").removeClass("menuselected")
			$("#leftbar [data-navigate='" + to + "']").addClass("menuselected");
			//Change window URL
			var stateObj = { scheme: to };
			history.pushState(stateObj, null, "/" + to);
		}
	}
})