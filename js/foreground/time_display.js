//Holds onto the currentTime and totalTime song labels as well as the elapsed time progress bar.
define(['player', '../helpers'], function(player, helpers){
    'use strict';
    var currentTimeLabel = $('#CurrentTimeLabel');
    var totalTimeLabel = $('#TotalTimeLabel');

    //In charge of updating the time labels
    var update = function(currentTimeInSeconds){
        //Do not update from automatic updates if the progress bar is being dragged.
        if(currentTimeInSeconds || !player.isSeeking) {
            //If told to update to a specific time (by user interaction) then use that time, otherwise get the players current time (automatic update)
            var currentTime = currentTimeInSeconds ? currentTimeInSeconds : player.currentTime;
            currentTimeLabel.text(helpers.prettyPrintTime(currentTime));

            totalTimeLabel.text(helpers.prettyPrintTime(player.totalTime));
        };
    };

    (function initialize(){
        currentTimeLabel.text(helpers.prettyPrintTime(player.currentTime));
        totalTimeLabel.text(helpers.prettyPrintTime(player.totalTime));
        //Update the time every half a second.
        setInterval(function () { return update(); }, 500);
    }());

    return {
        update: update
    };
});

    