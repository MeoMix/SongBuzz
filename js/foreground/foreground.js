//The YouTube player is in the background to allow playing music after the UI is closed. Foreground often wants to send messages to the YT player.
//I thought a full-on message system was a bit overkill, so I just expose a global Player object to the foreground and use it sparingly.
var Player = null;

//This fires everytime the UI opens or is re-opened. 
$(function () {
    "use strict";

    var Foreground = (function() {
        Player = chrome.extension.getBackgroundPage().YoutubePlayer();
        //Initialize foreground UI and maintain a handle to be able to update UI.
        var uiElements = new UiElements();

        var listen = function () {
            //Background's player object will notify the foreground whenever its state changes.
            chrome.extension.onConnect.addListener(function (port) {
                port.onMessage.addListener(function (message) {
                    //Background communicates error messages to the foreground to be displayed to the UI.
                    if (message.errorMessage){
                        alert(message.errorMessage);
                    }

                    uiElements.updateWithMessage(message);
                });
            });
        } (); //Start listening for YT player events.
    })();
});



