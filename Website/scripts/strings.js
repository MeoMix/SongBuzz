//Contains globalization info for string constants.
define(function(){
	'use strict';
	window.language = "en"
	window.strings = window.s = {
		appName: {
			de: "SongBuzz",
			en: "SongBuzz"
		},
		dropMusic: {
			de: "Ziehe deine<br>Musik in den Kreis",
			en: "Drop your<br>music here"
		},
		linkNotRecognized: {
			de: "Der Link konnte nicht erkannt werden. Probiere einen YouTube-Link!",
			en: "Link cannot be recognized. Try a YouTube link!"
		},
		addMusic: {
			de: "Musik hinzufügen",
			en: "Add music"
		},
		recognition: {
			de: "Erkennung",
			en: "Recognition"
		},
		account: {
			de: "Konto",
			en: "Account"
		},
		playlists: {
			de: "Playlisten",
			en: "Playlists"
		},
		title: {
			de: 'Titel',
			en: 'Title'
		},
		duration: {
			de: 'Dauer',
			en: 'Duration'
		},
		artist: {
			de: 'Künstler',
			en: 'Artist'
		},
		album: {
			de: 'Album',
			en: 'Album'
		},
		recognizeAll: {
			de: "Alle erkennen",
			en: "Recognize all"
		},
		inLibrary: {
			de: "In der Bibliothek",
			en: "In your library"
		},
		inDatabase: {
			de: "In der Datenbank",
			en: "In database"
		},
		notInDataBase: {
			de: "Nicht in der Datenbank",
			en: "Not in database"
		},
		addToLibrary: {
			de: "Zur Bibliothek hinzufügen",
			en: "Add to library"
		},
		recognize: {
			de: "Erkennen",
			en: "Recognize"
		}
	};
	$(document).ready(function() {
		$.each($("[data-lang-id]"), function(key, node) {
			$(node).html(strings[$(node).attr("data-lang-id")][language])
		})
	})
});