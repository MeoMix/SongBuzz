//Holds onto the currentTime and totalTime song labels as well as the elapsed time progress bar.
function TimeDisplay(){
    "use strict";
    var currentTimeLabel = $('#CurrentTimeLabel').text(Helpers.prettyPrintTime(Player.currentTime));
    var totalTimeLabel = $('#TotalTimeLabel').text(Helpers.prettyPrintTime(Player.totalTime));

    //A nieve way of keeping the time up to date. 
    setInterval(function () {
        return timeDisplay.update(); 
    }, 500);

    var timeDisplay = {    
        //In charge of updating the time labels and (for now) the progressbar which represents elapsed time.
        update: function(currentTimeInSeconds){
            //Do not update from automatic updates if the progress bar is being dragged.
            if(currentTimeInSeconds || !Player.isSeeking) {
                //If told to update to a specific time (by user interaction) then use that time, otherwise get the players current time (automatic update)
                var currentTime = currentTimeInSeconds ? currentTimeInSeconds : Player.currentTime;
                currentTimeLabel.text(Helpers.prettyPrintTime(currentTime));

                totalTimeLabel.text(Helpers.prettyPrintTime(Player.totalTime));
            }
        }
    };

    //TODO: Restructure this so that timeDisplay isn't being passed in.
    var progressbar = new Progressbar(timeDisplay, Player.currentTime, Player.totalTime);

    $('#' + progressbar.id).change(function(){
        timeDisplay.update(progressbar.value);
    });
}