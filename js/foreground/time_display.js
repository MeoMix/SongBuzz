//Holds onto the currentTime and totalTime song labels as well as the elapsed time progress bar.
function TimeDisplay(){
    //Player will exist if UI is opened after the first time. If player exists initialize with current data to prevent flickering. 
    var currentTime = Player ? Player.getCurrentTime() : 0;
    var totalTime = Player ? Player.getTotalTime() : 0;

    var currentTimeLabel = $('#CurrentTimeLabel').text(Helpers.prettyPrintTime(currentTime));
    var totalTimeLabel = $('#TotalTimeLabel').text(Helpers.prettyPrintTime(totalTime));

    //A nieve way of keeping the time up to date. 
    var timeMonitorInterval = setInterval( function () {
        return timeDisplay.update(); 
    }, 500);

    var timeDisplay = {    
        //In charge of updating the time labels and (for now) the progressbar which represents elapsed time.
        update : function(currentTimeInSeconds){
            //If told to update to a specific time (by user interaction) then use that time, otherwise get the players current time (automatic update)
            var currentTime = currentTimeInSeconds ? currentTimeInSeconds : Player.getCurrentTime();
             currentTimeLabel.text(Helpers.prettyPrintTime(currentTime));

            var totalTime = Player.getTotalTime();
            totalTimeLabel.text(Helpers.prettyPrintTime(totalTime));
        }
    }

    Progressbar(currentTime, totalTime, timeDisplay);
}