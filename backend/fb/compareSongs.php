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
			mysql_select_db("songbuzz_songs", $con);
			//Get users list
			$usersongs = explode(",", $_POST['songs']);
			//Get database list
			$check = mysql_query("SELECT * FROM song_users WHERE `authkey` ='$authkey'");
			while ($row = mysql_fetch_array($check)) {
				$songlist = json_decode($row[$list]);
			}
			//Which songs does need to be deleted?
			$delete = array();
			foreach ($usersongs as $song) {
				if (in_array($song, $songlist)) {
				}
				else {
					array_push($delete, $song);
				}
			}
			//Which songs need to be added?
			$add = array();
			foreach ($songlist as $song) {
				if (in_array($song, $usersongs) || $song == null) {
				}
				else {
					array_push($add, $song);
				}
			}
			if (count($add) != 0) {
				$add = implode(", ", $add);
				$add = str_replace(", ", ",", $add);
				$query = "SELECT * FROM song_table WHERE lastfmid in ( $add ) ";
				$result = mysql_query($query);
				$add = array();
				while ($row = mysql_fetch_assoc($result)) {
					array_push($add, $row);
				}
			}
			$json = json_encode(array("remove" => $delete, "add" => $add));
		}

	}
	else {
		$json = json_encode(array("status_code" => "1"));
	}
	echo $json;
?>