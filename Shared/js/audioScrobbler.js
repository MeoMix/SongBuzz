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
        getAlbumInfo: function (endcallback, mbid, callback, album, artist) {
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
                success: function(json) {
                    //Call back with the data, the final callback and the tracks
                    callback(json, endcallback)
                }
            });
        },
        searchAlbum: function(query, callback) {
            var data = {
                "method": "album.search",
                "format": format,
                "api_key": apiKey,
                "album": query,
                "limit": 3
            }
            $.ajax({
                url: url,
                data: data,
                dataType: dataType,
                success: callback
            })
        },
        searchArtist: function(query, callback) {
            var data = {
                "method": "artist.search",
                "format": format,
                "api_key": apiKey,
                "artist": query,
                "limit": 3
            }
            $.ajax({
                url: url,
                data: data,
                dataType: dataType,
                success: callback
            })
        },
        searchArtistInfo: function(parameter, callback) {
            var data = {
                "method": "artist.getInfo",
                "format": format,
                "api_key": apiKey,
            }
            $.ajax({
                url: url + parameter,
                data: data,
                dataType: dataType,
                success: callback
            })
        },
        getTopAlbums: function(parameter, callback) {
            var data = {
                "method": "artist.gettopalbums",
                "format": format,
                "api_key": apiKey
            }
            $.ajax({
                url: url + parameter,
                data: data,
                dataType: dataType,
                success: callback
            })
        }
    };
});