define(function () {
    'use strict';
    var url = 'http://ws.audioscrobbler.com/2.0/';
    //[Meo] TODO: Should we be exposing this API key to github?
    var apiKey = '29c1ce9127061d03c0770b857b3cb741';
    var format = 'json';
    var dataType = 'json';

    return {
        getData: function (songTitle, callback) {
            $.ajax({
                url: url,
                data: {
                    "method": "track.search",
                    "track": songTitle,
                    "api_key": apiKey,
                    "format": format
                },
                dataType: dataType,
                success: callback
            });
        },
        getAlbum: function (title, artist, callback) {
            $.ajax({
                url: url,
                data: {
                    "method": "track.getInfo",
                    "track": title,
                    "artist": artist,
                    "format": format,
                    "api_key": apiKey
                },
                dataType: dataType,
                success: callback
            });
        },
        getAlbumInfo: function (mbid, callback, artist, album) {
            //[Jonny] There should be the ability to pass in artist and album too!
            var data = {
                "method": "album.getInfo",
                "format": format,
                "api_key": apiKey
            }
            if (mbid == "") {
                data['artist'] = artist;
                data['album'] = album
            }
            else {
                data["mbid"] = mbid
            }
            $.ajax({
                url: url,
                data: data,
                dataType: dataType,
                success: callback
            });
        }
    };
});