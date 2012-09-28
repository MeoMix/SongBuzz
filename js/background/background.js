require(['../third_party/jquery-1.7.2.min', 'song_validator', '../helpers', '../yt_helper', 'player'], function(){
	//http://stackoverflow.com/questions/5235719/how-to-copy-text-to-clipboard-from-a-google-chrome-extension
	//Copies text to the clipboard. Has to happen on background page due to elevated privs.
	chrome.extension.onMessage.addListener(function (msg, sender, sendResponse) {
		"use strict";
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