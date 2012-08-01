//Holds all the relevant data for a song.
var Song = function(videoInformation) {
    "use strict";
    //Strip out the videoid. An example of $t's contents: tag:youtube.com,2008:video:UwHQp8WWMlg
    var videoId = videoInformation.id.$t.substring(videoInformation.id.$t.length - 11);
    console.log("videoInformation:");
    console.log(videoInformation);

    return {
        id: Helpers.generateGuid(),
        videoId: videoId,
        url: 'http://youtu.be/' + videoId,
        name: videoInformation.title.$t,
        totalTime: videoInformation.media$group.yt$duration.seconds
    }
}

