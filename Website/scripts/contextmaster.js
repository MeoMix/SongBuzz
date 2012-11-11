define(['libraryController', 'playlists'], function(libraryController, playlists){
	var contextmaster = {};
	contextmaster.settings = {
		animated: true //Gives a nice fadein/slidein animation
	};

	//This is the configuration. You can use any jQuery selector you want!
	//Delete actions you dont want or add your own!
	contextmaster.config = [
		{
			selector: $("tr.in-library"),
			actions: ["play", "addtoqueue", "removeadd"]
		},
		{
			selector: $(".playlist"),
			actions: ["deleteplaylist"]
		}
	];

	//ADD CUSTOM ACTIONS HERE
	contextmaster.actions = {
		//This is not a real action, it only adds a horizontal line
		//to seperate contextmenu sections
		sectionspacer: {
			title: "hr"
		},
		play: {
			title: "Play",
			action: function(thing) {
				$(thing).dblclick()
			}
		},
		addtoqueue: {
			title: "Add to queue",
			action: function(thing) {
				libraryController.addToQueue(libraryController.makeSongOutOfTr($(thing).parent()), "end")
			}
		},
		removeadd: {
			title: "Remove from library",
			action: function(thing) {
				var song = libraryController.makeSongOutOfTr($(thing).parent("tr"));
				var isInLibrary = libraryController.isInLibrary(song)
				if (isInLibrary) {
					libraryController.removeSong(song.lastfmid, "songs")
				}
				else {
					libraryController.addSong(song, "songs")
				}
			}
		},
		deleteplaylist: {
			title: "Delete playlist",
			action: function(thing) {
				var playlistname = $(thing).attr("data-playlist-name");
				playlists.deletePlaylist(playlistname)
			}
		}
	};

	//Extra infos!
	contextmaster.extrainfos = {
	};

	//Bind context menu
	$.each(contextmaster.config, function(key,value) {
		value.selector.live("contextmenu", function(e) {
			$(".cm-contextmenu").remove();
			e.stopPropagation();
			e.preventDefault();

			//Initialize contextMenu!
			var menu = $("<div>").addClass("cm-contextmenu").css({
				top: e.pageY,
				left: e.pageX
			});

			var animatedclass = contextmaster.settings.animated == true ? "cm-animated" : "cm-not-animated";
			menu.addClass(animatedclass);
			ul = $("<ul>").addClass("cm-ul");
				
			$.each(value.actions, function(key, action) {
				if (contextmaster.actions[action].title == "hr") {
					$("<div>").addClass("cm-hr").appendTo(ul);
				}
				else {
					var actiontitle = contextmaster.actions[action].title
					if (actiontitle == "Remove from library") {
						var isInLibrary = libraryController.isInLibrary(libraryController.makeSongOutOfTr($(e.target).parent("tr")));
							console.log(isInLibrary)
						if (!isInLibrary) {
							actiontitle = "Add to library"
						}
					}
					$("<li>").attr("data-action", actiontitle).html(actiontitle).appendTo(ul).on("click", function() {
						contextmaster.actions[action].action(e.target);
					})
				}
			})

			if (value.extrastuff != undefined) {
				$.each(value.extrastuff, function(k,v) {
					contextmaster.extrainfos[v](e.target)
				});
			}

			ul.appendTo(menu);
			menu.appendTo("body");
		});

		$("html").live("click", function() {
			$(".cm-contextmenu").remove()
		})
	});

	return {

	};
});