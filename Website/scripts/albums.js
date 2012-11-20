define(['audioScrobbler', 'backend', 'ytHelper', 'songDecorator', 'libraryController', 'playlists'],
 function (audioScrobbler, backend, ytHelpers, songDecorator, libraryController, playlists) {
    'use strict';

    //Private functions:
    var buildAlbumList = function(tracks, callback, album) {
        var table = $("<table>", {
            class: "albumtable"
        });
        var popup = $("#songtable")
        if (tracks == undefined) {
            //TODO: Do error handling here
        }
        else if (tracks.length == undefined) {
            var albumTableRow = buildAlbumTableRow(0, tracks, album);
            albumTableRow.appendTo(table);
        }
        else {
            $.each(tracks, function(key,track) {
                var albumTableRow = buildAlbumTableRow(key, track, album)
                albumTableRow.appendTo(table)
            })
        }
        if (callback) {
            callback(table, tracks, popup)
        }
    };

    var asCallback = function(json, endcallback) {
        var popup = $("#songtable.albumlist")
        if (json.error != undefined) {
            $("<h2>", {
                text: json.message
            }).appendTo(popup);
        }
        else {
            var album = json.album;
            
            $("<h2>", {
                text: album.name,
                'data-mbid': album.mbid,
                "data-source-album": album.name
            }).appendTo(popup);

            $("<h3>", {
                text: album.artist,
                "data-navigate": "Artist/" + album.artist,
                class: "link",
                "data-source-artist": album.artist
            }).appendTo(popup);

            $("<p>", {
                html: album.wiki ? album.wiki.summary : ''
            }).appendTo(popup);

            var albumcover = album.image.length > 3 ? album.image[3]['#text'] : album.image[length-1]['#text'];
            $("<img>", {
                src: albumcover,
                'class': "album",
                "data-source-img": albumcover
            }).appendTo(popup);

            $("<div>", {
                id: "album-recognize-all",
                'class': "button",
                text: s.recognizeAll[language]
            }).appendTo(popup);
            $("<div>", {
                id: "album-addasplaylist",
                'class': "button",
                text: s.addasplaylist[language]
            }).appendTo(popup);

            buildAlbumList(album.tracks.track, endcallback, album);
        }
    };
    var buildAlbumTableRow = function(key,track, album) {
        console.log(album)
        var songs = libraryController.getSongs("songs");
        var albumTableRow = $("<tr>", {
            'class': 'song db-pending ' + 'mbid-' + track.mbid,
            'data-duration': track.duration,
            'data-mbid': track.mbid,
            'data-artists': track.artist.name,
            'data-album': album.name,
            'data-albumid': album.mbid,
            'data-cover': (_.last(album.image))['#text']
        });

        $("<td>").appendTo(albumTableRow);
        $("<td>", {
            text: key + 1
        }).appendTo(albumTableRow);

        $("<td>", {
            'class': 'album-list-title',
            text: track.name
        }).appendTo(albumTableRow);

        $("<td>", {
            text: Helpers.prettyPrintTime(track.duration)
        }).appendTo(albumTableRow);

        $("<td>", {
            'class': 'db-status',
            text: 'Checking...'
        }).appendTo(albumTableRow);

        $("<td>", {
            'class': 'db-recognize',
            text: strings.recognize[language]
        }).appendTo(albumTableRow);

        $.each(songs, function() {
            if (this.title == track.name) {
                albumTableRow.removeClass("db-pending").addClass("recognized in-library");
                albumTableRow.find(".db-status").text(s.inLibrary[language]);
                bindTrackToDOM(this, albumTableRow);
            }
        });
            
        return albumTableRow;
    };

    var checkIfInDataBase = function(table, tracks) {
        var array = []
        $.each(tracks, function(k,v) {
            if (v.mbid == "") {
                $(table).find(".db-pending").eq(k).removeClass("db-pending").addClass("db-not-in-db").find("td.db-status").text(s.notInDataBase[language]);
            }
            else {
                array.push(v.mbid)
            }
            
        });

        $.ajax({
            url: "http://songbuzz.host56.com/backend/songs/checkmbid.php",
            data: {
                "mbids": array.join(",")
            },
            dataType: "json",
            type: "POST",
            success: function(json) {
                $.each(json, function(k,v) {
                    if (v.mbid != "") {
                        var songdiv = $(".mbid-"+v.mbid).removeClass("db-pending db-not-in-db").addClass("db-in-db").addClass("recognized")
                        $(".mbid-"+v.mbid+":not(.in-library)").find(".db-status").text(s.inDatabase[language]);
                        $(".mbid-"+v.mbid+":not(.in-library)").find(".db-recognize").text(s.addToLibrary[language]);
                        $.each(v, function(a,b) {
                            songdiv.attr("data-"+a,b)
                        })
                    }
                })
                var songs = libraryController.getSongs("songs")
                $(".db-pending").removeClass("db-pending").addClass("db-not-in-db").find("td.db-status").text(s.notInDataBase[language]);
                recognizeAll(table)
            }
        })
    };

    var bindTrackToDOM = function (song, node) {
        $(node).addClass("recognized db-in-db").removeClass("db-not-in-db")
        $.each(song, function (a, b) {
            $(node).attr("data-" + a, b)
        });
    };
    var recognizeTrack = function (node, callback) {
            var nodeParent = ($(node).parent("tr"))[0];
            console.log(node)
            var song = {
                hoster: "youtube",
                duration: parseFloat($(nodeParent).attr("data-duration")),
                title: $(nodeParent).find(".album-list-title").text(),
                artists: $(nodeParent).attr("data-artists"),
                album: $(nodeParent).attr("data-album"),
                cover: $(nodeParent).attr("data-cover"),
                mbid: $(nodeParent).attr("data-mbid"),
                albumid: $(nodeParent).attr("data-albumid")
            };
            console.log(song)
            ytHelpers.findVideo(song, function (foundVideo) {
                songDecorator.decorateWithYouTubeInformation(foundVideo, song, undefined,function(song, json) {
                    if (json.error != undefined) {
                        $(nodeParent).find(".db-recognize").text("Track not found");
                    }

                    song.lastfmid = json.track.id;
                    song.artistsid = json.track.artist.mbid;
                    backend.saveData(song, true);
                    bindTrackToDOM(song, nodeParent);
                    $(nodeParent).find(".db-status").text(s.inDatabase[language]);
                    $(nodeParent).find(".db-recognize").text(s.addToLibrary[language]);
                    if (callback) {
                        callback()
                    }
                    
                });
            });
        }
    var recognizeAll = function(table) {
        var tracks = $(table).find(".db-not-in-db .db-recognize");
        //Repeat functions until everything is recognized
        if (tracks.length > 0) {
            recognizeTrack(tracks[0], function() {
                recognizeAll(table)
            })
        }
        
    }
    //Public methods
    return {
        checkIfInDataBase: checkIfInDataBase,
        asCallback: asCallback,
        recognizeAll: recognizeAll,
        addAlbumAsPlaylist: function() {
            var playlistname = $("#songtable.albumlist h3").text() + " - " + $("#songtable.albumlist h2").text()
            playlists.addPlaylist(playlistname);
            var songs = $("#songtable.albumlist .recognized");
            $.each(songs, function(k, songdiv) {
                var song = libraryController.makeSongOutOfTr(songdiv)
                playlists.addSongToPlaylist(playlistname, song)
            })
        },
        recognizeTrack: recognizeTrack
    };
})
