define(function(){
	'use strict';
	var recognitionList = $('#recognitionlist');
	var currentSong = null;

	return {
		addNotice: function(noticeDomElement){
			recognitionList.append(noticeDomElement);
		},
		addSong: function(songDomElement){
			recognitionList.append(songDomElement);
			currentSong = songDomElement;
		},
		addImageToCurrentSong: function(imageElement){
			currentSong.append(imageElement);
		},
		showFinishedAnimation: function(track){
            setTimeout( function() {
                currentSong.animate({"opacity": 0}, 2000)
                track.insertAfter(currentSong).fadeIn()
                setTimeout(function() {
                    $('<div>', {
                        'class': 'spark'
                    }).insertAfter(currentSong);
                }, 1000)
            }, 1000);
		}
	};
});