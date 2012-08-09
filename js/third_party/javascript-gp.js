//http://www.geoplugin.net/javascript.gp
//Needed to figure out GeoLocation to filter out some song suggestions.
function geoplugin_request() { return '71.84.2.85';} 
function geoplugin_status() { return '200';} 
function geoplugin_city() { return 'Cambria';} 
function geoplugin_region() { return 'CA';} 
function geoplugin_regionCode() { return 'CA';} 
function geoplugin_regionName() { return 'California';} 
function geoplugin_areaCode() { return '805';} 
function geoplugin_dmaCode() { return '855';} 
function geoplugin_countryCode() { return 'US';} 
function geoplugin_countryName() { return 'United States';} 
function geoplugin_continentCode() { return 'NA';} 
function geoplugin_latitude() { return '35.564098';} 
function geoplugin_longitude() { return '-121.080704';} 
function geoplugin_currencyCode() { return 'USD';} 
function geoplugin_currencySymbol() { return '&#36;';} 
function geoplugin_currencyConverter(amt, symbol) { 
	if (!amt) { return false; } 
	var converted = amt * 1; 
	if (converted <0) { return false; } 
	if (symbol === false) { return Math.round(converted * 100)/100; } 
	else { return '&#36;'+(Math.round(converted * 100)/100);} 
	return false; 
} 