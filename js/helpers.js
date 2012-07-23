/*jshint bitwise:false*/
//Provides helper methods for non-specific functionality.
var Helpers = (function(){
	"use strict";
	//Creates a unique identifier.
	//Based off of: http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
	return {
		generateGuid: function(){
			var startStringFormat = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';

			var guid = startStringFormat.replace(/[xy]/g, function (c) {
				var r = Math.floor(Math.random() * 16);

				var v = c === 'x' ? r : (r & 0x3 | 0x8);

				return v.toString(16);
			});

			return guid;
		},

		//Takes a time in seconds and converts it to a displayable format of H:mm:ss or mm:ss.
		prettyPrintTime: function(seconds){
			var timeString = '';

			if (seconds >= 3600) {
				//An hour will need to be displayed.
				timeString = (new Date()).clearTime().addSeconds(seconds).toString('H:mm:ss');
			}
			else {
				timeString = (new Date()).clearTime().addSeconds(seconds).toString('mm:ss');
			}

			return timeString;
		}
	};
})();