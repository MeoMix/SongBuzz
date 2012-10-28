define( function(){
	'use strict';
	var url = 'http://ws.audioscrobbler.com/2.0/';
	//[Meo] TODO: Should we be exposing this API key to github?
	var apiKey = '29c1ce9127061d03c0770b857b3cb741';
	var format = 'json';

	return {
		getData: function(songTitle, callback){
			$.ajax({
            	url: url,
	            data: {
	                "method": "track.search",
	                "track": songTitle,
	                "api_key": apiKey,
	                "format": format
	            },
            	success: callback
			});
		},

		getAlbum: function(title, artist, callback){
            $.ajax({
                url: url,
                data: {
                    "method": "track.getInfo",
                    "track": title,
                    "artist": artist,
                    "format": format,
                    "api_key": apiKey
                },
                success: callback
            });
		}
	};
});