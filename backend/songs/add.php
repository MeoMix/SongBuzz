<?php 
header('Access-Control-Allow-Origin: *');
$title = $_GET['title'];
$artists = $_GET['artists'];
$album = $_GET['album'];
$cover = $_GET['cover'];
$lastfmid = $_GET['lastfmid'];
$plays = 1;
$hoster = $_GET['hoster'];
$hosterid = $_GET['hosterid'];
$duration = $_GET['duration'];
$countries = $_GET['countries'];
$artistsid = $_GET['artistsid'];
$albumid = $_GET['albumid'];
$mbid = $_GET['mbid'];

//Connect to databse
include("../import.php");
//Error handling
if (!$con) {
   $json = array("error" => "Could not connect to database", "success" => "false");
}
else {
	mysql_select_db("songbuzz_songs", $con);
	//Test if already there
	$check = mysql_query("SELECT * FROM song_table WHERE `lastfmid` ='$lastfmid'");
	//Must be "> 1"! Do not change!
	if (count(mysql_fetch_array($check)) > 1) {
		$json = array("error" => "Song already in database", "success" => "true");
	}
	else {
		mysql_query("INSERT INTO song_table (id,title, artists, album, cover, lastfmid, plays, hoster, hosterid, duration, countries, artistsid, albumid, mbid) VALUES (0,'$title', '$artists', '$album', '$cover', '$lastfmid', '$plays', '$hoster', '$hosterid', '$duration', '$countries', '$artistsid', '$albumid', '$mbid') ");
		mysql_close($con);
		$json = array("success" => "true");
	}
}
echo json_encode($json);
?>