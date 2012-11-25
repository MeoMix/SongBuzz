<?php 
header('Access-Control-Allow-Origin: *');
//Connect to databse
include("../import.php");
$authkey = $_GET['authkey'];
if (!$con) {
   echo mysql_error();
   $json = array("error" => "Could not connect to database");
}
else {
	//Access the table
	mysql_select_db("songbuzz_songs", $con);
	//SQL query
	$result = mysql_query("SELECT * FROM  `song_users` WHERE  `authkey` LIKE CONVERT( _utf8 '$authkey' USING latin1 ) COLLATE latin1_general_ci");
	//Loop through results
	$json = array();
	while($row = mysql_fetch_assoc($result))
  	{
  		array_push($json, $row);
  	}	
  	$array = $json[0]["songs"];
	$thing = implode(", ",json_decode($array));
  	$result = mysql_query("SELECT * FROM  `song_table` WHERE `lastfmid` IN ( $thing )");
  	$json = array();
    if (mysql_num_rows($result)==0) {
      echo "[]";
    }
    else {
        while($row = mysql_fetch_assoc($result))
      {
        array_push($json, $row);
      }
      echo json_encode($json);
    }

}
?>