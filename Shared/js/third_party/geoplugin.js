//http://www.geoplugin.net/javascript.gp
//Needed to figure out GeoLocation to filter out some song suggestions.
define(function(){
	'use strict';
	var countryCode = 'US';

	//Cross-Origin Resource Sharing unavailable from file://
	if(window.location.protocol !== 'file:'){
		$.ajax({
			url: 'http://www.geoplugin.net/json.gp',
			dataType: "jsonp",
			jsonp: 'jsoncallback',
			success: function(result) {
			    countryCode = result.geoplugin_countryCode;
			    window.countryCode = countryCode;
			}
		});
	}

	return {
		get countryCode(){
			return countryCode;
		}
	};
});