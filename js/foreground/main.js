require(['../third_party/jquery-1.7.2.min', '../third_party/jquery-ui-1.8.21.custom.min', '../playerstates', '../song_builder', '../helpers'], function(){
    'use strict';

    $(function(){
    	//If the foreground is opened before the background has had a chance to load, wait for the background.
    	//This is easier than having every control on the foreground guard against the background not existing.
	    var waitforPlayerInterval = setInterval(function(){
	        if(chrome.extension.getBackgroundPage().YoutubePlayer){
	            clearInterval(waitforPlayerInterval);
	            require(['foreground'])
	        }
	    }, 200);
    });
});