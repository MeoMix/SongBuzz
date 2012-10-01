//Maintains an associative array consisting of Playlist IDs and Playlist objects.
define(['playlist'], function(playlist){
	'use strict';
	var playlists = {};
	var selectedPlaylist = null;

	var save = function () {
		localStorage.setItem('playlists', JSON.stringify(playlists));
	};

	var loadPlaylists = function(){
		var playlistsJson = localStorage.getItem('playlists');
		try {
			if (playlistsJson){
				var playlistIds = JSON.parse(playlistsJson);

				for(var id in playlistIds){
					playlists[id] = new playlist(id);
				}
			}
			else{
				//Load default playlists.
				var gramatikPlaylist = new playlist();
				gramatikPlaylist.loadData({
					"id":"73cf71cc-f776-4d89-a9ae-bae57be3cda9",
					"title":"Gramatik",
					"selected":"true",
					"shuffledSongs":[{"id":"83c8be7a-0205-423d-ba90-306084bbc128","videoId":"C56h08hMLnM","url":"http://youtu.be/C56h08hMLnM","name":"Gramatik - So Much For Love - Official Music Video","totalTime":"204"},{"id":"fa7289b9-9a39-43b8-be49-d8d00d8853a0","videoId":"motWUD3jwoA","url":"http://youtu.be/motWUD3jwoA","name":"Gramatik vs. Queen-Princes Of The Glitch Universe [DOWNLOAD LINK IN DESCRIPTION]","totalTime":"355"},{"id":"1f821fd0-371f-4a4c-b8f1-b1a2e6048cb8","videoId":"bI8Gp6Imlho","url":"http://youtu.be/bI8Gp6Imlho","name":"Gramatik - Dungeon Sound","totalTime":"238"},{"id":"1a0b9270-2f2b-4371-8f90-d1d2f8d5bf28","videoId":"FHPg-bQneMY","url":"http://youtu.be/FHPg-bQneMY","name":"Gramatik vs. The Beatles - Don't Let Me Down (2012) [HD]","totalTime":"327"}],
					"songHistory":[{"id":"a680be30-86c3-4cc5-85c8-1944bbdda16f","videoId":"Lxdog1B1H-Y","url":"http://youtu.be/Lxdog1B1H-Y","name":"Gramatik - Just Jammin'","totalTime":"399"},{"id":"a680be30-86c3-4cc5-85c8-1944bbdda16f","videoId":"Lxdog1B1H-Y","url":"http://youtu.be/Lxdog1B1H-Y","name":"Gramatik - Just Jammin'","totalTime":"399"},{"id":"a680be30-86c3-4cc5-85c8-1944bbdda16f","videoId":"Lxdog1B1H-Y","url":"http://youtu.be/Lxdog1B1H-Y","name":"Gramatik - Just Jammin'","totalTime":"399"}],
					"songs":[{"id":"a680be30-86c3-4cc5-85c8-1944bbdda16f","videoId":"Lxdog1B1H-Y","url":"http://youtu.be/Lxdog1B1H-Y","name":"Gramatik - Just Jammin'","totalTime":"399"},{"id":"1a0b9270-2f2b-4371-8f90-d1d2f8d5bf28","videoId":"FHPg-bQneMY","url":"http://youtu.be/FHPg-bQneMY","name":"Gramatik vs. The Beatles - Don't Let Me Down (2012) [HD]","totalTime":"327"},{"id":"1f821fd0-371f-4a4c-b8f1-b1a2e6048cb8","videoId":"bI8Gp6Imlho","url":"http://youtu.be/bI8Gp6Imlho","name":"Gramatik - Dungeon Sound","totalTime":"238"},{"id":"83c8be7a-0205-423d-ba90-306084bbc128","videoId":"C56h08hMLnM","url":"http://youtu.be/C56h08hMLnM","name":"Gramatik - So Much For Love - Official Music Video","totalTime":"204"},{"id":"fa7289b9-9a39-43b8-be49-d8d00d8853a0","videoId":"motWUD3jwoA","url":"http://youtu.be/motWUD3jwoA","name":"Gramatik vs. Queen-Princes Of The Glitch Universe [DOWNLOAD LINK IN DESCRIPTION]","totalTime":"355"}]
				});
				playlists[gramatikPlaylist.id] = gramatikPlaylist;

				var grizPlaylist = new playlist();
				grizPlaylist.loadData({
					"id":"d6103404-1568-4d18-922b-058656302b22",
					"title":"GRiZ",
					"selected":false,
					"shuffledSongs":[{"id":"4696c63f-8dae-4803-8e19-2b89c339f478","videoId":"CI-p4OkT3qE","url":"http://youtu.be/CI-p4OkT3qE","name":"Griz - Smash The Funk | Mad Liberation (2/12)","totalTime":"411"},{"id":"2ef29e04-d038-44f9-b3a4-ad163bbec459","videoId":"G5w7MIKwSO0","url":"http://youtu.be/G5w7MIKwSO0","name":"GRiZ - Vision of Happiness [HD]","totalTime":"198"},{"id":"27492b00-8230-48c4-90b9-237be3f07502","videoId":"xvtNnCs6EFY","url":"http://youtu.be/xvtNnCs6EFY","name":"GRiZ - Wheres The Love?","totalTime":"374"},{"id":"c278ea8e-6877-4658-a017-0a6ea5ccbff3","videoId":"0Gz96ACc45U","url":"http://youtu.be/0Gz96ACc45U","name":"Griz - Mr. B (feat. Dominic Lalli) | Mad Liberation (7/12)","totalTime":"349"}],
					"songHistory":[{"id":"a207502e-e68e-40e2-a5b1-a94e638a731b","videoId":"3AXu6l3GOYE","url":"http://youtu.be/3AXu6l3GOYE","name":"Griz - Blastaa | Mad Liberation (4/12)","totalTime":"269"},{"id":"a207502e-e68e-40e2-a5b1-a94e638a731b","videoId":"3AXu6l3GOYE","url":"http://youtu.be/3AXu6l3GOYE","name":"Griz - Blastaa | Mad Liberation (4/12)","totalTime":"269"},{"id":"a207502e-e68e-40e2-a5b1-a94e638a731b","videoId":"3AXu6l3GOYE","url":"http://youtu.be/3AXu6l3GOYE","name":"Griz - Blastaa | Mad Liberation (4/12)","totalTime":"269"},{"id":"a207502e-e68e-40e2-a5b1-a94e638a731b","videoId":"3AXu6l3GOYE","url":"http://youtu.be/3AXu6l3GOYE","name":"Griz - Blastaa | Mad Liberation (4/12)","totalTime":"269"}],
					"songs":[{"id":"a207502e-e68e-40e2-a5b1-a94e638a731b","videoId":"3AXu6l3GOYE","url":"http://youtu.be/3AXu6l3GOYE","name":"Griz - Blastaa | Mad Liberation (4/12)","totalTime":"269"},{"id":"4696c63f-8dae-4803-8e19-2b89c339f478","videoId":"CI-p4OkT3qE","url":"http://youtu.be/CI-p4OkT3qE","name":"Griz - Smash The Funk | Mad Liberation (2/12)","totalTime":"411"},{"id":"c278ea8e-6877-4658-a017-0a6ea5ccbff3","videoId":"0Gz96ACc45U","url":"http://youtu.be/0Gz96ACc45U","name":"Griz - Mr. B (feat. Dominic Lalli) | Mad Liberation (7/12)","totalTime":"349"},{"id":"27492b00-8230-48c4-90b9-237be3f07502","videoId":"xvtNnCs6EFY","url":"http://youtu.be/xvtNnCs6EFY","name":"GRiZ - Wheres The Love?","totalTime":"374"},{"id":"2ef29e04-d038-44f9-b3a4-ad163bbec459","videoId":"G5w7MIKwSO0","url":"http://youtu.be/G5w7MIKwSO0","name":"GRiZ - Vision of Happiness [HD]","totalTime":"198"}]
				});
				playlists[grizPlaylist.id] = grizPlaylist;


				var gladkillPlaylists = new playlist();
				gladkillPlaylists.loadData({
					"id":"bbbfcf9a-4801-4a00-bd51-921502bfba6f",
					"title":"Gladkill",
					"selected":false,
					"shuffledSongs":[{"id":"80146831-f3cd-4847-9211-c43f6277942b","videoId":"T_z7usf_-KM","url":"http://youtu.be/T_z7usf_-KM","name":"Gladkill - Stargazing [HD]","totalTime":"292"},{"id":"bbf5de2d-f8eb-45cc-a6c9-27b37cdeee2c","videoId":"vHFzDMa_ikI","url":"http://youtu.be/vHFzDMa_ikI","name":"Gladkill - Just A Thought [HD]","totalTime":"232"}],
					"songHistory":[],
					"songs":[{"id":"bbf5de2d-f8eb-45cc-a6c9-27b37cdeee2c","videoId":"vHFzDMa_ikI","url":"http://youtu.be/vHFzDMa_ikI","name":"Gladkill - Just A Thought [HD]","totalTime":"232"},{"id":"80146831-f3cd-4847-9211-c43f6277942b","videoId":"T_z7usf_-KM","url":"http://youtu.be/T_z7usf_-KM","name":"Gladkill - Stargazing [HD]","totalTime":"292"}]
				});
				playlists[gladkillPlaylists.id] = gladkillPlaylists;

				var bigGiganticPlaylist = new playlist();
				bigGiganticPlaylist.loadData({
					"id":"6e449181-e163-42ae-8185-238f85228d46",
					"title":"Big Gigantic",
					"selected":false,
					"shuffledSongs":[{"id":"f849e26d-2a39-438f-b8d0-d6171c40bf69","videoId":"Sm4CHcNpOsY","url":"http://youtu.be/Sm4CHcNpOsY","name":"(HQ) Big Gigantic - Get Em High (Remix)","totalTime":"264"}],
					"songHistory":[],
					"songs":[{"id":"f849e26d-2a39-438f-b8d0-d6171c40bf69","videoId":"Sm4CHcNpOsY","url":"http://youtu.be/Sm4CHcNpOsY","name":"(HQ) Big Gigantic - Get Em High (Remix)","totalTime":"264"}]
				});
				playlists[bigGiganticPlaylist.id] = bigGiganticPlaylist;

				save();
			}
		}
		catch(exception){
			console.error(exception);
			//No saved playlists found - create a default playlist.
			var defaultPlaylist = new playlist();
			defaultPlaylist.isSelected = true;
			playlists[defaultPlaylist.id] = defaultPlaylist;
			save();
		}
	}();

	return {
		get playlists(){
			return playlists;
		},

		get selectedPlaylist(){
			if(!selectedPlaylist){
				for(var key in playlists){

					if(playlists[key].isSelected){
						selectedPlaylist = playlists[key];
						break;
					}
				}
			}

			return selectedPlaylist;
		},

		set selectedPlaylist(value){
			this.selectedPlaylist.isSelected = false;
			value.isSelected = true;
			selectedPlaylist = value;
		},

		getPlaylistById: function(playlistId){
			return playlists[playlistId];
		},

		addPlaylistByName: function(playlistName){
			var newPlaylist = new playlist(null, playlistName);
			//TODO: Remove this clear. I want to ship default songs, but this isn't right.
			newPlaylist.isSelected = false;
			newPlaylist.clear();
			playlists[newPlaylist.id] = newPlaylist;
			save();
		},

		addPlaylistByPlaylist: function(playlist){
			var newPlaylist = new playlist(null, playlist.title);
			newPlaylist.clear();

			$(playlist.videos).each(function(){
				newPlaylist.addSongBySong(this);
			})

			newPlaylist.isSelected = false;
			playlists[newPlaylist.id] = newPlaylist;
			save();
		},

		removePlaylistById: function(playlistId){
			delete playlists[playlistId];
			save();
		}
	};
});
