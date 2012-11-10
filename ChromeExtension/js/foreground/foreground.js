    function displayUser(user) {
        console.log(user);
    }


define(['uielements', 'fblogin'], function (uiElements, fblogin) {
    'use strict';
    //Background's player object will notify the foreground whenever its state changes.
    chrome.extension.onConnect.addListener(function (port) {
        port.onMessage.addListener(uiElements.refreshUI);
    });

    var loginButton = $('#login-button');


    if (localStorage.accessToken) {
        var graphUrl = "https://graph.facebook.com/me?" + localStorage.accessToken + "&callback=displayUser";
        console.log(graphUrl);

        var script = document.createElement("script");
        script.src = graphUrl;
        document.body.appendChild(script);
    }

    // $.ajax({
    //     type: 'POST',
    //     url: "https://www.facebook.com/dialog/oauth?client_id=120407378113997&response_type=token&scope=publish_actions&redirect_uri=http://www.facebook.com/connect/login_success.html",
    //     success: function(a, e){
    //         console.log("SUCCESS", a, e);
    //     }
  
    // });



    chrome.extension.getBackgroundPage().YoutubePlayer.connect();
});