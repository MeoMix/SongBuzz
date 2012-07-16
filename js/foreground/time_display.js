//Holds onto the currentTime and totalTime song labels as well as the elapsed time progress bar.
function timeDisplay(){
     //Player will exist if UI is opened after the first time. If player exists initialize with current data to prevent flickering. 
    var currentTime = Player ? Player.getCurrentTime() : 0;
    var totalTime = Player ? Player.getTotalTime() : 0;

    var _progressbar = progressbar(currentTime, totalTime);
    var _currentTimeLabel = $('#CurrentTimeLabel');
    var _totalTimeLabel = $('#TotalTimeLabel');

    _currentTimeLabel.text(GetTimeFromSeconds(currentTime));
    _totalTimeLabel.text(GetTimeFromSeconds(totalTime));

    //A nieve way of keeping the time up to date. 
    var _timeMonitorInterval = setInterval(function () { return _update(); }, 500);

    //In charge of updating the time labels and (for now) the progressbar which represents elapsed time.
    var _update = function () {
        var currentTime = Player.getCurrentTime();
        _currentTimeLabel.text(GetTimeFromSeconds(currentTime));

        var totalTime = Player.getTotalTime();
        _totalTimeLabel.text(GetTimeFromSeconds(totalTime));
    };
}