function uiElements() {
    //Vertical tabs
    $("#tabs").tabs().addClass('ui-tabs-vertical ui-helper-clearfix');
    $("#tabs li").removeClass('ui-corner-top').addClass('ui-corner-left');
    $('#tabs').show();
    //Private Fields
    var _currentTime = $('#CurrentTime');
    var _totalTime = $('#TotalTime');
    var _timeMonitorInterval = setInterval(function () { return _updateTime(); }, 500);
    var _playerControls = playerControls();
    var _header = header();
    var _songGrid = songGrid();
    var _settings = settings();

    urlInput(); //No public methods so no object returned.



    var _updateTime = function () {
        var currentTime = Player.getCurrentTime();
        _currentTime.text(currentTime);

        var totalTime = Player.getTotalTime();
        _totalTime.text(totalTime);
        //Set display bar to represent progress;
        //TODO: http://stackoverflow.com/questions/9628603/can-i-set-a-divs-background-to-be-two-different-images-filled-to-2-different
        //console.log($('.ui-widget-header').css('background-image'));
    }

    var uiElements = {
        updateWithMessage: function (message) {
            var playerState = message.playerState;
            switch (playerState) {
                case PlayerStates.ENDED:
                case PlayerStates.VIDCUED:
                case PlayerStates.PAUSED:
                    _playerControls.setToggleMusicToPlay();
                    break;
                case PlayerStates.PLAYING:
                    //Volume only becomes available once a video has become cued or when popup reopens.
                    var volume = Player.getVolume();
                    _playerControls.setVolume(volume);
                    _playerControls.setToggleMusicToPause();
                    break;
            }

            var songs = message.songs;
            _playerControls.setEnableToggleMusicButton(songs.length > 0);
            _playerControls.setEnableSkipButton(songs.length > 1);
            _playerControls.setEnableShuffleButton(songs.length > 1);

            //            if (currentSong)
            //                $.getJSON('http://gdata.youtube.com/feeds/api/videos/' + currentSong.songId + '/related?v=2&alt=jsonc&callback=?', function (data) {
            //                    console.log(data);
            //                });

            var currentSong = message.currentSong;
            _songGrid.reload(songs, currentSong);
            _header.updateTitle(playerState, currentSong);
        }
    }

    return uiElements;
}