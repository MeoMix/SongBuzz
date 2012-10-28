define(['recognitionArea', 'audioScrobbler', 'recognitionList', 'backend'], function(recognitionArea, audioScrobbler, recognitionList, backend){
    'use strict';
    recognitionArea.onLinkNotRecognized(function(){
        var unrecognizedLinkNotice = $('<p>', {
            'class': 'fadeandslide',
            text: 'Link cannot be recognized. Try a YouTube link!'
        });

        recognitionList.addNotice(unrecognizedLinkNotice);
    });

    recognitionArea.onSongDropped(function(event, song){
        var songDiv = $('<div>', {
            id: song.id
        });
        recognitionList.addSong(songDiv);

        var youtubeMetroImage = $('<img>', {
            'class': 'fadeandslide',
            src: 'images/youtube-metro.png'
        });
        recognitionList.addImageToCurrentSong(youtubeMetroImage);

        //TODO: This code needs a home. Should it be handled when creating a song object?
        //Get tag properly
        var termstoremove = ["HD", "official", "video", "-", "audio", "lyrics", "feat", "ft."]
        $.each(termstoremove, function(k, v) {
            var regex = new RegExp(v, "gi")
            song.title = song.title.replace(regex, "")
        })

        //Remove brackets
        song.title = cropuntil(cropuntil(song.title, "("), "/")
        song.title = cropuntil(cropuntil(song.title, "["), "/")

        searchMetaData(song);
    });

    function searchMetaData(song){
        //FEEDBACK HERE
        audioScrobbler.getData(song.title, function(json){
            var totalResults = parseInt(json.results["opensearch:totalResults"]);

            if (totalResults !== 0) {
                var track = totalResults === 1 ? json.results.trackmatches.track : json.results.trackmatches.track[0];

                var thumbnailImage = $('<img>', {
                    'class': 'fadeandslide rec-thumb',
                    src: song.thumbnailUrl
                });
                recognitionList.addImageToCurrentSong(thumbnailImage);

                audioScrobbler.getAlbum(track.name, track.artist, function(json){
                    var track = json.track
                  
                    if (track.album == undefined) {
                        track.album = {
                            title: "Unknown",
                            image: "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="
                        }
                    } else {
                        track.album.image = track.album.image[track.album.image.length - 1]["#text"]
                    }

                    var albumImage = $('<img>', {
                        'class': 'fadeandslide rec-album',
                        'src': track.album.image
                    });
                    recognitionList.addImageToCurrentSong(albumImage);

                    backend.onSaveData(function(event, data){
                        var songDurationDiv = $('<div>', {
                            text: Helpers.prettyPrintTime(song.duration),
                            'class': 'fadeandslide rec-check'
                        });
                        recognitionList.addImageToCurrentSong(songDurationDiv);

                        //TODO: Move this somewhere, seems a bit clunky here.
                        var track = $('<div>', {
                            'class': 'finishedrecognized'
                        });

                        $('<img>', {
                            'class': 'recognized-cover',
                            src: data.cover
                        }).appendTo(track);

                        $('<div>', {
                            'class': 'recognized-title',
                            text: data.title
                        }).appendTo(track);

                        $('<div>', {
                            'class': 'recognized-artist',
                            text: data.artists
                        }).appendTo(track);

                        $('<div>', {
                            'class': 'recognized-album',
                            text: data.album
                        }).appendTo(track);

                        $('<div>', {
                            'class': 'recognized-length',
                            text: Helpers.prettyPrintTime(data.duration)
                        }).appendTo(track);

                        recognitionList.showFinishedAnimation(track);
                    });

                    backend.saveData({
                        hoster: "youtube",
                        hosterid: song.id,
                        title: track.name,
                        artists: track.artist.name,
                        album: track.album.title,
                        cover: track.album.image,
                        id: track.id,
                        countries: song.restrictedCountries,
                        duration: song.duration,
                        artistsid: track.artist.mbid,
                        albumid: track.album.mbid
                    });
                });
            }
        });
    }

    function cropuntil(input, slice) {
        if(input.indexOf(slice) != -1) {
            return input.substr(0, input.indexOf(slice))
        } else {
            return input
        }
    }

    //Any public methods which need to be returned.
    return {

    };
});