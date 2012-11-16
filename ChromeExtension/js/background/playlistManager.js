//Manages an array of Playlist objects.
define(['playlist', 'playlistDataProvider'], function(Playlist, playlistDataProvider) {
    'use strict';
    var playlists = [];
    var playlistStorageKey = 'playlistIds';

    //Select all the playlist IDs for storage. That's all that matters because
    //the playlists themselves are stored in localStorage with the keys being their IDs.
    var save = function() {
        var playlistIds = _.pluck(playlists, 'id');
        localStorage.setItem(playlistStorageKey, JSON.stringify(playlistIds));
    };

    //Load any playlists which have been saved to localStorage.
    (function() {
        var playlistIdsJson = localStorage.getItem(playlistStorageKey);
        if (playlistIdsJson) {
            try {
                //Only store IDs in localStorage to keep storage quota as low as possible.
                //Each playlist object is able to load itself from storage if its ID is known.
                var playlistIds = JSON.parse(playlistIdsJson);

                _.each(playlistIds, function(id) {
                    var playlist = new Playlist({ id: id });
                    playlists.push(playlist);
                });
            } catch(exception) {
                console.error("Error parsing playlistIdsJson: " + exception.message);
            }
        } else {
            //If no data is in localStorage, provide user with some default playlists.
            var defaultPlaylistConfigs = playlistDataProvider.getDefaultPlaylistConfigs();
            _.each(defaultPlaylistConfigs, function(config) {
                var playlist = new Playlist(config);
                playlists.push(playlist);
            });
            save();
        }
    }());

    return {
        get playlists() {
            return playlists;
        },
        get activePlaylist() {
            return _.find(playlists, function(p) { return p.isSelected; });
        },
        set selectedPlaylist(value) {
            this.selectedPlaylist.isSelected = false;
            value.isSelected = true;
        },
        getPlaylistById: function(playlistId) {
            return _.find(playlists, function(p) { return p.id === playlistId; });
        },
        //Songs is an optional paramater. When adding a playlist from YouTube a collection of songs
        //will be known -- so add them to the playlist during creation. When creating a new playlist
        //directly inside the app there won't be any songs.
        addPlaylist: function(playlistTitle, songs) {
            var playlist = new Playlist({
                title: playlistTitle,
                songs: songs,
                shuffledSongs: _.shuffle(songs)
            });

            playlists.push(playlist);
            save();
        },
        removePlaylistById: function(playlistId) {
            playlists = _.reject(playlists, function(p) { return p.id === playlistId; });
            save();
        }
    };
});