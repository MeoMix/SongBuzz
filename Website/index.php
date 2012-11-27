<!DOCTYPE HTML>
<html lang="en-US">
    <?php 
    $feed = substr($_GET["feed"], 1); 
    echo "<script>window.originalState = '$feed'</script>"
    ?>
    <head>
        <meta charset="UTF-8">
        <title>SongBuzz</title>
        <script src="/Website/scripts/requirePaths.js"></script>
        <script data-main="main" src="/Shared/js/thirdParty/require.js"></script>
        <link rel="stylesheet" href="/Website/css/style.css">
        <link rel="stylesheet" href="/Website/css/contextmaster.css">
        <link rel="icon" href="/Website/images/favicon.ico" type="image/x-icon">
    </head>
    <body>
    <div id="leftbar">
        <div id="upperdiv">
            <h2>Search</h2> 
            <img src="/Website/images/search.png" class="inputimage">
            <input type="text" id="searchinput" placeholder="Tracks, artists, albums">
            <div id="autocomplete">
                <div id="auto-title"></div>
                <div class="autocompletespacer" data-lang-ig="artists">Artists</div>
                <div id="auto-artists"></div>
                <div class="autocompletespacer" data-lang-id="album">Album</div>
                <div id="auto-albums"></div>
            </div>
            <h2 data-lang-id="library">Library</h2>
            <div class="standardlist selected" data-list-id="songs" data-lang-id="mysongs" data-navigate="Library/Songs">My songs</div>
            <h2 data-lang-id="playlists">Playlists</h2>
            <div id="playlistlist"></div>
            <div data-lang-id="addplaylist" id="addplaylist">Add playlist</div>
            <h2 data-lang-id="hotsongs">Hot songs</h2>
            <div id="hotsongs">
                <div class="standardlist" data-lang-id="mostlistened" data-list-id="mostlistened" data-navigate="Feeds/Top songs">Most listened</div>
                <div class="standardlist" data-lang-id="randomsongs" data-list-id="randomsongs" data-navigate="Feeds/Random songs">Random songs</div>
            </div>
        </div>
        <div id="nowplaying">
            <img src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" id="now-cover">
        </div>
    </div>
    <div id="sidebar">
        <div id="backend"></div>
        <h2 data-lang-id="addMusic">Add Music</h2>
        <div id="recognition-area">
            <div id="drag-area">
                <img src="/Website/images/youtube.png" alt="Drop YouTube links!">
                <img src="/Website/images/spotify.png" alt="Drop YouTube links!">
            </div>
            <textarea name="" id="" cols="30" rows="10"></textarea>
            <div id="drop-music" data-lang-id="dropMusic">Drop your<br>music here</div>
            <div class="hr"></div>
        </div>
        <div id="recognition-container">
            <h2 data-lang-id="recognition">Recognition</h2>
            <div id="recognitionlist">            
            </div>
            <br>
            <div class="hr"></div>
        </div>
        <h2 id="login-string">Login</h2>
        <div id="account-area">
            <button id="login-button" class="sidebar-button">Loading...</button>
        </div>
    </div>
    <div id="controls">
        <div id="previous"><img src="/Website/images/rewind.png"></div>
        <div id="play"><img src="/Website/images/play.png"></div>
        <div id="pause" style="display: none;"><img src="/Website/images/pause.png"></div>
        <div id="next"><img src="/Website/images/ff.png"></div>
        <div id="scrubber"></div>
    </div>
    <div id="songtable"></div>
    <div class="notready" id="loadingscreen"><div class="spinner"></div><p>Loading songs</p></div>
<div id="ytplayer"></div>
<script src="https://www.youtube.com/player_api"></script>
<script>
  // Replace the 'ytplayer' element with an <iframe> and
  // YouTube player after the API code downloads.
  var ytplayer;
  function onYouTubePlayerAPIReady() {
    ytplayer = new YT.Player('ytplayer', {
      height: '390',
      width: '640',
      videoId: 'u1zgFlCw8Aw'
    });
    ytplayer.addEventListener("onStateChange", function() {
        var newState = ytplayer.getPlayerState()
        if (newState == 0) {
            require(["libraryController"], function(libraryController) {
                libraryController.playNext();
            })
            
        }
        if (newState == 0 || newState == 1) {
            document.getElementById("play").style.display = "none"
            document.getElementById("pause").style.display = "block"
        } else {
            document.getElementById("play").style.display = "block"
            document.getElementById("pause").style.display = "none"
        }
    })
    //Remove class "notready"
    var ele = document.getElementById("loadingscreen")
    var reg = new RegExp('(\\s|^)'+"notready"+'(\\s|$)');
    ele.className=ele.className.replace(reg,' ');
  }
</script>
</html>