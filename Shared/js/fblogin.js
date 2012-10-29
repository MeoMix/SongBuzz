define(function() {
	'use strict';
	//When site is loaded, change from "Loading" to "Login"
	$("#login-button").text("Login")
	//Receive Facebook callback and push to localStorage
	if (Helpers.getURLParameter("name") != "") {
		var user = {
			name: Helpers.getURLParameter("name"),
			prename: Helpers.getURLParameter("prename"),
			id: Helpers.getURLParameter("id"),
			authkey: Helpers.getURLParameter("authkey"),
		}
		$.each(user, function(k,v) {
			localStorage[k] = v;
		})
		history.pushState(null, "SongBuzz", "/Website")
	}
	if (localStorage['name'] != null) {
		//Hide login button
		$("#login-button").remove()
		//Change the label from "Login" to "Account"
		$("#login-string").text("Account")
		//Show profile image
		var profile = $("<div>", {
			class: "fb-profile"
		})
		$("<img>", {
			class: "fb-profile-image",
			src: "https://graph.facebook.com/" + localStorage['id'] + "/picture"
		}).appendTo(profile)
		//Show name
		$("<span>", {
			class: "fb-name-label"
		}).text(localStorage['prename'] + " " + localStorage['name'])
		.appendTo(profile)
		profile.appendTo("#account-area")
		//Logout button
		$("<button>", {
			class: "sidebar-button"
		}).text("Log out")
		.on("click", function() {
			Logout()
		})
		.appendTo("#account-area")
	}
	function Logout() {
		localStorage.clear()
		window.location.reload()
	}
})