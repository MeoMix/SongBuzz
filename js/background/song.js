//Holds all the relevant data for a song.
//Goes out to the YT data feed to interogate for some song-specific information.
function Song(songId, callback) {
    var self = this;
    $.getJSON('http://gdata.youtube.com/feeds/api/videos/' + songId + '?v=2&alt=json-in-script&callback=?', function (data) {
        //Generate a unique ID for the song.
        self.id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) { var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8); return v.toString(16); });
        //The youtube song ID.
        self.songId = songId;
        //Short URL
        self.url = "http://youtu.be/" + songId;
        self.name = data.entry.title.$t;
        self.totalTime = data.entry.media$group.yt$duration.seconds;
        callback();
    });
}

