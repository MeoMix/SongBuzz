require(['../third_party/jquery-1.7.2.min', '../third_party/jquery-ui-1.8.21.custom.min'], function(){
    require([ 'uielements', 'player'], function(){
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
});