//Provides an interface to the YouTube iFrame.
//Starts up Player object after receiving a ready response from the YouTube API.
var onReady_funcs = [], api_isReady = false;

define(['onYouTubePlayerAPIReady'],function(){
    'use strict';
    //This code will trigger onYouTubePlayerAPIReady
    $(window).load(function(){
        //Load YouTube Frame API
        var youtubeIframeAPIScript = document.createElement("script");
        youtubeIframeAPIScript.src =  "https://www.youtube.com/iframe_api"; /* Load Player API*/
        var before = document.getElementsByTagName("script")[0];
        before.parentNode.insertBefore(youtubeIframeAPIScript, before);
    });
    // Define YT_ready function.
    var isReady = (function () {
        //@param func function     Function to execute on ready
        //@param func Boolean      If true, all qeued functions are executed
        //@param b_before Boolean  If true, the func will added to the first position in the queue
        return function (func, b_before) {
            if (func === true) {
                api_isReady = true;
                for (var i = 0; i < onReady_funcs.length; i++) {
                    // Removes the first func from the array, and execute func
                    onReady_funcs.shift()();
                }
            }
            else if (typeof func === "function") {
                if (api_isReady){
                    func();
                }
                else{
                    onReady_funcs[b_before ? "unshift" : "push"](func);
                }
            }
        };
    })();

    return {
        ready: isReady
    };
});