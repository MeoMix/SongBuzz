<?php 
header('Content-type: text/json');
$mbids = "'".implode("', '", (explode(",", $_POST['mbids'])))."'";
header('Access-Control-Allow-Origin: *');
//Connect to databse
include("../import.php");
if (!$con) {
   echo mysql_error();
   $json = array("error" => "Could not connect to database");
}
else {
	//Access the table
	mysql_select_db("songbuzz_songs", $con);
	//SQL query
	$result = mysql_query("SELECT * FROM  `song_table` WHERE  `mbid` IN ( $mbids )");
	//Loop through results
	$json = array();
	while($row = mysql_fetch_assoc($result))
  	{
  		array_push($json, $row);
  	}	
  	echo json_encode($json);

}
?>