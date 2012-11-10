//A global object which abstracts more difficult implementations of retrieving data from YouTube.
define(['geoplugin', 'levenshtein', 'song_builder'], function (geoplugin, levDist, songBuilder) {
    'use strict';
    var buildYouTubePlaylist = function (entry) {
        console.log("Entry:", entry);
        var videos = [];
        $.each(entry.entry, function () {
            var video = songBuilder.buildSong(this);
            videos.push(video);
        });

        var youTubePlaylist = {
            //Strip out the videoid. An example of $t's contents: tag:youtube.com,2008:playlist:B16354B8069E4E4D
            playlistId: entry.id.$t.substring(entry.id.$t.length - 16),
            title: entry.title.$t,
            videos: videos
        };

        console.log("I built a playlist with songs: ", videos);

        return youTubePlaylist;
    };

    var findPlayableWithVideoInformation = function (videoInformation, callback) {
        var songName = videoInformation.title.$t;
        search(songName, function (videos) {
            videos.sort(function (a, b) {
                return levDist(a.title, songName) - levDist(b.title, songName);
            });

            var videoIndex = 0;
            var processNext;
            (processNext = function () {
                if (videoIndex < videos.length) {
                    var video = videos[videoIndex];
                    chrome.extension.getBackgroundPage().SongValidator.validateSongById(video.videoId, function (songWasValid) {
                        if (songWasValid) {
                            callback(video);
                        }
                        else {
                            videoIndex++;
                            processNext();
                        }
                    });
                } else {
                    //Failed to find a video.
                    callback();
                }
            })();
        });
    };

    //Be sure to filter out videos and suggestions which are restricted by the users geographic location.
    var buildSearchUrl = function (searchIndex, maxResults, searchText) {
        return "https://gdata.youtube.com/feeds/api/videos?category=Music&orderBy=relevance&start-index=" + searchIndex + "&time=all_time&max-results=" + maxResults + "&format=5&v=2&alt=json&callback=?&restriction=" + geoplugin.countryCode + "&q=" + searchText;
    };

    //Performs a search of YouTube with the provided text and returns a list of playable videos (<= max-results)
    var search = function (text, callback) {
        var searchIndex = 1;
        var timeInterval = 200;
        var timeToSpendSearching = 500;
        var elapsedTime = 0;
        var videos = [];
        var maxResultsPerSearch = 50;

        var searchInterval = setInterval(function () {
            elapsedTime += timeInterval;

            if (elapsedTime < timeToSpendSearching) {
                var searchUrl = buildSearchUrl(searchIndex, maxResultsPerSearch, text);

                $.getJSON(searchUrl, function (response) {
                    //Add all playable songs to a list and return.
                    $(response.feed.entry).each(function () {
                        videos.push(songBuilder.buildSong(this));
                    });

                    searchIndex += maxResultsPerSearch;
                });
            }
            else {
                clearInterval(searchInterval);
                callback(videos);
            }
        }, timeInterval);
    };

    //Takes a videoId which is presumed to have content restrictions and looks through YouTube
    //for a song with a similiar name that might be the right song to play.
    var findPlayableByVideoId = function(videoId, callback) {
        this.getVideoInformation(videoId, function(videoInformation) {
            if (videoInformation) {
                findPlayableWithVideoInformation(videoInformation, callback);
            }
        });
    };

    return {
        getRelatedVideos: function (songs, callback) {
            var relatedVideos = [];
            var deferredRequests = [];

            $.each(songs, function () {
                var song = this;

                deferredRequests.push($.ajax({
                    url: 'https://gdata.youtube.com/feeds/api/videos/' + song.videoId + '/related?v=2&alt=json',
                    success: function (result) {
                        //Don't tack on a lot of songs. We can easily exceed the 5mb storage limit of local storage here.
                        for (var i = 0; i < 2; i++) {
                            var relatedVideo = result.feed.entry[i];
                            var song = songBuilder.buildSong(relatedVideo);
                            relatedVideos.push(song);
                        }
                    }
                }));
            });

            $.when.apply($, deferredRequests).done(function () {
                callback(relatedVideos);
            });
        },

        search: search,
        findPlayableByVideoId: findPlayableByVideoId,
        //Takes a URL and returns a videoId if found inside of the URL.
        parseUrl: function (url) {
            var hostersscheme = {
                "youtube": "youtube.com/watch?v=",
                "spotify": "open.spotify.com/track/"
            }
            var song = null
            $.each(hostersscheme, function (hoster, scheme) {
                if (url.indexOf(scheme) != -1) {
                    var id = url.substr(url.indexOf(scheme) + scheme.length);
                    id = id.substr(0, id.indexOf("&"));
                    song = {
                        hoster: hoster,
                        id: id
                    }
                }

                //TODO: Does this regExp really match a lot of stuff?
                //                    var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
                //                    var match = url.match(regExp);
                //                    console.log("match:", match);
                //                    if (match && match[2].length === 11) {
                //                        console.log(match[2]);
                //                    }

            })
            return song;
        },

        parseUrlForPlaylistId: function (url) {
            var urlTokens = url.split('list=PL');
            var videoId = null;

            if (urlTokens.length > 1) {
                videoId = url.split('list=PL')[1];
                var ampersandPosition = videoId.indexOf('&');
                if (ampersandPosition !== -1) {
                    videoId = videoId.substring(0, ampersandPosition);
                }
            }

            return videoId;
        },

        buildPlaylistFromId: function (playlistId, callback) {
            var startIndex = 1;
            var videos = [];
            var maxResultsPerSearch = 50;
            var youtubePlaylist = null;

            var getPlaylistInterval = setInterval(function () {
                $.ajax({
                    url: "https://gdata.youtube.com/feeds/api/playlists/" + playlistId + "?v=2&alt=json&max-results=" + maxResultsPerSearch + "&start-index=" + startIndex,
                    success: function (result) {
                        //Go and build up a playlist. Can only get up to max-results # of songs per query, so have to
                        //fetch the playlist data multiple times to ensure all songs are captured.
                        var videoResultsFound = 0;
                        if (youtubePlaylist === null) {
                            youtubePlaylist = buildYouTubePlaylist(result.feed);
                            videoResultsFound = youtubePlaylist.videos.length;
                        }
                        else {
                            var additionalVideos = buildYouTubePlaylist(result.feed).videos;
                            youtubePlaylist.videos = youtubePlaylist.videos.concat(additionalVideos);
                            videoResultsFound = additionalVideos.length;
                        }

                        //Done finding videos when less than max possible results are returned.
                        console.log("videoResultsFound:", videoResultsFound);

                        if (videoResultsFound != maxResultsPerSearch) {
                            console.log("calling callback!");
                            clearInterval(getPlaylistInterval);
                            callback(youtubePlaylist);
                        }

                        startIndex += maxResultsPerSearch;
                    },
                    error: function () {
                        callback();
                        clearInterval(getPlaylistInterval);
                    }
                });
            }, 5000);

        },

        // Returns NULL if the request throws a 403 error if videoId has been banned on copyright grounds.
        getVideoInformation: function (videoId, callback) {
            $.ajax({
                url: 'https://gdata.youtube.com/feeds/api/videos/' + videoId + '?v=2&alt=json',
                success: function (result) {
                    callback(result.entry);
                },
                error: function () {
                    callback();
                },
                dataType: "json"
            });
        },
        recognizeSpotify: function (id, callback) {
            var data = {
                "uri": "spotify:track:" + id
            };

            $.ajax({
                url: 'http://ws.spotify.com/lookup/1/.json',
                data: data,
                success: function (result) {
                    callback(result);
                },
                dataType: "json"
            });
        },

        findVideo: function (song, callback) {
            $.ajax({
                url: "http://gdata.youtube.com/feeds/api/videos",
                data: {
                    alt: "json",
                    q: song.title + " - " + song.artists
                },
                success: function (json) {
                    //Find the video most related to our video by duration.
                    var videos = json.feed.entry;
                    //TODO: Do we also want to compare levenshtein distance of song titles?
                    var closestVideo = _.sortBy(videos, function (video) {
                        var duration = video.media$group.yt$duration.seconds;
                        var durationDifference = Math.abs(song.duration - duration);
                        return durationDifference;
                    })[0];

                    console.log("found video:", closestVideo);
                    callback(closestVideo);
                }
            });
        }
    };
});