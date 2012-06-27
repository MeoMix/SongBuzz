function Song(songId, callback) {
    var self = this;
    $.getJSON('http://gdata.youtube.com/feeds/api/videos/' + songId + '?v=2&alt=json-in-script&callback=?', function (data) {
        //, url, name, totalTimeInSeconds
        self.id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) { var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8); return v.toString(16); });
        self.songId = songId;
        self.url = "http://youtu.be/" + songId;
        self.name = data.entry.title.$t;
        self.totalTime = data.entry.media$group.yt$duration.seconds;
        callback();
    });
}

