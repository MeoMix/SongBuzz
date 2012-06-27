//http://stackoverflow.com/questions/5235719/how-to-copy-text-to-clipboard-from-a-google-chrome-extension
chrome.extension.onRequest.addListener(function (msg, sender, sendResponse) {
    var textarea = document.getElementById("HiddenClipboard");

    //Put message in hidden field.
    textarea.value = msg.text;

    //Copy text from hidden field to clipboard.
    textarea.select();
    document.execCommand("copy", false, null);

    //Cleanup
    sendResponse({});
});