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

    //window.location.href = "https://www.facebook.com/dialog/oauth?client_id=120407378113997&response_type=token&scope=publish_actions&redirect_uri=http://www.facebook.com/connect/login_success.html";

    var successURL = 'www.facebook.com/connect/login_success.html';

    function onFacebookLogin() {
        console.log("onFacebookLogin fired");
        if (!localStorage.getItem('accessToken')) {
            chrome.tabs.query({}, function (tabs) { // get all tabs from every window
                console.log("tabs:", tabs);
                for (var i = 0; i < tabs.length; i++) {
                    if (tabs[i].url.indexOf(successURL) !== -1) {
                        // below you get string like this: access_token=...&expires_in=...
                        var params = tabs[i].url.split('#')[1];

                        // in my extension I have used mootools method: parseQueryString. The following code is just an example ;)
                        var accessToken = params.split('&')[0];
                        accessToken = accessToken.split('=')[1];

                        console.log("access token:", accessToken);

                        localStorage.setItem('accessToken', accessToken);
                        chrome.tabs.remove(tabs[i].id);
                    }
                }
            });
        }
    };

//    chrome.tabs.onUpdated.addListener(onFacebookLogin);
    chrome.extension.getBackgroundPage().YoutubePlayer.connect();
});