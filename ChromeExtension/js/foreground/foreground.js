define(['uielements', 'fblogin'], function (uiElements, fblogin) {
    'use strict';
    //Background's player object will notify the foreground whenever its state changes.
    chrome.extension.onConnect.addListener(function (port) {
        port.onMessage.addListener(uiElements.refreshUI);
    });

    // var loginButton = $('#login-button');

    // if (localStorage.accessToken) {
    //     var graphUrl = "https://graph.facebook.com/me?" + localStorage.accessToken;
    //     var script = document.createElement("script");
    //     script.src = graphUrl;
    //     document.body.appendChild(script);
    // }

    chrome.extension.getBackgroundPage().YoutubePlayer.connect();
});