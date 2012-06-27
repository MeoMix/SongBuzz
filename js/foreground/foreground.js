/// <reference path="js/third_party/chrome_extensions.js" />
var Player = null;
var GeoLocation = null;
function foreground() {
    var _uiElements = uiElements();

    var _listen = function () {
        chrome.extension.onConnect.addListener(function (port) {
            port.onMessage.addListener(function (message) {
                _uiElements.updateWithMessage(message);
            });
        });
    }
    _listen();
}

$(document).ready(function () {
    foreground();
    Player = chrome.extension.getBackgroundPage().player();
});