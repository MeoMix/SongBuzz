define(function(){
    'use strict';
    var recognitionList = $('#recognitionlist');
    var currentSong = null;

    return {
        addNotice: function(noticeDomElement){
            recognitionList.append(noticeDomElement);
        },
        addSong: function(song){
            var songDiv =$('<div>', {
                id: song.id
            });

            recognitionList.append(songDiv);
            currentSong = songDiv;
        },
        addImageToCurrentSong: function(imageElement){
            currentSong.append(imageElement);
        },
        showFinishedAnimation: function(data){
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

            setTimeout( function() {
                currentSong.animate({"opacity": 0}, 2000);
                track.insertAfter(currentSong).fadeIn();
                setTimeout(function() {
                    $('<div>', {
                        'class': 'spark'
                    }).insertAfter(currentSong);
                }, 1000);
            }, 1000);
        }
    };
});