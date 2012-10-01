//Holds onto the currentTime and totalTime song labels as well as the elapsed time progress bar.
define(['player', '../helpers'], function(player, helpers){
    'use strict';
    var currentTimeLabel = $('#CurrentTimeLabel'), totalTimeLabel = $('#TotalTimeLabel');

    function updateLabel(currentTime, totalTime){
        currentTimeLabel.text(currentTime);
        totalTimeLabel.text(totalTime);
    };

    (function initialize(){
        updateLabel(helpers.prettyPrintTime(player.currentTime), helpers.prettyPrintTime(player.totalTime));
        //Update the time every half a second.
        setInterval(function(){
            update()
        }, 500);
    }());

        //In charge of updating the time labels
    var update = function(currentTimeInSeconds){
        //Do not update from automatic updates if the progress bar is being dragged.
        if(currentTimeInSeconds || !player.isSeeking) {
            //If told to update to a specific time (by user interaction) then use that time, otherwise get the players current time (automatic update)
            var currentTime = currentTimeInSeconds ? currentTimeInSeconds : player.currentTime;
            updateLabel(helpers.prettyPrintTime(currentTime), helpers.prettyPrintTime(player.totalTime));
        };
    };

    return {
        update: update
    };
});

    