//The songs tab header. Users may add songs by clicking on Add Songs or click-and-holding on Add Songs.
//Clicking Add Songs will allow the user to either search w/ auto-complete suggestions, or to paste youtube URLs into the input.
//Alternatively, the user can click-and-hold on the button which will cause all open tabs to be parsed for songs.
//TODO: This has gotten a bit bulky.
function UrlInput(songListHeader) {
    "use strict";
    var addInput = $('#CurrentSongDisplay .addInput').attr('placeholder', 'Search or Enter YouTube URL');
    var addButton = $('#CurrentSongDisplay .addButton');

    //Provides the drop-down suggestions and song suggestions.
    addInput.autocomplete({
        autoFocus: true,
        source: [],
        position: {
            my: "left top",
            at: "left bottom"
        } ,
        minLength: 0, //minLength: 0 allows empty search triggers for updating source display.
        focus: function(event, ui){
            //Don't change the input as the user changes selections.
            return false;
        },
        select: function (event, ui) {
            var usersText = $(this).val();
            event.preventDefault(); //Don't change the text when user clicks their song selection.
            songListHeader.flashMessage('Thanks!', 2000);

            chrome.extension.getBackgroundPage().SongValidator.validateSongById(ui.item.value.videoId, function(isPlayable){
                if(isPlayable){
                    Player.addSongById(ui.item.value.videoId);
                }
                else{
                    Dialogs.showReplacedSongNotification();
                    YTHelper.findPlayableByText(usersText, function(playableSong){
                        Player.addSongById(playableSong.videoId);
                    });
                }
            });

        }
    });

    var handleInputEvents = function(){
        var userInputHasChanged = false;
        //Validate URL input on enter key.
        //Otherwise show suggestions. Use keyup event because input's val is updated at that point.
        addInput.keyup(function (e) {
            userInputHasChanged = true;
            var code = e.which;

            //User can navigate suggestions with up/down. 
            if (code !== $.ui.keyCode.UP && code !== $.ui.keyCode.DOWN) {
                var usersText = $(this).val();

                if(usersText == ''){
                    addInput.autocomplete("option", "source", []);
                }
                else{
                    userInputHasChanged = false;
                    showSongSuggestions(usersText);
                }
            }
        }).bind('paste drop', function () {
            parseUrlInput();
        });

        //Searches youtube for song results based on the given text.
        //Places 11 song objects in the auto-complete source and displaying the songs name as label.
        var showSongSuggestions = function (text) {
            YTHelper.search(text, function (videos) {
                if(!userInputHasChanged){
                    var songTitles = [];

                    //Only show up to 11 song suggestions as that is what fits on the display.
                    for (var videoIndex = 0; videoIndex < videos.length && videoIndex < 11; videoIndex++) {
                        var video = videos[videoIndex];
                        //I wanted the label to be duration | title to help delinate between typing suggestions and actual songs.
                        var label = Helpers.prettyPrintTime(video.duration) + " | " + video.title;
                        songTitles.push({ label: label, value: video});
                    }

                    //Show songs found instead of suggestions.
                    addInput.autocomplete("option", "source", songTitles);
                    addInput.autocomplete("search", '');
                }
            });
        };
    }();

    var parseUrlInput = function () {
        //Wrapped in a timeout to support 'rightclick->paste' 
        setTimeout(function () {
            var videoId = YTHelper.parseUrl(addInput.val());

            //If found a valid YouTube link then just add the video.
            if (videoId) {
                songListHeader.flashMessage('Thanks!', 2000);

                var playable = YTHelper.isPlayable(videoId, function (isPlayable) {
                    if (!isPlayable) {
                        //Notify the user that the song they attempted to add had content restrictions, ask if it is OK to find a replacement.
                        YTHelper.getVideoInformation(videoId, function(videoInformation){
                            if (videoInformation != null){
                                chrome.extension.getBackgroundPage().SongValidator.validateSongById(videoId, function(playedSuccessfully){
                                    if(playedSuccessfully){
                                        Player.addSongById(videoId);
                                    }
                                    else{
                                       Dialogs.showReplacedSongNotification();
                                        YTHelper.findPlayableByVideoId(videoId, function(playableSong){
                                            Player.addSongById(playableSong.videoId);
                                        });
                                    }
                                });
                            }
                            else{
                                Dialogs.showBannedSongDialog();
                            }
                        });
                    }
                    else {
                        chrome.extension.getBackgroundPage().SongValidator.validateSongById(videoId, function(isPlayable){
                            console.log("isPlayable?", isPlayable);
                            if(isPlayable){
                                Player.addSongById(videoId);
                            }
                            else{
                                Dialogs.showReplacedSongNotification();
                                YTHelper.findPlayableByVideoId(videoId, function(playableSong){
                                    Player.addSongById(playableSong.videoId);
                                });
                            }
                        });
                    }
                });
            }
        });
    };
}