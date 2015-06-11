<?php
// VisuStat
// Version 1.0
// analysisInterfaceFunctions.php
//
// Functions to facilitate interface to the analysis engine

// Include dependencies
require_once '../errorMessages.php';
require_once '../databaseInterface.php';

/**
 * Relays an analysis request to the analysis engine and relays 
 * the returns analysis response
 *
 * @param Mixed[] $analysisResponse associative array representing analysis
 *		request
 * @return Mixed[] associative array representing analysis response or false
 */
function executeAnalysis($analysisRequest)
{
	$analysisRequest = htmlspecialchars_decode($analysisRequest);
	$analysisRequest = json_decode($analysisRequest, true);

	if ($analysisRequest['class'] !== "AnalysisRequest" 
		|| !isset($analysisRequest['analysisType']) || !isset($analysisRequest['data'])
		|| !isset($analysisRequest['independentVariable']) 
		|| !isset($analysisRequest['dependentVariables']))
			$analysisResponse = false;

	else 
	{
		$analysisRequest['data'] = convertAnalysisRequestData(
		$analysisRequest['data']);
		$analysisRequest = json_encode($analysisRequest);

		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, PROTOCOL . "://" . SERVER . 
			"/visustat/src/R/analysisGateway.r");
		curl_setopt($ch, CURLOPT_POST, 1);
		curl_setopt($ch, CURLOPT_POSTFIELDS, "analysisRequest=".$analysisRequest);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

		$analysisResponse = curl_exec($ch);
		curl_close($ch); 
	}

	return $analysisResponse;
}

/**
 * Repackages analysisRequest dataset in a manner that is compatible with 
 * analysis engine. Might rewrite in R.
 *
 * @param $analysisData dataset for analysis
 * @return Mixed[] array of analysis data formated as an R data frame
*/
function convertAnalysisRequestData($analysisData)
{
	foreach ($analysisData as $row)
		foreach ($row as $columnTitle => $columnValue)
			$newData[$columnTitle][] = $columnValue;

		return $newData;
}


/**
 * Gets all classes associated with a specified user.
 *
 * @param String $username username for user in question
 */
function getClasses($username)
{
	// Get the course pointers for the user
	$coursePointers = get("get_course_by_username", array($username), false);
	$coursePointers = jsonExtract($coursePointers, false);
	$coursePointers = castResults($coursePointers, "CoursePointer");
	
	// Get data about each course using course pointers
	foreach ($coursePointers as $current)
	{
		$params = array($current->getName(), $current->getInstitution());
		$current = get("get_course_by_pointer", $params, true);
		$current = jsonExtract($current, true);
		$courses[] = $current;
		
		$currentFac = get("get_faculty_by_course", $params, true);
		$currentFac = jsonExtract($currentFac, true);
		$faculty[] = $currentFac;
	} 
	
	$courses = castResults($courses, "Course");

	$count = count($courses);
	// Package for front end
	for ($i = 0; $i < $count; $i++)
	{
		// This is done essentially to convert an object to an associative
		// array.
		$courses[$i] = json_encode($courses[$i]);
		$courses[$i] = json_decode($courses[$i], true);
		
		$courses[$i]['fname'] = $faculty[$i]['fname']; 
		$courses[$i]['lname'] = $faculty[$i]['lname']; 
	}

	$courses = json_encode($courses, true);
	echo $courses;
}
?>
