//Holds all the relevant data for a song.
define(['helpers'], function(helpers){        
    'use strict';
    return function(videoInformation) {
        //Strip out the videoid. An example of $t's contents: tag:youtube.com,2008:video:UwHQp8WWMlg
        var videoId = videoInformation.id.$t.substring(videoInformation.id.$t.length - 11);
        return {
            id: helpers.generateGuid(),
            videoId: videoId,
            url: 'http://youtu.be/' + videoId,
            name: videoInformation.title.$t,
            totalTime: videoInformation.media$group.yt$duration.seconds
        };
    };
});