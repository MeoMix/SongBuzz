<?php 
header('Access-Control-Allow-Origin: *');
if (array_key_exists("songid", $_GET)) {
include("../import.php");
	if (!$con) {
	   $json = array("error" => "Could not connect to database");
	}
	else {
		mysql_select_db("songbuzz_songs", $con);
		$songid = $_GET['songid'];
		$result = mysql_query("UPDATE song_table SET plays = plays + 1 WHERE lastfmid = '".$songid."'");
		$result2 = mysql_query("SELECT * FROM song_table WHERE lastfmid = '".$songid."'");
		$json = array("success" => "true");
		while ($row = mysql_fetch_array($result2)) { 
			$json['plays'] = $row['plays'];
		}
	}
	echo json_encode($json);
}
?>