//Holds all the relevant data for a song.
var SongBuilder;
define(function(){
    'use strict';
    //Global because its shared between the foreground and background.
    SongBuilder = {
        //When a single song is retrieved from YouTube, use this method as we know the URL of the video.
        buildSong: function(videoInformation) {
            //Strip out the videoid. An example of $t's contents: tag:youtube.com,2008:video:UwHQp8WWMlg
            var videoId = videoInformation.media$group.yt$videoid.$t;
            return {
                id: Helpers.generateGuid(),
                videoId: videoId,
                url: 'http://youtu.be/' + videoId,
                title: videoInformation.title.$t,
                duration: videoInformation.media$group.yt$duration.seconds
            };
        }
    };
});