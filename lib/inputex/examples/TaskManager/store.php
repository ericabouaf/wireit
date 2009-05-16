<?php

 $method = $_SERVER["REQUEST_METHOD"];
 $filename = "store.json";
 
 if($method == "GET") {
    echo stripslashes(file_get_contents($filename) );
 }
 else if($method == "POST") {
    if( file_put_contents( $filename, $_POST["data"] ) ) {
       echo "OK";
    }
    else {
       echo "ERROR";
    }
 }

?>