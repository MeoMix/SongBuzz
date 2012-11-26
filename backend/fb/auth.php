<?php 

	//Status codes
	//0 = Success
	//1 = States do not match
	//2 = Access denied
	//3 = Database error

   $app_id = "120407378113997";
   $app_secret = "2251642053b3ada76f3688d6e32d2fe9";
   //Works for localhost + server!
   $my_url = "http://".$_SERVER['SERVER_NAME'].":".$_SERVER['SERVER_PORT']."/backend/fb/auth.php";
   echo($my_url);

   session_start();

   $code = $_REQUEST["code"];
   //Go to login dialogue!
   if(empty($code)) {
     $_SESSION['state'] = md5(uniqid(rand(), TRUE)); // CSRF protection
     $dialog_url = "https://www.facebook.com/dialog/oauth?client_id=" 
       . $app_id . "&redirect_uri=" . urlencode($my_url) . "&state="
       . $_SESSION['state'] . "&scope=publish_actions+user_likes";

     echo("<script> top.location.href='" . $dialog_url . "'</script>");
   }
   else {
   	//Check if state parameter exists... Facebook advises this
   	if($_SESSION['state'] && ($_SESSION['state'] === $_REQUEST['state'])) {
     if (array_key_exists("error", $_REQUEST)) {
     	//User pressed "Deny".... :(
     	$json = json_encode(array("status_code" => "2"));
     }
     else {
     	//Success!
     	//Let's exchange this string with another string...
     	$code = $_REQUEST['code'];
     	$token_url = "https://graph.facebook.com/oauth/access_token?"
       	. "client_id=" . $app_id . "&redirect_uri=" . urlencode($my_url)
       	. "&client_secret=" . $app_secret . "&code=" . $code;
       	$response = file_get_contents($token_url);
       	$params = null;
       	parse_str($response, $params);
       	//Get expiring date, access token
       	$expires = time()+$params['expires'];
       	$access_token = $params['access_token'];
       	//Get name + id;
       	$user = json_decode(file_get_contents("https://graph.facebook.com/me?access_token=".$access_token));
       	$name = $user->last_name;
       	$prename = $user->first_name;
       	$id = $user->id;
       	$authkey = md5($id.$name);
       	//Add it to the database :D!
       	include("../import.php");
       	//In case our amazing high-end servers do crash
       	if (!$con) {
   			$json = json_encode(array("status_code" => "3"));
		}
		else {
			mysql_select_db("songbuzz_songs", $con);
			$check = mysql_query("SELECT * FROM song_users WHERE `id` ='$id'");
			if (count(mysql_fetch_array($check)) > 1) {
				//User already registered!
				//Update access_token
				mysql_query("UPDATE song_users SET access_token='$access_token', expires='$expires' WHERE `id` ='$id'");
				mysql_close();
			}
			else {
				//New user!
				mysql_query("INSERT INTO song_users (id,name,prename,songs,favorites,access_token,expires,authkey) VALUES ('$id', '$name', '$prename', '[]', '[]','$access_token', '$expires', '$authkey')");
				mysql_close($con);
			}
      echo("<script> top.location.href='" . "http://songbuzzapp.com/Website?name=$name&prename=$prename&id=$id&authkey=$authkey" . "'</script>");
			$json = json_encode(array("status_code" => "0", "user_info" => array("name" => $name, "prename" => $prename, "id" => $id, "authkey" => $authkey)));
		}

     }
   }
   else {
   	 //Facebook advises this
     $json = json_encode(array("status_code" => "1"));
   }
   }
 ?>