//Holds onto the currentTime and totalTime song labels as well as the elapsed time progress bar.
function timeDisplay(){
    //Player will exist if UI is opened after the first time. If player exists initialize with current data to prevent flickering. 
    var currentTime = Player ? Player.getCurrentTime() : 0;
    var totalTime = Player ? Player.getTotalTime() : 0;

    var _currentTimeLabel = $('#CurrentTimeLabel').text(SecondsToPrettyPrintTime(currentTime));
    var _totalTimeLabel = $('#TotalTimeLabel').text(SecondsToPrettyPrintTime(totalTime));

    //A nieve way of keeping the time up to date. 
    var _timeMonitorInterval = setInterval( function () {
        return timeDisplay.update(); 
    }, 500);

    var timeDisplay = {    
        //In charge of updating the time labels and (for now) the progressbar which represents elapsed time.
        update : function(currentTimeInSeconds){
            //If told to update to a specific time (by user interaction) then use that time, otherwise get the players current time (automatic update)
            var currentTime = currentTimeInSeconds ? currentTimeInSeconds : Player.getCurrentTime();
             _currentTimeLabel.text(SecondsToPrettyPrintTime(currentTime));

            var totalTime = Player.getTotalTime();
            _totalTimeLabel.text(SecondsToPrettyPrintTime(totalTime));
        }
    }

    var _progressbar = progressbar(currentTime, totalTime, timeDisplay);
}