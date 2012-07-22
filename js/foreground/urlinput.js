//The songs tab header. Users may add songs by clicking on Add Songs or click-and-holding on Add Songs.
//Clicking Add Songs will allow the user to either search w/ auto-complete suggestions, or to paste youtube URLs into the input.
//Alternatively, the user can click-and-hold on the button which will cause all open tabs to be parsed for songs.
//TODO: This has gotten a bit bulky.
function urlInput(songListHeader) {
    var _addInput = $('#CurrentSongDisplay .addInput').attr('placeholder', 'Search or Enter YouTube URL');
    var _addButton = $('#CurrentSongDisplay .addButton');

    //If the user clicks and holds for 3 seconds on the +Add Songs button, search through all open tabs for songs.
    var clickHoldSearchTabs = function(){
        //Retrieves all currently open tabs, gets each of their URLs, and looks for a song id.
        //If a song id is found and it is playable -- add it. If it is restricted, add to a list to prompt the user
        //to search for similar videos.
        _addSongsFromOpenTabs = function(){
            chrome.tabs.query({}, function(tabs){
                var tabsProcessed = 0;
                var restrictedSongs = [];
                $(tabs).each(function(){
                    var songId = YTHelper.parseUrl(this.url); 

                    if (songId) {
                        var playable = YTHelper.isPlayable(songId, function (isPlayable) {
                            if (!isPlayable) {
                                var song = new Song(songId, songAfterCreated);

                                songAfterCreated = function(){
                                    tabsProcessed++;
                                    restrictedSongs.push(song);

                                    //Notify user that all songs in restrictedSongs were unable to be played and prompt for action.
                                    //TODO: Don't repeat code just because there is a callback function.
                                    if(tabsProcessed == tabs.length)
                                        _showRestrictedSongDialog(restrictedSongs);
                                };
                            }
                            else {
                                tabsProcessed++;
                                Player.addSongById(songId);
                                songListHeader.flashMessage('Thanks!', 2000);
                            }
                        });
                    }
                    else
                        tabsProcessed++;

                    if(tabsProcessed == tabs.length)
                        _showRestrictedSongDialog(restrictedSongs);
                });
            });
        };

        //Detect mouse downs on the button and start a timer event. If the user leaves the button
        //before the timer event finishes -- cancel it, otherwise run it.
        var timeoutId = 0;
        var clickEvent = null;
        _addInput.mousedown(function() {
            timeoutId = setTimeout( function(){
                //Remove the click event because the add button should not expand after a successful click-and-hold.
                clickEvent = _addButton.click;
                _addButton.off('click');
                _addSongsFromOpenTabs();
            }, 3000);
        }).bind('mouseup mouseleave', function() {
            clearTimeout(timeoutId);
            _addButton.on(clickEvent);
        });
    }();

    //Provides the drop-down suggestions and song suggestions.
    _addInput.autocomplete({
        source: [],
        position: {
            my: "left top",
            at: "left bottom"
        } ,
        minLength: 0, //minLength: 0 allows empty search triggers for changing between search suggestions and song suggestions.
        focus: function(event, ui){
            //Don't change the input as the user changes selections.
            return false;
        },
        select: function (event, ui) {
            //Selected value is a string when providing song suggestions and a song object when selecting a video to add.
            //When the user selects a song suggestion the auto-complete source will change from suggestions to playable songs.
            if(typeof(ui.item.value) == 'string'){
                _showSongSuggestions(ui.item.value);
            }
            else {
                event.preventDefault(); //Don't change the text when user clicks their song selection.
                Player.addSongById(ui.item.value.videoId);
                songListHeader.flashMessage('Thanks!', 2000);
            }
        }
    });

    //Searches youtube for song results based on the given text.
    //Places 11 song objects in the auto-complete source and displaying the songs name as label.
    var _showSongSuggestions = function (text) {
        YTHelper.search(text, function (videos) {
            var songTitles = new Array();

            //Only show up to 11 song suggestions as that is what fits on the display.
            for (var videoIndex = 0; videoIndex < videos.length && videoIndex < 11; videoIndex++) {
                var video = videos[videoIndex];
                //I wanted the label to be duration | title to help delinate between typing suggestions and actual songs.
                var label = Date.secondsToPrettyPrintTime(video.duration) + " | " + video.title;
                songTitles.push({ label: label, value: video});
            }

            //Show songs found instead of suggestions.
            _addInput.autocomplete("option", "source", songTitles);
            _addInput.autocomplete("search", '');
        });
    }

    //Validate URL input on enter key.
    //Otherwise show suggestions. Use keyup event because input's val is updated at that point.
    _addInput.keyup(function (e) {
        var code = e.which;

        //User can navigate suggestions with up/down. 
        //UP: 38, DOWN: 40, ENTER: 13
        if (code != 38 && code != 40) {
            //Change the autocomplete suggestions as the user types.
            YTHelper.suggest($(this).val(), function (suggestions) {
                _addInput.autocomplete("option", "source", suggestions);
            });

            //If the user hits submit then search with what has been entered.
            if (code == 13) {
                e.preventDefault();
                _parseUrlInput();
            }
        }
    }).bind('paste drop', function () { return _parseUrlInput(); });

    var _parseUrlInput = function () {
        //Wrapped in a timeout to support 'rightclick->paste' 
        setTimeout(function () {
            var songId = YTHelper.parseUrl(_addInput.val());

            //If found a valid YouTube link then just add the video.
            if (songId) {
                var playable = YTHelper.isPlayable(songId, function (isPlayable) {
                    if (!isPlayable) {
                        //Notify the user that the song they attempted to add had content restrictions, ask if it is OK to find a replacement.
                        var song = new Song(songId, function () {
                            _showRestrictedSongDialog(song);
                        });
                    }
                    else {
                        Player.addSongById(songId);
                        songListHeader.flashMessage('Thanks!', 2000);
                    }
                });
            }
        });
    };

    //A dialog which displays any songs that were found to have content restrictions.
    //The dialog comes with check boxes on the side which allow the user to indicate which
    //songs they want to attempt to find replacements for and which songs to ditch.
    _showRestrictedSongDialog = function(restrictedSongs){
        if(restrictedSongs) {
            var _restrictedSongDialog = $('#RestrictedSongDialog');
            var _restrictedSongList = _restrictedSongDialog.find('#RestrictedSongList ul');

            _restrictedSongList.empty();
            //Build up each row of song item + checkbox.
            $(restrictedSongs).each(function(){
                var listItem = $('<li/>').appendTo(_restrictedSongList);

                var restrictedSongLink = $('<a/>', {
                    id: this.songId,
                    href: '#' + this.songId,
                    text: this.name
                }).appendTo(listItem);

                var findPlayableCheckBox = $('<input/>', {
                    type: 'checkbox',
                    songid: this.songId
                }).appendTo(listItem);
            })

            //Show the dialog once everything is ready.
            _restrictedSongDialog.dialog({
                autoOpen: true,
                modal: true,
                buttons: {
                    "Confirm": function () {
                        $(this).dialog("close");

                        //If the user confirms then go find each checked song and find a replacement for it.
                        _restrictedSongList.find('input').each(function(){
                            if(this.checked){
                                YTHelper.findPlayable($(this).attr('songid'), function(playableSong){
                                    Player.addSongById(playableSong.videoId);
                                }) 
                            }
                        })
                    },
                    "Cancel": function () {
                        $(this).dialog("close");
                    }
                }
            })
        }
    }
}