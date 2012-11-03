<?php 
header('Access-Control-Allow-Origin: *');
//Status codes
//0 = Success
//1 = Wrong method
//2 = Database error
//3 = Already in list
	//Can be songs or favorites
	$list = $_GET['list'];
	$authkey = $_GET['authkey'];
	if ($list == 'songs' || $list == 'favorites') {
		//Connect to database
		include("../import.php");
		if (!$con) {
   			$json = json_encode(array("status_code" => "2"));
		}
		else {
			//Select database
			mysql_select_db("a3205977_songs", $con);
			//
			$check = mysql_query("SELECT * FROM song_users WHERE `authkey` ='$authkey'");
			while ($row = mysql_fetch_array($check)) {
				$songlist = $row[$list];
			}
			$array = json_decode($songlist);
			if (in_array($_GET['song'], $array)) {
				$json = json_encode(array("status_code" => "3"));
			}
			else {
				array_push($array, $_GET['song']);
				$encodedarray = json_encode($array);
				mysql_query("UPDATE song_users SET $list = '$encodedarray' WHERE `authkey` ='$authkey'");
				$json = json_encode(array("status_code" => "0"));
			}
		}

	}
	else {
		$json = json_encode(array("status_code" => "1"));
	}
	echo $json;
?>