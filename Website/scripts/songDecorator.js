define(['audioScrobbler', 'recognitionImageBuilder', 'recognitionList'], 
    function (audioScrobbler, recognitionImageBuilder, recognitionList) {
    'use strict';

    return {
        decorateWithYouTubeInformation: function (video, song, id, callback) {
            song.hoster = "youtube";
            song.hosterid = video.id.$t.substr(video.id.$t.indexOf("videos/") + 7);
            song.duration = video.media$group.yt$duration.seconds;
            song.countries = video.media$group.media$restriction ? video.media$group.media$restriction.$t : "none";
            if (id != undefined) {
                var thumbnailObject = { thumbnailUrl: video.media$group.media$thumbnail[1].url };
                var thumbnailImage = recognitionImageBuilder.buildThumbnailImage(thumbnailObject);
                recognitionList.addImageToSong(thumbnailImage, id);
            }
            //One last request just for the lastfmid ..
            audioScrobbler.getAlbum(song.title, song.artists, function (json) {
                var track = json.track;
                if (track.album) {
                    song.albumid = track.album.mbid;
                    song.cover = track.album.image[track.album.image.length - 1]['#text'];
                    var album = { image: track.album.image[0]['#text'] };
                }
                song.lastfmid = track.id;
                song.mbid = track.id;
                song.artistsid = track.artist.mbid;
                if (id != undefined) {
                    if (track.album) {
                        recognitionList.addImageToSong(recognitionImageBuilder.buildAlbumImage(album), id);
                    }
                    recognitionList.addImageToSong(recognitionImageBuilder.buildSongDurationDiv(song), id);
                }
                callback(song, json);
            });
        }
    };
});