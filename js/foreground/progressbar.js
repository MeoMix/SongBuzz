//A progress bar which shows the elapsed time as compared to the total time of the current song.
//Changes colors based on player state -- yellow when paused, green when playing.
function progressbar(currentTime, totalTime) {
    var _selector = $('#progress');

    if(currentTime && totalTime){
        _selector.prop('max', totalTime);
        _selector.val(currentTime);
    }

    var _updateProgressBarFill = function(){
        var elapsedTime = _selector.val();
        var totalTime = _selector.prop('max');

        _selector.css('background-image', '-webkit-gradient(linear,left top, right top, from(#ccc), color-stop('+ elapsedTime/totalTime +',#ccc), color-stop('+ elapsedTime/totalTime+',rgba(0,0,0,0)), to(rgba(0,0,0,0)))')
    }

    var progressbar = {
        setElapsedTime: function (value) {
            _selector.val(value);
            _updateProgressBarFill();
        },

        setTotalTime: function (maxValue) {
            _selector.prop('max', maxValue);
            _updateProgressBarFill();
        }
    };

    return progressbar;
}