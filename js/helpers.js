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
			var date = new Date(seconds * 1000);

			var hours = date.getHours();
			var minutes = date.getMinutes();
			var seconds = date.getSeconds();
			// This line gives you 12-hour (not 24) time
			if (hours > 12){
				hours = hours - 12;
			}
			// These lines ensure you have two-digits
			if (minutes < 10) {
				minutes = "0" + minutes;
			}

			if (seconds < 10) {
				seconds = "0" + seconds;
			}

			var timeString = minutes + ':' + seconds;

			if(seconds >= 3600){
				timeString = hours + timeString;
			}

			return timeString;
		}
	};
})();