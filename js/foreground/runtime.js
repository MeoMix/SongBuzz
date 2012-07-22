// actions that run when the popup button is clicked

// if user is on youtube, make a "quick add" button
chrome.tabs.getSelected(null, function(tab) {
    var regex = /https?\:\/\/(?:www\.)?youtube.com\/watch\?(?:|.*?\&)v\=(.+?)(?:\&|$)/;
    // matches
    // * http://youtube.com/watch?v=xxxx-x_xx
    // * http://www.youtube.com/watch?v=xxxx-x_xx
    // * http://www.youtube.com/watch?someparambefore=val&v=xxxx-x_xx
    // * http://www.youtube.com/watch?someparambefore=val&v=xxxx-x_xx&someparamafter=value
    // * http://www.youtube.com/watch?v=xxxx-x_xx&someparamafter=value
    // Also supports the https version of those

    // Javascript Match Result Index:
    // 0: full url matched
    // 1: video ID

    var match = tab.url.match(regex);
    if (match) {
        YtQuickAdd.promptShow(match[1]);
    } else {
        // assert the prompt is closed (it should already be)
        YtQuickAdd.promptHide();
    }
});