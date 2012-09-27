//Holds onto the currentTime and totalTime song labels as well as the elapsed time progress bar.
var TimeDisplay;

require([], function(){
    TimeDisplay =function(){
        "use strict";
        var currentTimeLabel = $('#CurrentTimeLabel');
        var totalTimeLabel = $('#TotalTimeLabel');

        //In charge of updating the time labels
        var update = function(currentTimeInSeconds){
            //Do not update from automatic updates if the progress bar is being dragged.
            if(currentTimeInSeconds || !Player.isSeeking) {
                //If told to update to a specific time (by user interaction) then use that time, otherwise get the players current time (automatic update)
                var currentTime = currentTimeInSeconds ? currentTimeInSeconds : Player.currentTime;
                currentTimeLabel.text(Helpers.prettyPrintTime(currentTime));

                totalTimeLabel.text(Helpers.prettyPrintTime(Player.totalTime));
            };
        };

        (function initialize(){
            currentTimeLabel.text(Helpers.prettyPrintTime(Player.currentTime));
            totalTimeLabel.text(Helpers.prettyPrintTime(Player.totalTime));
            //Update the time every half a second.
            setInterval(function () { return update(); }, 500);
        }());

        return {
            update: update
        };
    }
});

    