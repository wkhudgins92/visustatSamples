<?php
// VisuStat
// Version 1.0
// rTerminalFunctions.php
//
// Functions to facilitate interface to the connection between the R client-
// terminal and the R server

// Include dependencies
require_once '../errorMessages.php';
require_once '../databaseInterface.php';
require_once 'analysisInterfaceFunctions.php';

$validOperators = array();

$validRealFunctions = ["cat", "c", "mean", "mode", "median",
		"sd", "var", "mad", "qnorm", "sqrt", "qt", "length", "which", 
		"read.table", "subset", "rep", "seq", "factor", "data.frame",
		"ls", "exists", "rm", "str", "nrow", "ncol", "dim", "is.null",
		"is.na", "is.nan", "sum", "runif", "floor", "sample", "rnorm",
		"set.seed", "round", "ceiling", "trunc", "as.formula",
		"sort", "arrange", "sub", "qsub", "factor", "levenls", "droplevels",
		"ordered", "t.test", "relevel", "names", "rename", "aov", "summary"];
$validCustomFunctions = ["mwu"];
$validUnaryOperators = ["-", "+", "!", "~", "?", '`'];
$validBinaryOperators = ["<-", "->", "(", ")", "-", "`", "+", "!", "~", "?", ":", 
	",", "*", "/", "^", "[", "]", "<", ">", "==", ">=", "<=", "$"];
//$pairedOpeningOperators = ["(", "["];
//$pairedClosingOperators = [")", "]"];
$validOperators = array_values(array_unique(array_merge($validUnaryOperators, 
	$validBinaryOperators)));


/**
 * Takes in a Terminal Input object and returns a Terminal Output object.
 * Like the main function essentially.
 *
 * @param Mixed[] $terminalInput associative array representing terminal Input
 * @return Mixed[] associative array representing terminal onput or false
 */
function takeTerminalInput($terminalInput)
{
	$terminalOutput = array();	
	$token = tokenize($terminalInput);

	$_SESSION['afterTokenize'] = $token;
	if (isValid($token))
	{
		$token = replaceVariables($token);
		$terminalOutput = pushToServer($token);
	}
	
	else
		$terminalOutput = "error";

	$_SESSION['afterIsValidBranchInTakeInput'] = $terminalOutput;
	return json_encode($terminalOutput);
//	return $terminalOutput;
}

function needsEscape($str)
{
	return ($str == "(" || $str == ")" || $str == "|" || $str == "||"
		|| $str == "+" || $str == "*" || $str == "/" || $str == "?"
		|| $str == "[" || $str == "]");
}

function tokenize($input)
{	
	global $validOperators;
	$initialSplit = explode(" ", $input);
	$tokenizedInput = array();
$_SESSION['startOfTokenize'] = $input;
	$regex = "/(";
	for($i = 0; $i < count($validOperators) - 1; $i++)
	{
		if (needsEscape($validOperators[$i]))
			$regex .= "\\".$validOperators[$i]."|";
		else
			$regex .= $validOperators[$i]."|";
	}

	$regex .= "\\".$validOperators[$i].")/";
	
	for ($i = 0; $i < count($initialSplit); $i++)
	{
		$currentSegment = preg_replace("/~/", "`", $initialSplit[$i]);
		$currentSegment = preg_replace($regex, "~$1~", $currentSegment);
		$currentSegment = explode("~", $currentSegment);
		foreach ($currentSegment as &$current)
			$current = preg_replace("/`/", "~", $current);
		if (count($currentSegment) > 1)
			$tokenizedInput = array_merge($tokenizedInput, $currentSegment);
		else
			$tokenizedInput[$i] = $currentSegment[0];		
	}
	
	$tokenizedInput = array_filter($tokenizedInput, 
		function ($x) { return $x != ""; });
	
	return array_values($tokenizedInput); // resets indices at 0	
}

function isValid($token)
{
	$resultArray = array();
	$result = true;
	$isString = false;
	for ($i = 0; $i < (count($token) - 1) && $result; $i++)
	{
		if (isFunctionCall($token, $i))
			$result = isValidFunction($token[$i]);
		else if (!$isString && $token[$i] === "\"")
			$isString = true;
		else if ($isString && $token[$i] === "\"")
			$isString = false;
		else if (!$isString && is_numeric($token[$i]))
			$result = true;
		else if (!$isString && preg_match("/\w/", $token[$i]))
			$result = isValidVariable($token, $i);
		else if (!$isString && $token[$i] !== "(" || $token[$i] !== ")")
			$result = isValidOperator($token[$i]);
		else if (!$isString && $token[$i][0] == "?" && count($token) === 2)
			$result = true;
	$resultArray[] = $result;
	}
$_SESSION['isValidResult'] = $resultArray;
	return $result;
}

