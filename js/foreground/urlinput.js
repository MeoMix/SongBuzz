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
                    if (_source == Source.TYPING_SUGGEST)
                        _analyzeForSong(ui.item.value);
                    else if (_source == Source.SONG_SUGGEST) {
                        event.preventDefault();
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
                songTitles.push({ label: videos[videoIndex].title, value: videos[videoIndex] });
            }

            _source = Source.SONG_SUGGEST;
            _input.autocomplete("option", "source", songTitles);
            _input.autocomplete("search", '');
        });
    }

    //Validate URL input on enter key.
    //Otherwise show suggestions. Use keyup event because input's val is updated at that point.
    _input.keyup(function (e) {
        _analyzeForSuggestion();
        var code = e.which;
        if (code == 13) {
            e.preventDefault();
            _validateInput();
        }
    }).bind('paste drop', function () { return _validateInput(); });

    var _flashMessage = function (message, durationInMilliseconds) {
        console.log(_input);

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

            YTHelperjqu.search(songName, function (response) {
                var playableSong = null;
                for (var videoIndex = 0; videoIndex < response.videos.length; videoIndex++) {
                    if (YTHelper.isPlayable(response.videos[videoIndex])) {
                        playableSong = response.videos[videoIndex];
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