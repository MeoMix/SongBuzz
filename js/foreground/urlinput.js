function urlInput() {
    var Source = Object.freeze({
        NONE : 0,
        TYPING_SUGGEST : 1,
        SONG_SUGGEST : 2
    });

    var _placeholder = 'Enter a YouTube song name or URL here!';
    var _input = $('#songUrlInput');
    var _source = Source.NONE;
    _input.attr('placeholder', _placeholder);

    var urlInput = {
        initialize: function () {
            $('#songUrlInput').autocomplete({
                source: [],
                minLength: 0,
                select: function (event, ui) {
                    event.preventDefault();

                    if (_source == Source.TYPING_SUGGEST)
                        _analyzeForSong(ui.item.value);
                    else if (_source == Source.SONG_SUGGEST) {
                        Player.addSongById(ui.item.value.videoId);
                        _flashMessage('Thanks!', 2000);
                    }
                }
            });
        }
    }

    urlInput.initialize();

    var _analyzeForSuggestion = function () {
        YTHelper.suggest(_input.val(), function (suggestions) {
            _source = Source.TYPING_SUGGEST;
            _input.autocomplete("option", "source", suggestions);
        });
    }

    var _analyzeForSong = function (text) {
        YTHelper.search(text, function (videos) {
            var songTitles = new Array();

            for (var videoIndex = 0; videoIndex < videos.length; videoIndex++) {
                var video = videos[videoIndex];
                var label = GetTimeFromSeconds(video.duration) + " | " + video.title;

                songTitles.push({ label: label, value: video});
            }

            _source = Source.SONG_SUGGEST;
            _input.autocomplete("option", "source", songTitles);
            _input.autocomplete("search", '');
        });
    }

    var KEYCODES = Object.freeze({
        BACKSPACE: 8,
        COMMA: 188,
        DELETE: 46,
        DOWN: 40,
        END: 35,
        ENTER: 13,
        ESCAPE: 27,
        HOME: 36,
        LEFT: 37,
        NUMPAD_ADD: 107,
        NUMPAD_DECIMAL: 110,
        NUMPAD_DIVIDE: 111,
        NUMPAD_ENTER: 108,
        NUMPAD_MULTIPLY: 106,
        NUMPAD_SUBTRACT: 109,
        PAGE_DOWN: 34,
        PAGE_UP: 33,
        PERIOD: 190,
        RIGHT: 39,
        SPACE: 32,
        TAB: 9,
        UP: 38
    });

    //Validate URL input on enter key.
    //Otherwise show suggestions. Use keyup event because input's val is updated at that point.
    _input.keyup(function (e) {
        var code = e.which;

        //User can navigate suggestions with up/down. Felt right to include left/right.
        if (code != KEYCODES.UP && code != KEYCODES.DOWN && code != KEYCODES.LEFT && code != KEYCODES.RIGHT) {
            _analyzeForSuggestion();

            if (code == KEYCODES.ENTER) {
                e.preventDefault();
                _validateInput();
            }
        }
    }).bind('paste drop', function () { return _validateInput(); });

    var _flashMessage = function (message, durationInMilliseconds) {
        _input.val('').blur().attr('placeholder', message);
        window.setTimeout(function () {
            _input.attr('placeholder', _placeholder);
        }, durationInMilliseconds);
    };

    var _ensurePlayable = function (songId, callback) {
        //http://apiblog.youtube.com/2011/12/understanding-playback-restrictions.html
        //TODO: Restrict by geo-location.
        $.getJSON('http://gdata.youtube.com/feeds/api/videos/' + songId + '?v=2&alt=json-in-script&format=5&callback=?', function (youtubeVideo) {
            callback(YTHelper.isPlayable(youtubeVideo));
        });
    }

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

                    //Search
                    if (!isPlayable) {

                        $('#ConfirmSearchDialog').dialog({
                            autoOpen: true,
                            modal: true,
                            buttons: {
                                "Confirm": function () {
                                    $(this).dialog("close");
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

    var _getSongIdFromInput = function () {
        var userInput = _input.val();

        var songId = $.url(userInput).param('v');

        if (!songId) {
            //TODO: match better
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