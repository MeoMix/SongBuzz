//When clicked -- skips to the last song. Can't be clicked with only 1 song.
//Will skip from the begining of the list to the end.
var PreviousButton;

require([], function(){
    PreviousButton = (function (){
        "use strict";
        var previousButton = $('#PreviousButton');

        function skipSong() {
            Player.skipSong('previous');
            //Prevent spamming by only allowing a next click once a second.
            setTimeout(function () { 
                previousButton.off('click').one('click', skipSong);
            }, 1000);
        }

        return {
            //Paint the skipButton's path black and bind its click event.
            enable: function(){
                previousButton.prop('src', "images/skip.png").removeClass('disabled').off('click').one('click', skipSong);
                previousButton.find('.path').css('fill', 'black');
            },
            //Paint the skipButton's path gray and unbind its click event.
            disable: function(){
                previousButton.prop('src', "images/skip-disabled.png").addClass('disabled').off('click');
                $(previousButton).find('.path').css('fill', 'gray');
            }
        };
    });
});