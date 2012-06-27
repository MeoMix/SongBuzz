function uiElements() {
    //Vertical tabs
    $("#tabs").tabs().addClass('ui-tabs-vertical ui-helper-clearfix').removeClass('ui-widget-content');
    $("#tabs li").removeClass('ui-corner-top').addClass('ui-corner-left');
    $('#tabs').show();
    //Private Fields
    var currentTime = 0;
    var totalTime = 0;

    var _currentTimeLabel = $('#CurrentTimeLabel');
    var _totalTimeLabel = $('#TotalTimeLabel');
    if (Player) {
        currentTime = Player.getCurrentTime();
        totalTime = Player.getTotalTime();
        _currentTimeLabel.text(GetTimeFromSeconds(currentTime));
        _totalTimeLabel.text(GetTimeFromSeconds(totalTime));
    }
    
    var _timeMonitorInterval = setInterval(function () { return _updateTime(); }, 500);
    var _playerControls = playerControls();
    var _header = header();
    var _songGrid = songGrid();
    var _settings = settings();
    var _progressbar = progressbar(currentTime, totalTime);
    urlInput(); //No public methods so no object returned.

    var _updateTime = function () {
        var currentTime = Player.getCurrentTime();
        _currentTimeLabel.text(GetTimeFromSeconds(currentTime));
        _progressbar.setValue(currentTime);

        var totalTime = Player.getTotalTime();
        _totalTimeLabel.text(GetTimeFromSeconds(totalTime));
        _progressbar.setMaxValue(totalTime);
    };

    var uiElements = {
        updateWithMessage: function (message) {
            var playerState = message.playerState;
            switch (playerState) {
                case PlayerStates.ENDED:
                case PlayerStates.VIDCUED:
                case PlayerStates.PAUSED:
                    _playerControls.setToggleMusicToPlay();
                    _progressbar.setToYellow();
                    break;
                case PlayerStates.PLAYING:
                    //Volume only becomes available once a video has become cued or when popup reopens.
                    var volume = Player.getVolume();
                    _playerControls.setVolume(volume);
                    _playerControls.setToggleMusicToPause();
                    _progressbar.setToGreen();
                    break;
            }

            var songs = message.songs;
            _playerControls.setEnableToggleMusicButton(songs.length > 0);
            _playerControls.setEnableSkipButton(songs.length > 1);
            _playerControls.setEnableShuffleButton(songs.length > 1);

            var currentSong = message.currentSong;
            _songGrid.reload(songs, currentSong);
            _header.updateTitle(currentSong);
        }
    }

    return uiElements;
}