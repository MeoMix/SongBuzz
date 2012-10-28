define(['ytHelper', 'song_builder'], function(ytHelper, songBuilder){
    'use strict';
    var recognitionArea = $('#recognition-area');
    var dragAreaSelector = $('#drag-area');
    var dropMusicSelector = $('#drop-music');

    var events = {
        //[Meo] TODO: Standardize event names.
        onLinkNotRecognized: 'onLinkNotRecognized',
        onSongDropped: 'onSongDropped'
    };

    $(window).on('dragover dragenter', 'textarea', function(){
        dragAreaSelector.addClass("fileover");
        dropMusicSelector.addClass("fileover-text");
    }).on('dragleave', 'textarea', function(){
        dragAreaSelector.removeClass("fileover");
        dropMusicSelector.removeClass("fileover-text");
    }).on('drop', 'textarea', function() {
        dragAreaSelector.removeClass("fileover");
        dropMusicSelector.removeClass("fileover-text");

        var self = this;
        setTimeout(function(){
            var url = $(self).val();
            $(self).val('');
            
            var videoId = ytHelper.parseUrl(url);
            if(videoId !== null){
                ytHelper.getVideoInformation(videoId, function(videoInformation){
                    var song = songBuilder.buildSong(videoInformation);
                    recognitionArea.trigger(events.onSongDropped, song);
                });
            }
            else {
                recognitionArea.trigger(events.onLinkNotRecognized);
            }
        });
    });

    return {
        onLinkNotRecognized: function(event){
            recognitionArea.bind(events.onLinkNotRecognized, event);
        },
        onSongDropped: function(event){
            recognitionArea.bind(events.onSongDropped, event);
        }
    };
});