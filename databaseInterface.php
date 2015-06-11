<?php
// VisuStat
// Version 1.0
// databaseInterface.php
//
// Provides interface to the couchDB

require_once 'globalFunctions.php';

define("PROTOCOL",	"http");
define("SERVER",	"localhost");
define("PORT",		"5984");
define("DATABASE",	"visustat");

/* Adds documents to the database
 *
 * @param jsonObj the JSON object to be added to the database
 * @return returns the id of the newly added object, or NULL in 
 *		the event of failure
*/
function store($jsonString)
{
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, PROTOCOL . "://" . SERVER . ":" . PORT . "/"
		. DATABASE);
	curl_setopt($ch, CURLOPT_POST, 1);
	curl_setopt($ch, CURLOPT_HTTPHEADER,
		array('Content-Type: application/json'));
	curl_setopt($ch, CURLOPT_POSTFIELDS, $jsonString);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	$status = json_decode(curl_exec($ch));
	curl_close ($ch);

	if (array_key_exists('id', $status))
		return $status->id;
	else
		return $status->error.$status->reason;
}


function deleteDocument($id, $rev) 
{
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, PROTOCOL . "://" . SERVER . ":" . PORT . "/"
		. DATABASE ."/".$id."?rev=".$rev);
	curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "DELETE");
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	$result = curl_exec($ch);
	curl_close($ch);
	
	$result = json_decode($result, true);
	if (array_key_exists('error', $result) && $result["error"] == "not_found")
		$result = false;
	else 
		$result = true;
	
	return $result;
}

function update($body, $id, $rev)
{
	$body = substr($body, 0, -1);
	$body .= ", \"_id\":\"".$id."\", \"_rev\":\"".$rev."\"}";
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, PROTOCOL . "://" . SERVER . ":" . PORT . "/"
		. DATABASE ."/".$id);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT");
	curl_setopt($ch, CURLOPT_HTTPHEADER, 
		array('Content-Type: application/json'));
	curl_setopt($ch, CURLOPT_POSTFIELDS, $body);
	$status = json_decode(curl_exec($ch));

	curl_close ($ch);

	if (array_key_exists('id', $status))
		return $status->id;
	else
		return $status->error.$status->reason;	
}

/**
 * Executes a get query on the database.
 *
 * @param String $query name of the query to be executed
 * @param String[] $param parameters for the query
 * @param boolean $include whether "include_docs" should be set true
 * @return JSON JSON returned by couchDB.
 */
function get($query, $param, $include)
{
	$paramCount = count($param);
	
	$url = "http://localhost:5984/visustat/_design/general_query/_view/".$query."?";

	if ($paramCount == 1)
	{
		if ($param[0] != "trueB" && $param[0] != "falseB")
			$url .= "key=\"".urlencode($param[0])."\"";
		else
			$url .= "key=".urlencode(substr($param[0], 0, -1));
	}

	else if ($paramCount >= 1)
	{
		$url .= "key=".urlencode("[");	
		for ($i = 0; $i < $paramCount; $i++)
		{
			/*if ($param[$i] == "trueB" || $param[$i] == "falseB")
			{
				if ($i < ($paramCount - 1))
					$url .= $param[$i].", ";
				else
					$url .= $param[$i]."]";
			}

			else
			{*/
				if ($i < ($paramCount - 1))
					$url .=  urlencode("\"".$param[$i]."\", ");
				else
					$url .= urlencode("\"".$param[$i]."\"]");
			//}
		}
	}

	if ($include)
		$url .= "&include_docs=true";
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($ch, CURLOPT_URL, $url);
	$content = curl_exec($ch);
	return $content;	
}

/**
 * Extracts the actual object data from couchDB's output
 *
 * @param JSON $json pure JSON from couchdb.
 * @param boolean $include whether include_docs was set true
 * @param boolean $multiple whether there are multiple rows in the query
 *      results. False by default
 * @return String[] associative array of values if sucessful, bool false if fail
*/
function jsonExtract($json, $include, $multiple = false)
{
	$json = json_decode($json, true);	
	
	if (count($json['rows']) == 0)
		$json = false;
			
	if ($json != false && $include && !$multiple)
		$json = $json['rows'][0]['doc'];
	else if ($json != false && !$multiple)
		$json = $json['rows'][0]['value'];
	else if ($json != false && $multiple && !$include)
		$json = $json['rows']; 
	else if ($json != false && $multiple && $include)
	{ 
		$row = $json['rows'];
		$json = array(); 
		foreach ($row as $current)
			$json[] = $current['doc'];
	}

	return $json;
}

/**
 * Casts array of extracted JSON objects as the appropriate PHP class.
 * 
 * @param String $result array of extracted JSON objects
 * @param String $class appropriate class for data
 */
function castResults($result, $class)
{
	$method = "__constructJson";

	// If $result is a single row, wrap it in an array
	if (!is_indexed($result))
		$result = $class::$method($result);
	
	else
	{
		foreach ($result as &$current)
			$current = $class::$method($current);
	}

	return $result;
}

?>
