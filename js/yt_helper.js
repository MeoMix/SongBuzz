YTHelper = {
    _searchUrl: "http://gdata.youtube.com/feeds/api/videos?orderBy=relevance&time=all_time&max-results=30&format=5&v=2&alt=json&callback=?&restriction=" + geoplugin_countryCode() + "&q=",
    _suggestUrl: "http://suggestqueries.google.com/complete/search?hl=en&ds=yt&client=youtube&hjson=t&cp=1&format=5&v=2&alt=json&callback=?&restriction=" + geoplugin_countryCode() + "&q=",

    //Convert JSON response into object.
    _buildYouTubeVideo: function (entry) {
        var unavail = [];
        var id = entry.id.$t;
        var start = id.lastIndexOf(':') + 1;
        var end = id.length;

        var youtubeVideo = {
            // set values
            videoId: id.substring(start, end),
            entry: entry, // give access to the entry itself
            title: entry.title.$t,
            duration: entry.media$group.yt$duration.seconds,
            category: entry.media$group.media$category[0].$t,
            categoryLabel: entry.media$group.media$category[0].label,
            description: entry.media$group.media$description.$t
        };

        return youtubeVideo;
    },

    isPlayable: function (youtubeVideo) {
        var isPlayable = true;

        var accessControls = youtubeVideo.entry.yt$accessControl;
        if (accessControls) {
            for (var accessControlIndex = 0; accessControlIndex < accessControls.length; accessControlIndex++) {
                var accessControl = accessControls[accessControlIndex];

                if (accessControl.permission == "denied" && (accessControl.action == "embed" || accessControl.action == "syndicate"))
                    isPlayable = false;
            }
        }

        var appControl = youtubeVideo.entry.app$control;
        if (appControl) {
            var state = appControl.yt$state;
            if (state.name == "restricted" && state.reasonCode == "limitedSyndication")
                isPlayable = false;
        }

        return isPlayable;
    },

    search: function (text, callback) {
        var self = this;
        $.getJSON(this._searchUrl + text, function (response) {
            var videos = [];
            if (response.feed) {
                var feed = response.feed;
                var entries = response.feed.entry;
                for (entry in entries) {
                    var video = self._buildYouTubeVideo(entries[entry]);
                    if (self.isPlayable(video))
                        videos.push(video);
                }
            } else {
                var video = self._buildYouTubeVideo(response.entry);
                if (self.isPlayable(video))
                    videos.push(video);
            }

            callback(videos);
        });
    },

    suggest: function (text, callback) {
        console.log(this._suggestUrl);

        $.getJSON(this._suggestUrl + text, function (response) {
            var suggestions = [];

            for (entry in response[1])
                suggestions.push(response[1][entry][0]);

            callback(suggestions);
        });
    }
}