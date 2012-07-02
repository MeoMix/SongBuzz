SongBuzz
========

A Google Chrome extension which allows users to create, maintain, and interact with playlists streamed from YouTube.

Requirements
========
1. The latest version of Google Chrome.
2. A stable Internet connection.

Installation
========

1. Navigate to Google Chrome's Extension's page located at: chrome://chrome/extensions
2. Mark the checkbox 'Developer mode' as selected.
3. Click the button 'Load unpacked extensions...'
4. Point the directory browser to the root directory in which SongBuzz was downloaded and click OK.

Overview
========

I initially began writing this Google Chrome extension with the purpose of solving a simple goal. I had become accustom to bookmarking YouTube songs while leveraging the bookmarks as a pseudo-playlist. I grew tired of this solution and decided to take things into my own hands. As such, SongBuzz was born.

An initial load of SongBuzz will present the user with a handful of songs already loaded into the library. These are just whatever songs I am listening to at the time and will most likely be omitted for a production release.

Users are able to add new songs to their library by supplying either a fully-qualified YouTube URL or via searching. I have imported the ability to suggest songs similiar to that of YouTube to encourage users to build their library solely through SongBuzz without a reliance on the YouTube GUI.

Supported Functionality
========

* Add songs via URL or search query.
* Play, pause and/or skip the current song.
* Control the sound output, mute/unmute the current song.
* Shuffle the playlist.
* Reorganize the playlist via drag-and-drop.
* Delete songs from playlist

Future Development (The great, big to-do list...)
========

* Support multiple playlists.
* Allow user to rewind.
* Allow user to skip to various points in time in current song.
* Allow user to 'crop' the start/end of songs by placing 'crop markers' on a song.
* Detect buffering
* Keyboard shortcuts.
* Desktop notifications.
* Pandora-esque 'suggested song' exploration.
* Stronger error-handling against videos which have content restrictions.
* Implement a testing framework (Jasmine)
* Create a server which will allow users to share playlists.
* Internationalization
* Themeing
* Support SoundCloud et. al.

Screenshots & Usage Demo
========

* Screenshot: http://i.imgur.com/A9UCh.png
* Video: http://screencast.com/t/3GEuJS71ZoF

Licenscing
========

Licensed under The MIT License (MIT). http://www.opensource.org/licenses/mit-license.php
Just acknowledge when credit is due - live and let live. :)

Thank You's
========

Misostc - Responsible for the entirety of the UI theme.
