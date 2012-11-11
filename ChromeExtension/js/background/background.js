require(['jquery', 'playerstates', 'youtube-player-api-helper', 'song_validator', 'song_builder', 'helpers', 'underscore', 'oauth2', 'supportedFormats'], function () {
    'use strict';

    //Bypass YouTube's content restrictions by looking like I'm a website.
    chrome.webRequest.onBeforeSendHeaders.addListener(function (info) {
        info.requestHeaders.push({
            name: "Referer",
            value: "http://stackoverflow.com/questions/12829590/how-does-facebook-play-a-youtube-video-which-has-been-banned-from-embedding"
        });
        return { requestHeaders: info.requestHeaders };
    }, {
        urls: ["<all_urls>"]
    },
    ["blocking", "requestHeaders"]);

    //Build iframe AFTER onBeforeSendHeaders listener. You can't put this shit in the HTML.
    $('<iframe id="MusicHolder" width="640" height="390" src="http://www.youtube.com/embed/dummy?enablejsapi=1"></iframe>').appendTo('body');
    $('<iframe id="MusicTester" width="640" height="390" src="http://www.youtube.com/embed/dummy?enablejsapi=1"></iframe>').appendTo('body');

    //Use window.load to allow the IFrame to be fully in place before starting up the YouTube API.
    //This will prevent an error message 'Unable to post message to http://www.youtube.com'
    $(window).load(function () {
        require(['player'], function () {
            console.log("player loaded");
        });
    });


    // function onFacebookLogin() {
    // 	var successURL = 'https://www.facebook.com/connect/login_success.html';

    // 	if (!localStorage.accessToken) {
    // 		chrome.tabs.getAllInWindow(null, function(tabs) {
    // 			for (var i = 0; i < tabs.length; i++) {
    // 				if (tabs[i].url.indexOf(successURL) == 0) {
    // 					var params = tabs[i].url.split('#')[1];
    // 					console.log("Access token:", params);
    // 					localStorage.accessToken = params;
    // 					chrome.tabs.onUpdated.removeListener(onFacebookLogin);
    // 					return;
    // 				}
    // 			}
    // 		});
    // 	}
    // }

    // chrome.tabs.onUpdated.addListener(onFacebookLogin);


    // $.ajax({
    //     type: 'POST',
    //     url: 'http://songbuzz.host56.com/backend/fb/auth.php',
    //     success: function(a, e){
    //         var indexOfFirstQuote = a.indexOf('\'');
    //         var lastIndexOfQuote = a.lastIndexOf('\'');
    //         var trimmedString = a.substring(indexOfFirstQuote + 1, lastIndexOfQuote);

    //         var facebookAuth = new OAuth2('facebook', {
    //           client_id: '120407378113997',
    //           client_secret: '2251642053b3ada76f3688d6e32d2fe9',
    //           api_scope: 'publish_actions',
    //           state: Helpers.getUrlParamaterValueByName(trimmedString, "state")
    //         });

    //         facebookAuth.authorize(function() {
    //             console.log("authorized");
    //             // console.log(facebookAuth.getAccessToken());
    //           // Ready for action, can now make requests with
    //           //facebookAuth.getAccessToken();

    //           //xhr.setRequestHeader('Authorization', 'OAuth ' + facebookAuth.getAccessToken())
    //         });
    //     }
    // });


    //http://stackoverflow.com/questions/5235719/how-to-copy-text-to-clipboard-from-a-google-chrome-extension
    //Copies text to the clipboard. Has to happen on background page due to elevated privs.
    chrome.extension.onMessage.addListener(function (msg, sender, sendResponse) {
        var textarea = document.getElementById("HiddenClipboard");
        //Put message in hidden field.
        textarea.value = msg.text;
        //Copy text from hidden field to clipboard.
        textarea.select();
        document.execCommand("copy", false, null);
        //Cleanup
        sendResponse({});
    });
});