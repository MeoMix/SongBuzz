//Provides an interface to the YouTube iFrame.
//Starts up Player object after receiving a ready response from the YouTube API.
var YTPlayerApiHelper = (function(){
    "use strict";

    //Load YouTube Frame API
    var s = document.createElement("script");
    s.src =  "https://www.youtube.com/iframe_api"; /* Load Player API*/
    var before = document.getElementsByTagName("script")[0];
    before.parentNode.insertBefore(s, before);

    // Define YT_ready function.
    var isReady = (function () {
        var onReady_funcs = [], api_isReady = false;
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
        // @description Easier way to implement the YouTube JavaScript API
        // @author      Rob W
        // @global      getFrameID(id) Quick way to find the iframe object which corresponds to the given ID.
        // @global      YT_ready(Function:function [, Boolean:qeue_at_start])
        // @global      onYouTubePlayerAPIReady()  - Used to trigger the qeued functions
        // @website     http://stackoverflow.com/a/7988536/938089?listening-for-youtube-event-in-javascript-or-jquery
        getFrameID: function(id) {
            var elem = document.getElementById(id);

            if (elem) {
                if (/^iframe$/i.test(elem.tagName)){
                    return id; //Frame, OK
                } 

                // else: Look for frame
                var elems = elem.getElementsByTagName("iframe");
                if (!elems.length){
                    return null; //No iframe found, FAILURE
                }

                for (var i = 0; i < elems.length; i++) {
                    if (/^https?:\/\/(?:www\.)?youtube(?:-nocookie)?\.com(\/|$)/i.test(elems[i].src)){
                        break;
                    }
                }

                elem = elems[i]; //The only, or the best iFrame
                if (elem.id){
                    return elem.id; //Existing ID, return it
                }

                // else: Create a new ID
                do { //Keep postfixing `-frame` until the ID is unique
                    id += "-frame";
                } while (document.getElementById(id));

                elem.id = id;
                return id;
            }

            // If no element, return null.
            return null;
        },

        ready: isReady
    };
})();

//This function will be called when the API is fully loaded
//Needs to be exposed globally.
function onYouTubePlayerAPIReady() {
    "use strict";
    //TODO: Firing two events is lame, but I have two players currently. How do I make this arbitrary?
    new YTPlayerApiHelper.ready(true);
    new YTPlayerApiHelper.ready(true);
}