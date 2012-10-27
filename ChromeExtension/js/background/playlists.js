//Maintains an associative array consisting of Playlist IDs and Playlist objects.
define(['playlist', 'yt_helper'], function(playlistFunc, ytHelper){
	'use strict';
	var playlists = {};
	var selectedPlaylist = null;

	var save = function () {
		localStorage.setItem('playlists', JSON.stringify(playlists));
	};

	var addPlaylist = function(playlistName, songs){
		var newPlaylist = new playlistFunc(null, playlistName);
		if(songs){
			newPlaylist.addSongs(songs);
		}
		playlists[newPlaylist.id] = newPlaylist;
		save();
	};

	var loadPlaylists = function(){
		var playlistsJson = localStorage.getItem('playlists');
		var loadedPlaylists = false;
		// var playlistsJson = null;
		try {
			if (playlistsJson){
				var playlistIds = JSON.parse(playlistsJson);

				for(var id in playlistIds){
					playlists[id] = new playlistFunc(id);
				}
				loadedPlaylists = true;
			}
		} catch(exception) {
			console.error(exception.message);
		}

		if(!loadedPlaylists){
			//Load default playlists.
			var grizPlaylist = new playlistFunc();
			grizPlaylist.loadData({
				id:"d6103404-1568-4d18-922b-058656302b22",
				title:"GRiZ",
				selected:true,
				shuffledSongs:[{"id":"4696c63f-8dae-4803-8e19-2b89c339f478","videoId":"CI-p4OkT3qE","url":"http://youtu.be/CI-p4OkT3qE","title":"Griz - Smash The Funk | Mad Liberation (2/12)","duration":"411"},{"id":"2ef29e04-d038-44f9-b3a4-ad163bbec459","videoId":"G5w7MIKwSO0","url":"http://youtu.be/G5w7MIKwSO0","title":"GRiZ - Vision of Happiness [HD]","duration":"198"},{"id":"27492b00-8230-48c4-90b9-237be3f07502","videoId":"xvtNnCs6EFY","url":"http://youtu.be/xvtNnCs6EFY","title":"GRiZ - Wheres The Love?","duration":"374"},{"id":"c278ea8e-6877-4658-a017-0a6ea5ccbff3","videoId":"0Gz96ACc45U","url":"http://youtu.be/0Gz96ACc45U","title":"Griz - Mr. B (feat. Dominic Lalli) | Mad Liberation (7/12)","duration":"349"}],
				songHistory:[],
				songs:[{"id":"a207502e-e68e-40e2-a5b1-a94e638a731b","videoId":"3AXu6l3GOYE","url":"http://youtu.be/3AXu6l3GOYE","title":"Griz - Blastaa | Mad Liberation (4/12)","duration":"269"},{"id":"4696c63f-8dae-4803-8e19-2b89c339f478","videoId":"CI-p4OkT3qE","url":"http://youtu.be/CI-p4OkT3qE","title":"Griz - Smash The Funk | Mad Liberation (2/12)","duration":"411"},{"id":"c278ea8e-6877-4658-a017-0a6ea5ccbff3","videoId":"0Gz96ACc45U","url":"http://youtu.be/0Gz96ACc45U","title":"Griz - Mr. B (feat. Dominic Lalli) | Mad Liberation (7/12)","duration":"349"},{"id":"27492b00-8230-48c4-90b9-237be3f07502","videoId":"xvtNnCs6EFY","url":"http://youtu.be/xvtNnCs6EFY","title":"GRiZ - Wheres The Love?","duration":"374"},{"id":"2ef29e04-d038-44f9-b3a4-ad163bbec459","videoId":"G5w7MIKwSO0","url":"http://youtu.be/G5w7MIKwSO0","title":"GRiZ - Vision of Happiness [HD]","duration":"198"}]
			});
			playlists[grizPlaylist.id] = grizPlaylist;

			var gramatikPlaylist = new playlistFunc();
			gramatikPlaylist.loadData({
				id: "73cf71cc-f776-4d89-a9ae-bae57be3cda9",
				title: "Gramatik",
				selected: false,
				shuffledSongs: [{"id":"83c8be7a-0205-423d-ba90-306084bbc128","videoId":"C56h08hMLnM","url":"http://youtu.be/C56h08hMLnM","title":"Gramatik - So Much For Love - Official Music Video","duration":"204"},{"id":"fa7289b9-9a39-43b8-be49-d8d00d8853a0","videoId":"motWUD3jwoA","url":"http://youtu.be/motWUD3jwoA","title":"Gramatik vs. Queen-Princes Of The Glitch Universe [DOWNLOAD LINK IN DESCRIPTION]","duration":"355"},{"id":"1f821fd0-371f-4a4c-b8f1-b1a2e6048cb8","videoId":"bI8Gp6Imlho","url":"http://youtu.be/bI8Gp6Imlho","title":"Gramatik - Dungeon Sound","duration":"238"},{"id":"1a0b9270-2f2b-4371-8f90-d1d2f8d5bf28","videoId":"FHPg-bQneMY","url":"http://youtu.be/FHPg-bQneMY","title":"Gramatik vs. The Beatles - Don't Let Me Down (2012) [HD]","duration":"327"}],
				songHistory: [],
				songs: [{"id":"a680be30-86c3-4cc5-85c8-1944bbdda16f","videoId":"Lxdog1B1H-Y","url":"http://youtu.be/Lxdog1B1H-Y","title":"Gramatik - Just Jammin'","duration":"399"},{"id":"1a0b9270-2f2b-4371-8f90-d1d2f8d5bf28","videoId":"FHPg-bQneMY","url":"http://youtu.be/FHPg-bQneMY","title":"Gramatik vs. The Beatles - Don't Let Me Down (2012) [HD]","duration":"327"},{"id":"1f821fd0-371f-4a4c-b8f1-b1a2e6048cb8","videoId":"bI8Gp6Imlho","url":"http://youtu.be/bI8Gp6Imlho","title":"Gramatik - Dungeon Sound","duration":"238"},{"id":"83c8be7a-0205-423d-ba90-306084bbc128","videoId":"C56h08hMLnM","url":"http://youtu.be/C56h08hMLnM","title":"Gramatik - So Much For Love - Official Music Video","duration":"204"},{"id":"fa7289b9-9a39-43b8-be49-d8d00d8853a0","videoId":"motWUD3jwoA","url":"http://youtu.be/motWUD3jwoA","title":"Gramatik vs. Queen-Princes Of The Glitch Universe [DOWNLOAD LINK IN DESCRIPTION]","duration":"355"}]
			});
			playlists[gramatikPlaylist.id] = gramatikPlaylist;

			var gladkillPlaylists = new playlistFunc();
			gladkillPlaylists.loadData({
				id: "bbbfcf9a-4801-4a00-bd51-921502bfba6f",
				title: "Gladkill",
				selected: false,
				shuffledSongs: [{"id":"80146831-f3cd-4847-9211-c43f6277942b","videoId":"T_z7usf_-KM","url":"http://youtu.be/T_z7usf_-KM","title":"Gladkill - Stargazing [HD]","duration":"292"},{"id":"bbf5de2d-f8eb-45cc-a6c9-27b37cdeee2c","videoId":"vHFzDMa_ikI","url":"http://youtu.be/vHFzDMa_ikI","title":"Gladkill - Just A Thought [HD]","duration":"232"}],
				songHistory: [],
				songs: [{"id":"bbf5de2d-f8eb-45cc-a6c9-27b37cdeee2c","videoId":"vHFzDMa_ikI","url":"http://youtu.be/vHFzDMa_ikI","title":"Gladkill - Just A Thought [HD]","duration":"232"},{"id":"80146831-f3cd-4847-9211-c43f6277942b","videoId":"T_z7usf_-KM","url":"http://youtu.be/T_z7usf_-KM","title":"Gladkill - Stargazing [HD]","duration":"292"}]
			});
			playlists[gladkillPlaylists.id] = gladkillPlaylists;

			var bigGiganticPlaylist = new playlistFunc();
			bigGiganticPlaylist.loadData({
				id: "6e449181-e163-42ae-8185-238f85228d46",
				title: "Big Gigantic",
				selected: false,
				shuffledSongs: [{"id":"f849e26d-2a39-438f-b8d0-d6171c40bf69","videoId":"Sm4CHcNpOsY","url":"http://youtu.be/Sm4CHcNpOsY","title":"(HQ) Big Gigantic - Get Em High (Remix)","duration":"264"}],
				songHistory: [],
				songs: [{"id":"f849e26d-2a39-438f-b8d0-d6171c40bf69","videoId":"Sm4CHcNpOsY","url":"http://youtu.be/Sm4CHcNpOsY","title":"(HQ) Big Gigantic - Get Em High (Remix)","duration":"264"}]
			});
			playlists[bigGiganticPlaylist.id] = bigGiganticPlaylist;

			//TODO: Move this somewhere.
		    var xmlhttp = new XMLHttpRequest();
		    xmlhttp.onreadystatechange = function() {
		        if (this.readyState == 4) {
		            var page = document.implementation.createHTMLDocument("");
		            page.documentElement.innerHTML = this.responseText;

		            var songTitles = [];
		            $(page).find('.secondColumn a').each(function(){
		            	songTitles.push(this.title);
		            })

		            var onBeatportScrapeComplete = function(songs){
		            	console.log("creating beatport list", songs);
		            	addPlaylist("Beatport Top 100", songs);
		            };

		            var songIndex = 0;
		            var processNext;
		            var beatportSongs = [];
		            (processNext = function() {
		                if(songIndex < songTitles.length) {
		                    var songTitle = songTitles[songIndex];
		                    songIndex++;
		                    ytHelper.search(songTitle, function(videos){
		                    	if(videos[0]){
		                    		beatportSongs.push(videos[0]);
		                    	}
		                    	processNext();
		                    });
		                }
		                else{
		                	onBeatportScrapeComplete(beatportSongs);
		                }
		            })();
		        }
		    }

		    xmlhttp.open("GET", "http://www.beatport.com/top-100", true);
		    xmlhttp.send();
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

		addPlaylist: addPlaylist,
		removePlaylistById: function(playlistId){
			delete playlists[playlistId];
			save();
		}
	};
});
