define(function() {
    'use strict';
    var recognitionList = $('#recognitionlist');
    var currentSong = null;

    return {
        addNotice: function(noticeDomElement) {
            recognitionList.append(noticeDomElement);
        },
        addSong: function(id) {
            var songDiv = $('<div>', {
                id: id
            });

            recognitionList.append(songDiv);
        },
        addImageToSong: function(imageElement, id) {
            $("#" + id).append(imageElement);
        },
        showFinishedAnimation: function(data, id) {
            if (id != undefined) {
                var id = id;
            } else {
                var id = data.hosterid;
            }
            var track = $('<div>', {
                'class': 'finishedrecognized',
                'data-recognized-id': id
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

            setTimeout(function() {
                var currentSong = $("#" + id);
                currentSong.animate({ "opacity": 0 }, 2000);
                track.insertAfter(currentSong).fadeIn();
                setTimeout(function() {
                    $('<div>', {
                        'class': 'spark',
                        'data-recognized-id': id
                    }).insertAfter(currentSong);
                }, 1000);
                setTimeout(function() {
                    $("[data-recognized-id=" + id + "]").slideUp();
                    currentSong.slideUp();
                }, 8000);
            }, 1000);
        }
    };
});