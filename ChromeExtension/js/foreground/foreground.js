define(['uielements', 'fblogin'], function (uiElements, fblogin) {
    'use strict';
    //Background's player object will notify the foreground whenever its state changes.
    chrome.extension.onConnect.addListener(function (port) {
        port.onMessage.addListener(uiElements.refreshUI);
    });

    var loginButton = $('#login-button');
    var loginString = $('#login-string');
    var accountArea = $('#account-area');

    //fblogin.createLoginButton(loginButton, loginString, accountArea);



    chrome.extension.getBackgroundPage().YoutubePlayer.connect();
});