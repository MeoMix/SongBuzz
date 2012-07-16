//A progress bar which shows the elapsed time as compared to the total time of the current song.
//Changes colors based on player state -- yellow when paused, green when playing.
function progressbar(currentTime, totalTime) {
    var _selector = $('#progress');

    if(currentTime && totalTime){
        _selector.prop('max', totalTime);
        _selector.val(currentTime);
    }

    //Keep track of when the user is changing the value so that our update interval does not conflict.
    var _userChangingValue = false;
    _selector.mousedown(function(){
        _userChangingValue = true;
    })

    //Bind to selector mouse-up to support dragging as well as clicking.
    //I don't want to send a message until drag ends, so mouseup works nicely.
    _selector.mouseup(function(){
        Player.seekTo(_selector.val());

        //Once the user has seeked to the new value let our update function run again.
        //Wrapped in a set timeout because there is some delay before the seekTo and the equivalent of flickering happens.
        setTimeout(function(){
            _userChangingValue = false;
        }, 1500);
    })

    _selector.change(function(){
        _repaint();
    })

    var _repaint = function(){
        var elapsedTime = _selector.val();
        var totalTime = _selector.prop('max');

        var progressFillAmount = totalTime == 0 ? 0 : elapsedTime / totalTime;

        _selector.css('background-image', '-webkit-gradient(linear,left top, right top, from(#ccc), color-stop('+ progressFillAmount +',#ccc), color-stop('+ progressFillAmount+',rgba(0,0,0,0)), to(rgba(0,0,0,0)))')
    }

    //A nieve way of keeping the progress bar up to date. 
    var _timeMonitorInterval = setInterval(function () { return _update(); }, 500);

    var _update = function(){
        if(!_userChangingValue) {
            var currentTime = Player.getCurrentTime();
            progressbar.setElapsedTime(currentTime);

            var totalTime = Player.getTotalTime();
            progressbar.setTotalTime(totalTime);
        }
    }

    var progressbar = {
        setElapsedTime: function (value) {
            _selector.val(value);
            _repaint();
        },

        setTotalTime: function (maxValue) {
            _selector.prop('max', maxValue);
            _repaint();
        }
    };

    return progressbar;
}