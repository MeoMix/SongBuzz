/// <reference path="js/third_party/chrome_extensions.js" />
//The YouTube player is hosted on the backpage, but foreground often wants to control the player.
//I thought a full-on message system was a bit overkill, so I just expose a global Player variable to the foreground and use it sparingly.
var Player = null;
function foreground() {
    var _uiElements = uiElements();

    var _listen = function () {
        //The player passes its state back to the foreground whenever it changes states.
        chrome.extension.onConnect.addListener(function (port) {
            port.onMessage.addListener(function (message) {

                //If something goes wrong in the backend and the user needs to be informed.
                if (message.errorMessage)
                    alert(message.errorMessage);

                _uiElements.updateWithMessage(message);
            });
        });
    } (); //Start listening.
}

//This fires everytime the popup opens. 
$(document).ready(function () {
    Player = chrome.extension.getBackgroundPage().player();
    foreground();

});

