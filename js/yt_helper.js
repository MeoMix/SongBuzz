//A global object which abstracts more difficult implementations of retrieving data from YouTube.
YTHelper = (function(){
    "use strict";
    //Be sure to filter out videos and suggestions which are restricted by the users geographic location.
    var buildSearchUrl = function(){
        return "https://gdata.youtube.com/feeds/api/videos?category=Music&orderBy=relevance&time=all_time&max-results=50&format=5&v=2&alt=json&callback=?&restriction=" + GeoPlugin.getCountryCode() + "&q=";
    };

    //Convert JSON response into object.
    var buildYouTubeVideo = function(entry){
        var youtubeVideo = {
            //Strip out the videoid. An example of $t's contents: tag:youtube.com,2008:video:UwHQp8WWMlg
            videoId: entry.id.$t.substring(entry.id.$t.length - 11),
            title: entry.title.$t,
            duration: entry.media$group.yt$duration.seconds,
            accessControls: entry.yt$accessControls,
            appControl: entry.app$control,
            //Returns whether the video was found to have any content restrictions which would restrict playback.
            isPlayable: function(bannedKeywords){
                var isPlayable = true;

                //Look for banned keywords in the title.
                for(var index = 0; index < bannedKeywords.length; index++){
                    if(this.title.toLowerCase().indexOf(bannedKeywords[index]) !== -1){
                        isPlayable = false;
                    }
                }

                //A video may have access controls which limit its playability. IE: embedding disabled, syndication disabled.
                $(this.accessControls).each(function(){
                    if (this.permission === "denied" && (this.action === "embed" || this.action === "syndicate")){
                        isPlayable = false;
                    }
                });

                //Restrictions may be implemented at a parent level, though, too.
                if(this.appControl){
                    var appControlState = this.appControl.yt$state;

                    if (appControlState.name === "restricted" && appControlState.reasonCode === "limitedSyndication"){
                        isPlayable = false;
                    }
                }

                return isPlayable;
            }
        };

        return youtubeVideo;
    };

    var buildYouTubePlaylist = function(entry){
        var youTubePlaylist = {
            //Strip out the videoid. An example of $t's contents: tag:youtube.com,2008:playlist:B16354B8069E4E4D
            playlistId: entry.id.$t.substring(entry.id.$t.length - 16),
            title: entry.title.$t,
            videos: entry.entry
        };

        return youTubePlaylist;
    };

    return {
        //Determine whether a given youtube video will play properly inside of the Google Chrome Extension.
        //http://apiblog.youtube.com/2011/12/understanding-playback-restrictions.html
        //NOTE: YouTube has explicitly stated that the only way to know 'for sure' that a video will play is to click 'Play.'
        //This statement has been proven quite true. As such, this method will only state whether a video is playable based on information exposed via the YouTube API.
        isPlayable: function (youtubeVideoId, callback) {
            this.getVideoInformation(youtubeVideoId, function(videoInformation){
                if (videoInformation !== null){
                    var video = buildYouTubeVideo(videoInformation);
                    callback(video.isPlayable());   
                }
                else{
                    callback(false);
                }
            });
        },

        //Performs a search of YouTube with the provided text and returns a list of playable videos (<= max-results)
        search: function (text, callback) {
            $.getJSON(buildSearchUrl() + text, function (response) {
                var playableVideos = [];

                //Keywords which skew results if user was not intending to find.
                //Associated with whether they were found in users provided text. Banned if not 
                var keywords = ['live', 'cover', 'remix', 'karaoke'];
                var bannedKeywords = [];

                $(keywords).each(function(){
                    if(text.toLowerCase().indexOf(this) === -1){
                        bannedKeywords.push(this);
                    }
                });

                //Add all playable songs to a list and return.
                $(response.feed.entry).each(function(){
                    var video = buildYouTubeVideo(this);

                    if(video.isPlayable(bannedKeywords)){
                        playableVideos.push(video);
                    }
                });

                callback(playableVideos);
            });
        },

        //Takes a videoId which is presumed to have content restrictions and looks through YouTube
        //for a song with a similiar name that might be the right song to play.
        findPlayableByVideoId: function(videoId, callback){
            this.getVideoInformation(videoId, function(videoInformation){
                if (videoInformation !== null) {
                    var songName = videoInformation.title.$t;
                    YTHelper.search(songName, function (videos) {
                        videos.sort(function(a,b){
                            //TODO: I might also want to consider the distance between users input text and a/b title
                            return levDist(a.title, songName) - levDist(b.title, songName);
                        });

                        var wait = false;
                        var processInterval = setInterval(function(){
                            if(!wait){
                                var currentVideo = videos.shift();

                                if(currentVideo){
                                    wait = true;
                                    if(currentVideo.isPlayable()){
                                        chrome.extension.getBackgroundPage().SongValidator.validateSongById(currentVideo.videoId, function(result){
                                            wait = false;
                                            if(result){
                                                clearInterval(processInterval);
                                                callback(currentVideo);
                                                return;
                                            }
                                        });
                                    }
                                    else{
                                        wait = false;
                                    }
                                }
                            }
                        }, 200);
                    });
                }
            });
        },

        //Takes a URL and returns a videoId if found inside of the URL.
        //http://stackoverflow.com/questions/3452546/javascript-regex-how-to-get-youtube-video-id-from-url
        parseUrl: function(url){
            var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
            var match = url.match(regExp);
            if (match && match[2].length === 11){
                return match[2];
            }
        },

        parseUrlForPlaylistId: function(url){
            var urlTokens = url.split('list=PL');
            var videoId = null;

            if(urlTokens.length > 1){
                videoId = url.split('list=PL')[1];
                var ampersandPosition = videoId.indexOf('&');
                if(ampersandPosition !== -1) {
                  videoId = videoId.substring(0, ampersandPosition);
                }
            }

            return videoId;
        },

        buildPlaylistFromId: function(playlistId, callback){
            $.ajax({
                url:  "https://gdata.youtube.com/feeds/api/playlists/" + playlistId + "?v=2&alt=json",
                success: function(result){
                    var playlist = buildYouTubePlaylist(result.feed);
                    callback(playlist);
                },
                error: function(){
                    callback();
                }
            });
        },

        // Returns NULL if the request throws a 403 error if videoId has been banned on copyright grounds.
        getVideoInformation: function(videoId, callback){
            $.ajax({
                url: 'https://gdata.youtube.com/feeds/api/videos/' + videoId + '?v=2&alt=json',
                success: function(result){
                    callback(result.entry);
                },
                error: function(){
                    callback();
                }
            });
        }
    };
})();