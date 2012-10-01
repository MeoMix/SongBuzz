define(['uielements', 'player'], function(uiElements, player){
    'use strict';
    //Background's player object will notify the foreground whenever its state changes.
    chrome.extension.onConnect.addListener(function (port) {
        port.onMessage.addListener(uiElements.refreshUI);
    });
    player.connect();
});