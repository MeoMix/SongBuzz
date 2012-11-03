define(['ytHelper', 'song_builder', 'recognitionImageBuilder', 'recognitionList', 'backend', 'songDecorator'],
    function (ytHelper, songBuilder, recognitionImageBuilder, recognitionList, backend, songDecorator) {
    'use strict';
    var recognitionArea = $('#recognition-area');
    var dragAreaSelector = $('#drag-area');
    var dropMusicSelector = $('#drop-music');

    var events = {
        //[Meo] TODO: Standardize event names.
        onLinkNotRecognized: 'onLinkNotRecognized',
        onSongDropped: 'onSongDropped'
    };

    $(window).on('dragover dragenter', 'textarea', function () {
        dragAreaSelector.addClass("fileover");
        dropMusicSelector.addClass("fileover-text");
    }).on('dragleave', 'textarea', function () {
        dragAreaSelector.removeClass("fileover");
        dropMusicSelector.removeClass("fileover-text");
    }).on('drop', 'textarea', function (e) {
        dragAreaSelector.removeClass("fileover");
        dropMusicSelector.removeClass("fileover-text");

        var self = this;
        setTimeout(function () {
            var url = $(self).val();
            console.log("URL dropped: ", url);
            //Drag multiple songs in at the same time! Yeaaahh
            var urls = url.split("\n")
            $(self).val('');
            // $.each loop? Did I mention that you can add multiple tracks at the same time???
            $.each(urls, function (key, url) {
                var videoId = ytHelper.parseUrl(url);
                console.log(videoId)
                if (videoId == null) {
                    recognitionArea.trigger(events.onLinkNotRecognized);
                }
                else if (videoId.hoster == "youtube") {
                    ytHelper.getVideoInformation(videoId.id, function (videoInformation) {
                        var song = songBuilder.buildSong(videoInformation);
                        recognitionArea.trigger(events.onSongDropped, song);
                    });
                }
                else if (videoId.hoster == "spotify") {
                    ytHelper.recognizeSpotify(videoId.id, function (json) {
                        recognitionList.addSong(videoId.id)
                        var SpotifyImage = recognitionImageBuilder.buildSpotifyMetroImage();
                        recognitionList.addImageToSong(SpotifyImage, videoId.id);
                        var track = json.track;
                        var song = {
                            title: track.name,
                            artists: track.artists[0].name,
                            album: track.album.name,
                            duration: track.length
                        };

                        ytHelper.findVideo(song, function (foundVideo) {
                            songDecorator.decorateWithYouTubeInformation(foundVideo, song, videoId.id, function (song, json) {
                                recognitionList.showFinishedAnimation(song, videoId.id);
                                backend.saveData(song);
                            });
                        });
                    })
                }
            })
        });
    });

    return {
        onLinkNotRecognized: function (event) {
            recognitionArea.bind(events.onLinkNotRecognized, event);
        },
        onSongDropped: function (event) {
            recognitionArea.bind(events.onSongDropped, event);
        }
    };
});