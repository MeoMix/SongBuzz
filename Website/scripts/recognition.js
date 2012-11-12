//Defines the whole left side song drag-and-drop / recognition area.
define(['recognitionArea', 'audioScrobbler', 'recognitionList', 'backend', 'recognitionImageBuilder', 'libraryController'],
    function(recognitionArea, audioScrobbler, recognitionList, backend, recognitionImageBuilder, libraryController) {
    'use strict';

    libraryController.start();
    //Whenever a user drops a song onto the left-hand side drop area
    //and it is a viable song to add -- add it to the recognition list
    //by getting its meta data. Show some images to the user to indicate success. 
    recognitionArea.onSongDropped(function(event, song) {
        //Need a base song div element to attach any data to -- so add that to the page.
        recognitionList.addSong(song.videoId);

        //Show that progress has been made by displaying a youtube image icon.
        var youtubeMetroImage = recognitionImageBuilder.buildYoutubeMetroImage();
        recognitionList.addImageToSong(youtubeMetroImage, song.videoId);

        //TODO: This code needs a home. Should it be handled when creating a song object?
        //Get tag properly
        //This helps the metaData function properly find metadata by throwing out garbage.
        var termstoremove = ["HD", "official", "video", "-", "audio", "lyrics", "feat.", " ft."];
        $.each(termstoremove, function(k, v) {
            var regex = new RegExp(v, "gi");
            song.title = song.title.replace(regex, "");
        });
        //Remove brackets
        //TODO: Need to be able to detext/identify/handle remixes.
        song.title = cropuntil(song.title, "(");
        song.title = cropuntil(song.title, "[");
        searchMetaData(song);
    });

    //If its not the right type of link (doesn't match regexp) then let the user know
    recognitionArea.onLinkNotRecognized(function() {
        var unrecognizedLinkNotice = $('<p>', {
            'class': 'fadeandslide',
            text: strings.linkNotRecognized[window.language]
        });

        recognitionList.addNotice(unrecognizedLinkNotice);
    });

    //Whenever we successfully save to the server -- reflect that to the user
    //by showing the song's duration and showing a nice animation.
    backend.onSaveData(function(event, data) {
        console.log(data);
        recognitionList.showFinishedAnimation(data, data.hosterid);
        //Also, we add it to the users library!
        //Option to prevent adding to the library
        if (data.prevent == undefined) {
            backend.userLibrary("add", { "song": data.lastfmid, "list": "songs", "authkey": localStorage['authkey'] });
            //Finally, add it to the DOM!
            libraryController.addSong(data, "songs");
        }
    });

    //Go out to audioscrobbler and ask it for metadata information
    //Metadata information includes artist/song/album/album cover art.

    function searchMetaData(song) {
        audioScrobbler.getData(song.title, function(json) {
            var totalResults = parseInt(json.results["opensearch:totalResults"], 10);

            if (totalResults !== 0) {
                var track = totalResults === 1 ? json.results.trackmatches.track : json.results.trackmatches.track[0];

                var thumbnailImage = recognitionImageBuilder.buildThumbnailImage(song);
                recognitionList.addImageToSong(thumbnailImage, song.videoId);

                audioScrobbler.getAlbum(track.name, track.artist, function(json) {
                    var track = json.track;
                    var album = track.album;

                    if (album === undefined) {
                        album = {
                            title: "Unknown",
                            image: "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="
                        };
                    } else {
                        album.image = album.image[album.image.length - 1]["#text"];
                    }

                    var albumImage = recognitionImageBuilder.buildAlbumImage(album);
                    recognitionList.addImageToSong(albumImage, song.videoId);

                    var songDurationDiv = recognitionImageBuilder.buildSongDurationDiv(song);
                    recognitionList.addImageToSong(songDurationDiv, song.videoId);
                    console.log("song", song, "track", track);
                    backend.saveData({
                        hoster: "youtube",
                        hosterid: song.videoId,
                        title: track.name,
                        artists: track.artist.name,
                        album: album.title,
                        cover: album.image,
                        lastfmid: track.id,
                        countries: song.restrictedCountries,
                        duration: song.duration,
                        artistsid: track.artist.mbid,
                        albumid: album.mbid,
                        mbid: track.mbid
                    });
                });
            }
        });
    }

    function cropuntil(input, slice) {
        var croppedValue = input;

        if (input.indexOf(slice) !== -1) {
            croppedValue = input.substr(0, input.indexOf(slice));
        }

        return croppedValue;
    }
});