//Displays the currently playing song or a default welcome message.
function header() {
    var _header = $('#Header');
    var _title = $('#HeaderTitle');
    var _defaultCaption = 'Welcome to SongBuzz!';

    //Scroll the song in the title if its too long to read.
    _title.mouseover(function (e) {
        var distanceToMove = $(this).width() - _header.width();
        var timeToTakeMoving = 30 * distanceToMove; //Just a feel good value, scales as the text gets longer so takes the same time.
        $(this).animate({ marginLeft: "-" + distanceToMove + "px" }, timeToTakeMoving);
    }).mouseout(function (e) {
        $(this).stop(true).animate({ marginLeft: "0px" });
    });

    var header = {
        updateTitle: function (currentSong) {
            var text = currentSong ? currentSong.name : _defaultCaption;
            _title.text(text);
        }
    }
    return header;
}