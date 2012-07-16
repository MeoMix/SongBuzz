//The input control where users may add songs via URL or search with queries.
//TODO: This has gotten a bit bulky. I suspect it will be OK again once I transition song suggestions into a dialog, though.
function urlInput() {
    //TODO: This is a hackjob. I am going to have the 'Song Suggest' become a pop-up window instead of an auto-complete suggestion in the future.
    //I use this to keep track of what state the URL input is in -- nothing, displaying suggestions as the user types, or displaying songs.
    var Source = Object.freeze({
        NONE : 0,
        TYPING_SUGGEST : 1,
        SONG_SUGGEST : 2
    });

    var _placeholder = 'Search or Enter YouTube URL';
    var _input = $('#addSongInput');
    var _button = $('#addSongButton');
    var _icon = $('#addSongCancelIcon');
    var _source = Source.NONE;
    _input.attr('placeholder', _placeholder);

    var addopened = false;
    $('#addSongButton').click( function(){
        if(addopened == false){
            _input.css('opacity', 1).css('cursor', "auto");
            _icon.css('right', '0px');
            _button.width('350px');
            _input.focus();
            addopened = true; 
        }
    });

    $('#addSongCancelIcon').click(function(){
        if(addopened == true){
            _input.css('opacity', 0).css('cursor', "pointer").blur();
            _icon.css('right', '-30px');
            _button.width('120px');
            setTimeout(function(){addopened=false;},500);
        }
    });

    _input.autocomplete({
        source: [],
        position: {
            my: "left top",
            at: "left bottom"
        } ,
        minLength: 0, //Necessary for hackjob -- minLength: 0 allows empty search triggers for changing between 
        select: function (event, ui) {
            //When the user selects a song suggestion the auto-complete source will change from suggestions to playable songs.
            event.preventDefault();

            if (_source == Source.TYPING_SUGGEST)
                _analyzeForSong(ui.item.value);
            else if (_source == Source.SONG_SUGGEST) {
                Player.addSongById(ui.item.value.videoId);
                _flashMessage('Thanks!', 2000);
            }
        }
    });

    var _analyzeForSuggestion = function () {
        YTHelper.suggest(_input.val(), function (suggestions) {
            _source = Source.TYPING_SUGGEST;
            _input.autocomplete("option", "source", suggestions);
        });
    }

    var _analyzeForSong = function (text) {
        YTHelper.search(text, function (videos) {
            var songTitles = new Array();

            //Only show up to 11 song suggestions as that is what fits on the display.
            for (var videoIndex = 0; videoIndex < videos.length && videoIndex < 11; videoIndex++) {
                var video = videos[videoIndex];
                var label = GetTimeFromSeconds(video.duration) + " | " + video.title;

                songTitles.push({ label: label, value: video});
            }

            _source = Source.SONG_SUGGEST;
            //Show songs found instead of suggestions.
            _input.autocomplete("option", "source", songTitles);
            _input.autocomplete("search", '');
        });
    }

    //Validate URL input on enter key.
    //Otherwise show suggestions. Use keyup event because input's val is updated at that point.
    _input.keyup(function (e) {
        var code = e.which;

        //User can navigate suggestions with up/down. 
        //UP: 38, DOWN: 40
        if (code != 38 && code != 40) {
            _analyzeForSuggestion();

            if (code == KEYCODES.ENTER) {
                e.preventDefault();
                _validateInput();
            }
        }
    }).bind('paste drop', function () { return _validateInput(); });

    //Display a message for X milliseconds inside of the input. 
    var _flashMessage = function (message, durationInMilliseconds) {
        _input.val('').blur().attr('placeholder', message);
        window.setTimeout(function () {
            _input.attr('placeholder', _placeholder);
        }, durationInMilliseconds);
    };

    var _ensurePlayable = function (songId, callback) {
        //http://apiblog.youtube.com/2011/12/understanding-playback-restrictions.html
        $.getJSON('http://gdata.youtube.com/feeds/api/videos/' + songId + '?v=2&alt=json-in-script&format=5&callback=?', function (youtubeVideo) {
            callback(YTHelper.isPlayable(youtubeVideo));
        });
    }

    //Searches for a (hopefully) similiar song to play when the current song has content restrictions.
    //TODO: I need an algorithm to determine if a song is mostly the same. Consider: title, song length, keywords.
    var _findPlayable = function (songId, callback) {
        $.getJSON('http://gdata.youtube.com/feeds/api/videos/' + songId + '?v=2&alt=json-in-script&callback=?', function (data) {
            var songName = data.entry.title.$t;

            YTHelper.search(songName, function (videos) {
                var playableSong = null;
                for (var videoIndex = 0; videoIndex < videos.length; videoIndex++) {
                    if (YTHelper.isPlayable(videos[videoIndex])) {
                        playableSong = videos[videoIndex];
                        break;
                    }
                }

                callback(playableSong);
            });
        });
    }

    var _validateInput = function () {
        //Wrapped in a timeout to support 'rightclick->paste' 
        setTimeout(function () {
            var songId = _getSongIdFromInput();

            //If found a valid YouTube link then just add the video.
            if (songId) {
                var playable = _ensurePlayable(songId, function (isPlayable) {
                    console.log("isPlayable: " + isPlayable);
                    if (!isPlayable) {
                        //Notify the user that the song they attempted to add had content restrictions, ask if it is OK to find a replacement.
                        $('#ConfirmSearchDialog').dialog({
                            autoOpen: true,
                            modal: true,
                            buttons: {
                                "Confirm": function () {
                                    $(this).dialog("close");
                                    //Find a replacement.
                                    _findPlayable(songId, function (playableSong) {
                                        Player.addSongById(playableSong.videoId);
                                        _flashMessage('Thanks!', 2000);
                                    });
                                },
                                "Cancel": function () {
                                    $(this).dialog("close");
                                }
                            }
                        });
                    }
                    else {
                        Player.addSongById(songId);
                        _flashMessage('Thanks!', 2000);
                    }
                });
            }
            else {
                //If gave something other than a trimmed empty string - search YouTube automatically.
                var value = _input.val().replace(/^\s+|\s+$/g, "");

                if (value && value != '') {
                    _analyzeForSong(value);
                }
            }
        });
    };

    //Looks for a YouTube song ID inside of the input's value and returns the ID if found.
    var _getSongIdFromInput = function () {
        var userInput = _input.val();

        var songId = $.url(userInput).param('v');

        if (!songId) {
            //TODO: match better / more maintainably.
            var match = _input.val().match(/^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/);
            if (match && match[7].length == 11)
                songId = match[7];
        }

        return songId;
    };

    //When user focuses input, remove the text being displayed to allow them to type.
    //When user blurs input, replace text with previously-displayed.
    $(function () {
        //Remember the old filler text and be able to replace it.
        var placeholderText = "";
        _input.focus(function () {
            placeholderText = $(this).attr('placeholder') == '' ? placeholderText : $(this).attr('placeholder');
            $(this).attr('placeholder', '');
        }).blur(function () {
            $(this).attr('placeholder', placeholderText);
        });
    });
}