//Holds all the relevant data for a song.
define(function(){
    'use strict';
    return {
        //When a single song is retrieved from YouTube, use this method as we know the URL of the video.
        buildSong: function(videoInformation) {
            //Strip out the videoid. An example of $t's contents: tag:youtube.com,2008:video:UwHQp8WWMlg
            var videoId = videoInformation["media$group"]["yt$videoid"]["$t"];
            var restrictionsEntry = videoInformation["media$group"]["media$restriction"];
            var guid = Helpers.generateGuid();
            return {
                id: guid,
                videoId: videoId,
                url: 'http://youtu.be/' + videoId,
                title: videoInformation.title["$t"],
                duration: videoInformation["media$group"]["yt$duration"].seconds,
                thumbnailUrl: videoInformation["media$group"]["media$thumbnail"][videoInformation["media$group"]["media$thumbnail"].length-2].url,
                //TODO: Not sure why I need to keep track of this yet.
                //[Jonny] Some users can not play some tracks from YouTube. We should hide them.
                restrictedCountries: restrictionsEntry ? restrictionsEntry.$t : "none"
            };
        }
    };
});