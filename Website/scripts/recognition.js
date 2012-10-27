$(document).ready(function() {
	$("body").removeClass("preload")
	$("textarea").live("dragover dragenter",function(e) {
		$("#drag-area").addClass("fileover")
		$("#drop-music").addClass("fileover-text")
	})
	$("textarea").live("dragleave",function() {
		$("#drag-area").removeClass("fileover")
		$("#drop-music").removeClass("fileover-text")
	})
	$("textarea").live("drop", function(e) {
		$("#drag-area").removeClass("fileover")
		$("#drop-music").removeClass("fileover-text")
		setTimeout(function(){
			url = $("textarea").val()
			$("textarea").val("")
			//If YouTube
			if (contains(url, "youtube.com")) {
				var id = parseId(url);
				$.ajax({
	
            		url: "http://gdata.youtube.com/feeds/api/videos/" + id,
            		data: {
            		    "alt": "json"
            		},
            		success: function(json) {
            		    //Search on Last.fm
            		    var title = json.entry.title.$t
            		    randonnumber = Math.floor(Math.random()*100000)
            		    randomid = $("<div>").attr("id", randonnumber).appendTo("#recognitionlist")
            		    randomdiv = $("#" + randonnumber)
            		    $("<img>")
            		    .addClass("fadeandslide")
            		    .attr("src", "images/youtube-metro.png")
            		    .appendTo(randomdiv)
            		    thumb = json.entry.media$group.media$thumbnail[json.entry.media$group.media$thumbnail.length-2].url
            		    countries = (json.entry.media$group.media$restriction != undefined) ? json.entry.media$group.media$restriction.$t : "all"
            		    searchmetadata(title, "youtube", id, json.entry.media$group.yt$duration.seconds, countries)
            		},
            		asnyc: false
        		})
			}
			else {
				$("<p>").addClass("fadeandslide").text("Link can not be recognized. Try a YouTube link!").appendTo("#recognitionlist")
			}
		})
	})
})
function searchmetadata(name, hoster, hosterid, length, countries) {
	var title = name
        //Get tag properly
        termstoremove = ["HD", "official", "video", "-", "audio", "lyrics", "feat", "ft."]
        $.each(termstoremove, function(k, v) {
            var regex = new RegExp(v, "gi")
            title = title.replace(regex, "")
        })
        //Remove brackets
        title = cropuntil(cropuntil(title, "("), "/")
        title = cropuntil(cropuntil(title, "["), "/")
        //FEEDBACK HERE

        $.ajax({
            url: "http://ws.audioscrobbler.com/2.0/",
            data: {
                "method": "track.search",
                "track": title,
                "api_key": "29c1ce9127061d03c0770b857b3cb741",
                "format": "json"
            },
            async: false,
            success: function(json) {
                if (json.results["opensearch:totalResults"] != "0") {
                    var track = (json.results['opensearch:totalResults'] != 1) ? json.results.trackmatches.track[0] : json.results.trackmatches.track
                    var title = track.name
                    var artist = track.artist
                    $("<img>")
            		.addClass("fadeandslide rec-thumb")
            		.attr("src", thumb)
            		.appendTo(randomdiv)

            		 
                    //Get album
                    $.ajax({
                        url: "http://ws.audioscrobbler.com/2.0/",
                        data: {
                            "method": "track.getInfo",
                            "track": title,
                            "artist": artist,
                            "format": "json",
                            "api_key": "29c1ce9127061d03c0770b857b3cb741"
                        },
                        asnyc: false,
                        success: function(json) {
                        	
                            var track = json.track
                          
                            if (track.album == undefined) {
                                track.album = {
                                    title: "Unknown",
                                    image: "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="
                                }
                            } else {
                                track.album.image = track.album.image[track.album.image.length - 1]["#text"]
                            }
                            $("<img>")
                            .addClass("fadeandslide rec-album")
            				.attr("src", track.album.image)
            				.appendTo(randomdiv)
                            var song = {
                            	hoster: "youtube",
                                hosterid: hosterid,
                                title: track.name,
                                artists: track.artist.name,
                                album: track.album.title,
                                cover: track.album.image,
                                id: track.id,
                                countries: countries,
                                length: length,
                                artistsid: track.artist.mbid,
                                albumid: track.album.mbid

                            }
                            console.log(song)
                            $.ajax({
                            	url: "http://buzztube.site11.com/backend/songs/add.php",
                            	data: song,
                            	dataType: "json",
                            	success: function(json) {
                            		if (json.success == "true") {
                            			$("<div>").text(formatDuration(length))
                            			.addClass("fadeandslide rec-check")
            							.appendTo(randomdiv)
            							var track = $("<div>").addClass("finishedrecognized")
            							$("<img>").addClass("recognized-cover").attr("src", song.cover).appendTo(track)
            							$("<div>").addClass("recognized-title").text(song.title).appendTo(track)
            							$("<div>").addClass("recognized-artist").text(song.artists).appendTo(track)
            							$("<div>").addClass("recognized-album").text(song.album).appendTo(track)
            							$("<div>").addClass("recognized-length").text(formatDuration(song.length)).appendTo(track)
            							setTimeout(function() {
            								randomdiv.animate({"opacity": 0}, 2000)
            								track.insertAfter(randomdiv).fadeIn()
            								setTimeout(function() {
            									$("<div>").addClass("spark").insertAfter(randomdiv)
            								}, 1000)
            							},1000)

            						}


                            	}
                            })
                        }
                    })
                }
            }
        })
}
function contains(text, contains) {
    return (text.indexOf(contains) != -1)
}

function cropat(input, slice) {
    if (contains(input, slice)) {
        return input.substr(input.indexOf(slice) + slice.length)
    } else {
        return input
    }
}

function cropuntil(input, slice) {
    if (contains(input, slice)) {
        return input.substr(0, input.indexOf(slice))
    } else {
        return input
    }
}

function formatDuration(time) {
    var minutes, seconds;
    if (time > 60) {
        minutes = Math.floor(time / 60);
        seconds = Math.floor(time - minutes * 60);
    } else {
        minutes = 0;
        seconds = Math.floor(time);
    }
    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    return "" + minutes + ":" + seconds;
}
function parseId(url) {
	if (contains(url, "youtube.com") && contains(url, "watch?")) {
	    return cropuntil(cropat(url, "watch?v="), "&")
	}
}