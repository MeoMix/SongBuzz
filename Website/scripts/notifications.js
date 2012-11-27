define(["strings"], function(strings) {
	return {
		show: function(obj) {
		//If no style passed, give it a success style
		obj.type = (obj.type == undefined) ? obj.type = "success" : obj.type;
		//Fallback text
		obj.text = (obj.text == undefined) ? obj.text = "" : obj.text;
		//Random number
		var notificationid = Math.floor(Math.random()*1000000)
		var notification = $("<div>", {
			class: "notification hidden not-" + notificationid + " " + obj.type
		}).text(obj.text);
		var progressbar = $("<div>", {
			class: "notification-progress"
		}).prependTo(notification)
		var closebutton = $("<div>", {
			class: "notificationclosebutton"
		}).text("x").appendTo(notification).on("click", function() {
			$(".not-" + notificationid).remove()
		})
		notification.appendTo("body");
		setTimeout(function() {
			$(".not-" + notificationid).removeClass("hidden");
		}, 1)
		setTimeout(function() {
			$(".not-" + notificationid).addClass("hidden");
			setTimeout(function() {
				$(".not-" + notificationid).remove()
			}, 300)
		}, 10000)
		
		}
	}
})