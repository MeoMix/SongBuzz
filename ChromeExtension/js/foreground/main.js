require(['jquery', 'jqueryUi', 'jqueryMousewheel', 'playerStates', 'songBuilder', 'helpers', 'underscore', 'oauth2', 'supportedFormats'], function () {
    'use strict';
    $(function () {
        //If the foreground is opened before the background has had a chance to load, wait for the background.
        //This is easier than having every control on the foreground guard against the background not existing.
        var waitforPlayerInterval = setInterval(function () {
            if (chrome.extension.getBackgroundPage().YoutubePlayer) {
                clearInterval(waitforPlayerInterval);
                require(['foreground']);
            }
        }, 200);
    });
});