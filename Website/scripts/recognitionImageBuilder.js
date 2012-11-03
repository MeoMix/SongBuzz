define(function(){
    'use strict';
    return {
        buildThumbnailImage: function(song){
            var thumbnailImage = $('<img>', {
                'class': 'fadeandslide rec-thumb',
                src: song.thumbnailUrl
            });
            return thumbnailImage;
        },
        buildAlbumImage: function(album){
            var albumImage = $('<img>', {
                'class': 'fadeandslide rec-album',
                'src': album.image
            });
            return albumImage;
        },
        buildYoutubeMetroImage: function(){
            var youtubeMetroImage = $('<img>', {
                'class': 'fadeandslide',
                src: 'images/youtube-metro.png'
            });
            return youtubeMetroImage;
        },
        buildSpotifyMetroImage: function() {
            var spotifyMetroImage = $('<img>', {
                'class': 'fadeandslide',
                src: 'images/spotify-metro.png'
            });
            return spotifyMetroImage;
        },
        buildSongDurationDiv: function(song){
            var songDurationDiv = $('<div>', {
                text: Helpers.prettyPrintTime(song.duration),
                'class': 'fadeandslide rec-check'
            });
            return songDurationDiv;
        }
    };
});