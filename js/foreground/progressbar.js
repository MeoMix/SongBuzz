//A progress bar which shows the elapsed time as compared to the total time of the current song.
//Changes colors based on player state -- yellow when paused, green when playing.
function progressbar(currentTime, totalTime) {
    var _selector = $('#ProgressBar');
    _selector.progressbar({ value: currentTime, max: totalTime });

    var progressbar = {
        setValue: function (value) {
            _selector.progressbar('option', 'value', value);
        },

        setMaxValue: function (maxValue) {
            _selector.progressbar('option', 'max', maxValue);
        },

        setToGreen: function () {
            $('.ui-progressbar-value').removeClass('pausedBackground').addClass('playingBackground');
        },

        setToYellow: function () {
            $('.ui-progressbar-value').removeClass('playingBackground').addClass('pausedBackground');
        }
    };

    return progressbar;
}