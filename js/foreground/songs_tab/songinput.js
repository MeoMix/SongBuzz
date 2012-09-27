//The songs tab header. Users may add songs by clicking on Add Songs or click-and-holding on Add Songs.
//Clicking Add Songs will allow the user to either search w/ auto-complete suggestions, or to paste youtube URLs into the input.
//Alternatively, the user can click-and-hold on the button which will cause all open tabs to be parsed for songs.
var SongInput;

require(['../yt_helper'], function(){
    SongInput = function(songListHeader){
        "use strict";
        var addInput = $('#CurrentSongDisplay .addInput').attr('placeholder', 'Search or Enter YouTube URL');

        //Provides the drop-down suggestions and song suggestions.
        addInput.autocomplete({
            autoFocus: true,
            source: [],
            position: {
                my: "left top",
                at: "left bottom"
            } ,
            minLength: 0, //minLength: 0 allows empty search triggers for updating source display.
            focus: function(){
                //Don't change the input as the user changes selections.
                return false;
            },
            select: function (event, ui) {
                event.preventDefault(); //Don't change the text when user clicks their song selection.
                songListHeader.flashMessage('Thanks!', 2000);

                chrome.extension.getBackgroundPage().SongValidator.validateSongById(ui.item.value.videoId, function(isPlayable){
                    if(isPlayable){
                        Player.addSongByVideoId(ui.item.value.videoId);
                    }
                    else{
                        Dialogs.showReplacedSongNotification();
                        YTHelper.findPlayableByVideoId(ui.item.value.videoId, function(playableSong){
                            Player.addSongByVideoId(playableSong.videoId);
                        });
                    }
                });
            }
        });

        var handleInputEvents = function(){
            var userIsTyping = false;
            var typingTimeout = null;
            //Validate URL input on enter key.
            //Otherwise show suggestions. Use keyup event because input's val is updated at that point.
            addInput.keyup(function (e) {
                userIsTyping = true;
                var code = e.which;
                clearTimeout(typingTimeout);
                var usersText = $(this).val();

                typingTimeout = setTimeout(function(){
                    userIsTyping = false;
                    //User can navigate suggestions with up/down. 
                    if (code !== $.ui.keyCode.UP && code !== $.ui.keyCode.DOWN) {
                        if(usersText === ''){
                            addInput.autocomplete("option", "source", []);
                        }
                        else{
                            showSongSuggestions(usersText);
                        }
                    }
                }, 100);

            }).keydown(function(){
                userIsTyping = true;
                clearTimeout(typingTimeout);
            }).bind('paste drop', function () {
                parseUrlInput();
            });

            //Searches youtube for song results based on the given text.
            var showSongSuggestions = function (text) {
                var elapsedTime = 0;
                var timeInterval = 200;
                var timeout = 1000;

                var addSongInterval = setInterval(function(){
                    var songTitles = [];
                    elapsedTime += timeInterval;

                    if(elapsedTime < timeout){
                        YTHelper.search(text, function (videos) {
                            if(!userIsTyping){
                                $(videos).each(function(){
                                    //I wanted the label to be duration | title to help delinate between typing suggestions and actual songs.
                                    var label = Helpers.prettyPrintTime(this.duration) + " | " + this.title;
                                    songTitles.push({ label: label, value: this});
                                });

                                //Show songs found instead of suggestions.
                                addInput.autocomplete("option", "source", songTitles);
                                addInput.autocomplete("search", '');
                            }
                        });
                    }
                    else{
                        clearInterval(addSongInterval);
                    }
                }, timeInterval);
            };
        }();

        var parseUrlInput = function () {
            //Wrapped in a timeout to support 'rightclick->paste' 
            setTimeout(function () {
                var videoId = YTHelper.parseUrl(addInput.val());

                //If found a valid YouTube link then just add the video.
                if (videoId) {
                    songListHeader.flashMessage('Thanks!', 2000);

                    var onResponse = function(videoInformation){
                        if(videoInformation === null){
                            Dialogs.showBannedSongDialog();
                        }
                        else{
                            YTHelper.isPlayable(videoId, function (isPlayable) {
                                if(isPlayable){
                                    chrome.extension.getBackgroundPage().SongValidator.validateSongById(videoId, function(playedSuccessfully){
                                        if(playedSuccessfully){
                                            Player.addSongByVideoId(videoId);
                                        }
                                        else{
                                           Dialogs.showReplacedSongNotification();
                                            YTHelper.findPlayableByVideoId(videoId, function(playableSong){
                                                Player.addSongByVideoId(playableSong.videoId);
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    };

                    YTHelper.getVideoInformation(videoId, onResponse);
                }
            });
        };
    }
});