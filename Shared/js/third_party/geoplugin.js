//http://www.geoplugin.net/javascript.gp
//Needed to figure out GeoLocation to filter out some song suggestions.
define(function(){
	'use strict';
	var countryCode = 'US';

	//Cross-Origin Resource Sharing unavailable from file://
	if(window.location.protocol !== 'file:'){
		$.ajax({
			url: 'http://www.geoplugin.net/json.gp',
			success: function(result){
			    var geoplugin = JSON.parse(result.replace(/^[^\{]+/, '').replace(/\);?$/, ''));
			    countryCode = geoplugin.geoplugin_countryCode;
			}
		});
	}

	return {
		get countryCode(){
			return countryCode;
		}
	};
});