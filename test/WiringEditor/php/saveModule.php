<?php
	// Connexion et sélection de la base
	$link = mysql_connect("localhost", "root", "root") or die("Impossible de se connecter");
	mysql_select_db("dfly") or die("Could not select database");

	// Get parameters
	$path = $_POST["path"];
	$parameters = stripslashes($_POST["parameters"]);
	$definition = stripslashes($_POST["definition"]);
	
	// Is it an update or a create ?
	$query = sprintf("SELECT * from modules where path='%s'", mysql_real_escape_string($path));
	$result = mysql_query($query) or die("Query failed:\n".$query."\n".mysql_error());
	
	
	if( mysql_num_rows($result) == 0) {
		// Insert the new module
		$query = sprintf("INSERT INTO `dfly`.`modules` (`path` ,`parameters` ,`definition`) VALUES ('%s', '%s', '%s');", 		
							mysql_real_escape_string($path),  
							mysql_real_escape_string($parameters),  
							mysql_real_escape_string($definition) );
	}
	else {
		// Update the  module
		$query = sprintf("UPDATE modules SET parameters='%s', definition='%s' where path='%s';", 		
							mysql_real_escape_string($parameters),  
							mysql_real_escape_string($definition),
							mysql_real_escape_string($path) );
	}
							
	$result = mysql_query($query) or die("Query failed:\n".$query."\n".mysql_error());

	echo "OK";

	// Libération des résultats 
	mysql_free_result($result);

	// Fermeture de la connexion 
	mysql_close($link);
?>
