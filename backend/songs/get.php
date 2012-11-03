<?php 
header('Access-Control-Allow-Origin: *');
//Connect to databse
include("../import.php");
//Error handling
if (array_key_exists("id", $_GET)) {
	$id = $_GET['id'];
	$filter = "WHERE `lastfmid` = $id";
}
else if (array_key_exists("query", $_GET)) {
	$query = $_GET['query'];
}
else {
	$filter = "";
}
if (!$con) {
   echo mysql_error();
   $json = array("error" => "Could not connect to database");
}
else {
	//Access the table
	mysql_select_db("a3205977_songs", $con);
	//SQL query
	$result = mysql_query("SELECT * FROM song_table $filter LIMIT 0,30");
	//Loop through results
	$json = array();
	while($row = mysql_fetch_assoc($result))
  	{
  		array_push($json, $row);
  	}	
  	echo json_encode($json);
}
?>