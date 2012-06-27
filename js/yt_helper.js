//A global object which abstracts more difficult implementations of retrieving data from YouTube.
YTHelper = {
    //Be sure to filter out videos and suggestions which are restricted by the users geographic location.
    _searchUrl: "http://gdata.youtube.com/feeds/api/videos?orderBy=relevance&time=all_time&max-results=30&format=5&v=2&alt=json&callback=?&restriction=" + geoplugin_countryCode() + "&q=",
    _suggestUrl: "http://suggestqueries.google.com/complete/search?hl=en&ds=yt&client=youtube&hjson=t&cp=1&format=5&v=2&alt=json&callback=?&restriction=" + geoplugin_countryCode() + "&q=",
    //TODO: Allow users to submit songs which do not play.
    //This is necessary because not all songs will play embedded, but YouTube does not expose all the criterion for a song not playing.
    //http://apiblog.youtube.com/2011/12/understanding-playback-restrictions.html
    _blacklist: ['7AW9C3-qWug'],

    //Convert JSON response into object.
    _buildYouTubeVideo: function (entry) {
        //The id entry has tag information stored in it, strip off this information.
        var id = entry.id.$t;
        var start = id.lastIndexOf(':') + 1;
        var end = id.length;

        var youtubeVideo = {
            videoId: id.substring(start, end),
            entry: entry, //Provide access to the entry itself so that its clear we have more information if needed.
            title: entry.title.$t,
            duration: entry.media$group.yt$duration.seconds,
            category: entry.media$group.media$category[0].$t,
            categoryLabel: entry.media$group.media$category[0].label,
            description: entry.media$group.media$description.$t
        };

        return youtubeVideo;
    },
    //Determine whether a given youtube video will play properly inside of the Google Chrome Extension.
    //NOTE: YouTube has explicitly stated that the only way to know 'for sure' that a video will play is to click 'Play.'
    //This statement has been proven quite true. As such, this method will only state whether a video is playable based on information exposed via the YouTube API.
    isPlayable: function (youtubeVideo) {
        //Support isPlayable for raw YouTube data.
        if (!youtubeVideo.videoId)
            youtubeVideo = this._buildYouTubeVideo(youtubeVideo.entry);

        if (!youtubeVideo.videoId) {
            console.error("isPlayable expects a video to analyze. Provided:");
            console.error(youtubeVideo);
        }

        var isPlayable = true;

        if ($.inArray(youtubeVideo.videoId, this._blacklist) == 0)
            isPlayable = false;

        //A video may have access controls which limit its playability. IE: embedding disabled, syndication disabled.
        var accessControls = youtubeVideo.entry.yt$accessControl;
        if (accessControls) {
            for (var accessControlIndex = 0; accessControlIndex < accessControls.length; accessControlIndex++) {
                var accessControl = accessControls[accessControlIndex];

                if (accessControl.permission == "denied" && (accessControl.action == "embed" || accessControl.action == "syndicate"))
                    isPlayable = false;
            }
        }

        //Restrictions may be implemented at a parent level, though, too.
        var appControl = youtubeVideo.entry.app$control;
        if (appControl) {
            var state = appControl.yt$state;
            if (state.name == "restricted" && state.reasonCode == "limitedSyndication")
                isPlayable = false;
        }

        return isPlayable;
    },

    //Performs a search of YouTube with the provided text and returns a list of playable videos (<= max-results)
    //TODO: There is some code-repetition going on inside here. DRY!
    search: function (text, callback) {
        var self = this;
        $.getJSON(this._searchUrl + text, function (response) {
            var videos = [];
            if (response.feed) {
                var feed = response.feed;
                var entries = response.feed.entry;
                for (entry in entries) {
                    var video = self._buildYouTubeVideo(entries[entry]);
                    if (self.isPlayable(video)) {
                        videos.push(video);
                    }

                }
            } else {
                var video = self._buildYouTubeVideo(response.entry);
                if (self.isPlayable(video)) {
                    videos.push(video);
                }

            }

            callback(videos);
        });
    },
    
    //Returns a list of suggested search-queries for YouTube searches based on the given text.
    suggest: function (text, callback) {
        $.getJSON(this._suggestUrl + text, function (response) {
            var suggestions = [];

            for (entry in response[1]) {
                suggestions.push(response[1][entry][0]);
            }

            callback(suggestions);
        });
    }
}