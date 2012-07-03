//The GUI.
function uiElements() {
    $('.menubutton').click(function(){
        if(!$(this).hasClass('active')){
            $('.menubutton').removeClass('active');
            $(this).addClass('active');
            $('.content').hide();

            switch(this.id){
                case 'HomeMenuButton':
                    $('#HomeContent').show();
                break;
                case 'PlaylistsMenuButton':
                    $('#PlaylistsContent').show();
                break;
                case 'SettingsMenuButton':
                    $('#SettingsContent').show();
                break;
            }

        }
    })

    //Private Fields
    var currentTime = 0;
    var totalTime = 0;

    var _currentTimeLabel = $('#CurrentTimeLabel');
    var _totalTimeLabel = $('#TotalTimeLabel');
    //Player will exist if GUI is opened after the first time. In this scenario -- don't show old data while waiting for a message from the Player. Go get it now.
    if (Player) {
        currentTime = Player.getCurrentTime();
        totalTime = Player.getTotalTime();
        _currentTimeLabel.text(GetTimeFromSeconds(currentTime));
        _totalTimeLabel.text(GetTimeFromSeconds(totalTime));
    }
    
    //A nieve way of keeping the time up to date. 
    var _timeMonitorInterval = setInterval(function () { return _updateTime(); }, 500);
    var _playerControls = playerControls();
    var _header = header();
    var _songGrid = songGrid();
    var _settings = settings();
    var _progressbar = progressbar(currentTime, totalTime);
    urlInput(); //No public methods so no object returned.

    //In charge of updating the time labels and (for now) the progressbar which represents elapsed time.
    var _updateTime = function () {
        var currentTime = Player.getCurrentTime();
        _currentTimeLabel.text(GetTimeFromSeconds(currentTime));
        _progressbar.setElapsedTime(currentTime);

        var totalTime = Player.getTotalTime();
        _totalTimeLabel.text(GetTimeFromSeconds(totalTime));
        _progressbar.setTotalTime(totalTime);
    };

    var uiElements = {
        //Refereshes the visual state of the GUI after the Player broadcasts a message.
        //This keeps the GUI synced with the background. The GUI needs to respond to the background because the background
        //continues to exist while the GUI can disappear.
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

            var currentSong = message.currentSong;
            _songGrid.reload(songs, currentSong);
            _header.updateTitle(currentSong);
        }
    }

    return uiElements;
}