function isFunctionCall($token, $index)
{
	return $index < (count($token) - 1) && $token[$index + 1] === "(";
}

function isValidFunction($functionName)
{
	global $validRealFunctions;
	global $validCustomFunctions;
	return in_array($functionName, array_merge($validRealFunctions,
		$validCustomFunctions));
}

function isValidVariable($token, $index)
{
	$result = false;
	if (beingAssigned($token, $index))
		$result = true;
	else
		$result = array_key_exists($token[$index], $_SESSION['heap']);
	$_SESSION['isValidVariableResult'] = $result; // Need to add some error msg
	return $result;
}

function beingAssigned($token, $index)
{
	$result = false;
	if ($index > 1 && $token[$index - 1] === "->")
		$result = true;
	else if ($index < (count($token) - 2) && $token[$index + 1] === "<-")
		$result = true;
	return $result;
}

function replaceVariables($token)
{
	$isString = false;
	$_SESSION['startOfReplaceVariables'] = $token;
	for ($i = 0; $i < count($token); $i++)
	{
		if (!$isString && $token[$i] === "\"")
			$isString = true;
		else if ($isString && $token[$i] === "\"")
			$isString = false;
		else if (!$isString && !is_numeric($token[$i]) 
			&& preg_match("/\w/", $token[$i]) && !beingAssigned($token, $i)
			&& !isFunctionCall($token, $i))
		{
			if ($i > 0 && $token[$i - 1] === "?" && count($token) == 2)
			{
					$token[0] = "paste(?".$token[1].", \"\")";
					unset($token[1]);
			}
			else 
			{
				if (count($_SESSION['heap'][$token[$i]]) > 1) 
					$token[$i] = arrayToVectorString(
						$_SESSION['heap'][$token[$i]]); 
				else
					$token[$i] = $_SESSION['heap'][$token[$i]];
			}
		}
	}
$_SESSION['afterReplaceVariables'] = $token;
	return $token;
}

function arrayToVectorString($array)
{
	$vectorString = "c(";
	$i = 0;
	for (; $i < count($array) - 1; $i++)
		$vectorString .= $array[$i].", ";
	$vectorString .= $array[$i].")";
	return $vectorString;
}

function isValidOperator($input)
{
	global $validOperators;
	return in_array($input, $validOperators);
}

function findNewVariable($token)
{
	$result = "";
	
	for ($i = 0; $i < count($token) && $result === ""; $i++)
	{
		if ($token[$i] === "<-")
			$result = $token[$i - 1];
		else if ($token[$i] === "->")
			$result = $token[$i + 1];
	}

	return $result;
}

function pushToServer($token)
{
		$terminalInput = implode($token);	
	//	$variableAssignment = preg_match("/.*(<-|->).*/", $terminalInput);
	//	$terminalInput = urlencode($terminalInput);
		$_SESSION['dataFedToR'] = $terminalInput;	
	//	if ($variableAssignment)
	//	{
	//		$variableName = findNewVariable($token);
	//		$terminalInput .= "; ".$variableName;	
	//	}
		
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, PROTOCOL . "://" . SERVER . 
			"/R/consoleServer.r");
		curl_setopt($ch, CURLOPT_POST, 1);
		curl_setopt($ch, CURLOPT_POSTFIELDS, "terminalInput=".$terminalInput);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

		$terminalOutput = curl_exec($ch);
		curl_close($ch);
//$_SESSION['isVariableAssignment'] = $variableAssignment;
//		if ($variableAssignment)
//			$_SESSION['heap'][$variableName] = count(json_decode($terminalOutput)->value)  > 1?
//				array_values(json_decode($terminalOutput)->value) : json_decode($terminalOutput)->value[0];

$_SESSION['slut'] = $terminalOutput;
		if ($terminalOutput[0] !== '{')
			$terminalOutput = packageRstyle($terminalOutput);

		return $terminalOutput;
}

// Makes JSON like R
function packageRstyle($data)
{
	$data = preg_replace("/\\n/", "<br />", $data);
	return "{\"type\":\"string\",\"attributes\":{}, \"value\":[\"".$data."\"]}";
}

/**
 * Repackages analysisRequest dataset in a manner that is compatible with 
 * analysis engine. Might rewrite in R.
 *
 * @param $analysisData dataset for analysis
 * @return Mixed[] array of analysis data formated as an R data frame
*/
function convertAnalysisRequestData2($analysisData)
{
}

?>
