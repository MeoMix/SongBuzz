//A progress bar which shows the elapsed time as compared to the total time of the current song.
//Changes colors based on player state -- yellow when paused, green when playing.
function progressbar(currentTime, totalTime, timeDisplay) {
    var selector = $('#progress');

    //Repaints the progress bar's filled-in amount based on the % of time elapsed for current song.
    var repaint = function(){
        var elapsedTime = selector.val();
        var totalTime = selector.prop('max');

        //Don't divide by 0.
        var fill = totalTime != 0 ? elapsedTime / totalTime : 0;
        var backgroundImage = '-webkit-gradient(linear,left top, right top, from(#ccc), color-stop('+ fill +',#ccc), color-stop('+ fill+',rgba(0,0,0,0)), to(rgba(0,0,0,0)))';
        selector.css('background-image', backgroundImage)
    }

    //If a song is currently playing when the GUI opens then initialize with those values.
    if(currentTime && totalTime){
        selector.prop('max', totalTime);
        selector.val(currentTime);
        repaint();
    }

    //Keep track of when the user is changing the value so that our update interval does not conflict.
    var userChangingValue = false;
    selector.mousedown(function(){
        userChangingValue = true;
    })

    //Bind to selector mouse-up to support dragging as well as clicking.
    //I don't want to send a message until drag ends, so mouseup works nicely.
    selector.mouseup(function(){
        Player.seekTo(selector.val());

        //Once the user has seeked to the new value let our update function run again.
        //Wrapped in a set timeout because there is some delay before the seekTo and the equivalent of flickering happens.
        setTimeout(function(){
            userChangingValue = false;
        }, 1500);
    })

    selector.change(function(){
        repaint();
        //TODO: Decouple timeDisplay from progressBar if possible.
        timeDisplay.update(selector.val());
    })

    //A nieve way of keeping the progress bar up to date. 
    var timeMonitorInterval = setInterval(function () { return update(); }, 500);

    //Pause the GUI's refreshes for updating the timers while the user is dragging the song time slider around.
    var update = function(){
        if(!userChangingValue) {
            var currentTime = Player.getCurrentTime();
            progressbar.setElapsedTime(currentTime);

            var totalTime = Player.getTotalTime();
            progressbar.setTotalTime(totalTime);
        }
    }

    return {
        setElapsedTime: function (value) {
            selector.val(value);
            repaint();
        },

        setTotalTime: function (maxValue) {
            selector.prop('max', maxValue);
            repaint();
        }
    };
}