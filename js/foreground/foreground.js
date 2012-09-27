//The YouTube player is in the background to allow playing music after the UI is closed. Foreground often wants to send messages to the YT player.
//I thought a full-on message system was a bit overkill, so I just expose a global Player object to the foreground and use it sparingly.
var Player;

require(['../third_party/jquery-1.7.2.min', '../third_party/jquery-ui-1.8.21.custom.min', '../helpers', 'uielements'], function(){
    //Remove when Google Chrome 22 goes live. http://code.google.com/p/chromium/issues/detail?id=111660#c7
    if(location.search !== "?foo") {
      location.search = "?foo";
      throw new Error;  // load everything on the next page;
                        // stop execution on this page
    }

    //This fires everytime the UI opens or is re-opened. 
    $(function () {
        "use strict";

        var Foreground = (function() {
            Player = chrome.extension.getBackgroundPage().YoutubePlayer;
            Player.connect();

            var listen = function () {
                //Initialize foreground UI and maintain a handle to be able to update UI.
                var uiElements = new UIElements();
                //Background's player object will notify the foreground whenever its state changes.
                chrome.extension.onConnect.addListener(function (port) {
                    port.onMessage.addListener(function () {
                        uiElements.update();
                    });
                });
            } (); //Start listening for YT player events.
        })();
    });
});