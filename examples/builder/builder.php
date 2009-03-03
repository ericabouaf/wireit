<?php

class LanguageEditor {
   
    private $dbData = array (
       'dbhost' => "localhost",
       'dbuser' => "root",
       'dbpass' => "root",
       'dbname' => "WireIt"
    );
    
    private $link = null;

    private function connect() {
       if($this->link) {
          return;
       }
       $this->link = mysql_connect( $this->dbData["dbhost"], $this->dbData["dbuser"], $this->dbData["dbpass"]);
       mysql_select_db($this->dbData["dbname"]);
    }

    private function query($sql) {
       $this->connect();
       return mysql_query($sql);
    }
    
    private function queryToArray($sql) {
       $res = $this->query($sql);
       $obj = array();
       while($line = mysql_fetch_assoc($res)) {
          $obj[]=$line;
       }
       return $obj;
    }
    
    
    // variable needs to be in alphabetical order
    public function saveLanguage($language, $name) {
       
    	$result = $this->query( sprintf("SELECT * from languages where name='%s'", mysql_real_escape_string($name) ) );

      if( mysql_num_rows($result) == 0) {
    		$query = sprintf("INSERT INTO languages (`name` ,`language`) VALUES ('%s','%s');", 		
    							mysql_real_escape_string($name), 
    							mysql_real_escape_string($language) );
    	}
    	else {
    		$query = sprintf("UPDATE languages SET language='%s' WHERE name='%s' ;",
    							mysql_real_escape_string($language),
    							mysql_real_escape_string($name) );
    	}
    	
    	$this->query($query);
       
      return true;
    }
    
    public function listLanguages() {
         $wirings = $this->queryToArray("SELECT languages.*,COUNT(wirings.id) AS wirings FROM languages LEFT OUTER JOIN wirings ON languages.name=wirings.language GROUP BY wirings.language ORDER BY wirings DESC");
         return $wirings;
    }
     
    public function loadLanguage($name) {
       $wirings = $this->queryToArray( sprintf("SELECT * from languages WHERE name='%s'", mysql_real_escape_string($name) ) );
       return $wirings[0];
    }
      
    public function deleteLanguage($name) {
      $this->query( sprintf("DELETE from languages WHERE name='%s'", mysql_real_escape_string($name) ) );
      return true;
   }
       
}

// JSON-RPC
class jsonRPCServer {
	public static function handle($object) {
	   
		if ($_SERVER['REQUEST_METHOD'] != 'POST')
			return false;
				
		$request = json_decode(file_get_contents('php://input'),true);
		
		try {
			if ($result = @call_user_func_array(array($object,$request['method']),$request['params'])) {
				$response = array ('id' => $request['id'],'result' => $result,'error' => NULL);
			} else {
				$response = array ('id' => $request['id'], 'result' => NULL,'error' => "unknown method '".$request['method']."' or incorrect parameters");
			}
		} catch (Exception $e) {
			$response = array ('id' => $request['id'],'result' => NULL,'error' => $e->getMessage());
		}
		
		if (!empty($request['id'])) {
			header('content-type: text/javascript');
			echo json_encode($response);
		}
		
		return true;
	}
}

$myExample = new LanguageEditor();
jsonRPCServer::handle($myExample) or print 'no request';

?>
