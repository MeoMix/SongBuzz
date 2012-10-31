$(".song-list").live("click", function() {
	$(this).addClass("selected").siblings().removeClass("selected")
})
.live("dblclick", function() {
	var node = $(this)
	var attrs = ["album", "albumid", "artists", "artistsid", "countries", "cover", "length", "hoster", "hosterid", "lastfmid", "title"]
	var song = {}
	$.each(attrs, function(key, value) {
		song[value] = node.attr("data-" + value);
	})
	libraryController.playSong(song)
})
