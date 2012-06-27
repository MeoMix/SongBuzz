function header() {
    var _header = $('#Header');
    var _title = $('#HeaderTitle');
    var _defaultCaption = 'Welcome to SongBuzz!';

    //TODO: Implement;
    //            $('.ui-jqgrid-title').wrap('<div id="ProgressHeader" />');
    //            $('#ProgressHeader').height($('.ui-jqgrid-title').height()).width(0).addClass('idleBackground');

    //Scroll the song in the title if its too long to read.
    _title.mouseover(function (e) {
        var distanceToMove = $(this).width() - _header.width();
        var timeToTakeMoving = 30 * distanceToMove; //Just a feel good value, scales as the text gets longer so takes the same time.
        $(this).animate({ marginLeft: "-" + distanceToMove + "px" }, timeToTakeMoving);
    }).mouseout(function (e) {
        $(this).stop(true).animate({ marginLeft: "0px" });
    });


    var header = {
        updateTitle: function (playerState, currentSong) {
            var text = currentSong ? currentSong.name : _defaultCaption;
            _title.text(text);

            if (currentSong) {
                switch (playerState) {
                    case PlayerStates.PLAYING:
                        _header.removeClass('idleBackground pausedBackground').addClass('playingBackground');
                        break;
                    case PlayerStates.PAUSED:
                    case PlayerStates.VIDCUED:
                        _header.removeClass('idleBackground playingBackground').addClass('pausedBackground');
                        break;
                }
            }
            else {
                _header.removeClass('idleBackground playingBackground').addClass('idleBackground');
            }

        }
    }

    return header;
}