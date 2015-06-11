// VisuStat
// Version 1.0
// terminal.js
//
// Contains the javascript related to the R Terminal System



/**
 * Class representing the client-side components of the R remote terminal
 * client.
 * @class class to present R terminal
 */
function Terminal() {
	this.history = [""]; // Array used to keep track of command history
	this.historyPointer  = 0; // Pointer used for history
	this.heap = new Array(); // Associative array of the form name => value,
						   // provides dynamic memory for storage of variables
	// All allowable real R commands
	// Client-side validates but so does server-side
	var allowableRealCommands  = ["cat", "c", "mean", "mode", "median",
		"sd", "var", "mad", "qnorm", "sqrt", "qt", "length", "which", 
		"read.table", "subset", "rep", "seq", "factor", "data.frame",
		"ls", "exists", "rm", "str", "nrow", "ncol", "dim", "is.null",
		"is.na", "is.nan", "sum", "runif", "floor", "sample", "rnorm",
		"set.seed", "round", "ceiling", "trunc", "as.formula",
		"sort", "arrange", "sub", "qsub", "factor", "levenls", "droplevels",
		"ordered", "t.test", "relevel", "names", "rename", "aov", "summary"];

	// All allowable custon remote commands
	// Client-side and server both validate input
	var customRemoteCommands = ["mwu"]; 

	// All allowable custom local commands
	this.customLocalCommands = ["mkOne", "clear", "mkdataset", "reset", "allCommands"]; 

	this.allowableCommands = allowableRealCommands.concat(customRemoteCommands,
		this.customLocalCommands);
	
	// All allowable operands	
	this.allowableOperators = ["<-", "->", "(", ")", "-", "+", "!", "~", "?", 
		":", ",", "*", "/", "^", "%%", "%*%", "%in%", "<", ">", "==", ">=", 
		"<=", "&", "&&", "|", "||", "$", "[", "[[", "]", "]]"]; 

	// The terminal's output 
	this.terminalOutput = document.getElementById('terminalOutput');    

	// Output welcome message when terminal starts
	this.welcome(); 
}


/**
 * Outputs a welcome message when a user first starts the terminal.
*/
Terminal.prototype.welcome = function() {
	terminalOutput.innerHTML +=  '<br />';
	terminalOutput.innerHTML += 'Visustat R Terminal<br /><br />';
	terminalOutput.innerHTML += 'Enter "allCommands" to see a list of usable '
		+ 'commands. <br />';
	terminalOutput.innerHTML += 'For help on any command, type ? preceding the'
		+ ' command name. <br />';
}

/**
 * Pushes new user input into the input buffer
*/
Terminal.prototype.pushInput = function() {
	var input = document.getElementById('terminalInput').value;
	document.getElementById('terminalInput').value = '';
	var tokenizedInput = this.tokenize(input);
	var isValidInput = this.validateInput(tokenizedInput);  

	if (isValidInput)
		this.processInput(tokenizedInput);
	else 
		this.terminalOutput.innerHTML += 'Invalid. More detail later. <br />';
	
	this.history[this.history.length-1] = input;
	this.history.push("");
	this.historyPointer = this.history.length - 1;
	document.getElementById('terminalInput').value = "";
}

/**
 * Determines appropriate path of execution for valid input
 *
 * @param String[] token tokenized input
*/
Terminal.prototype.processInput = function(token) {
	var pushToServer = true;

	if (this.containsFunctionCall(token))
	{
		var runtimeStack = this.buildRuntimeStack(token);
		var response = this.executeLocalFunctions(runtimeStack, token);

		if (response["isValid"])
		{
			if (response["complete"])
				pushToServer = false;
			else
				token = response["newToken"];	
		}
		else
			this.terminalOutput.innerHTML += 'Invalid more detail later.. <br />';
	}	
	
	if (pushToServer)
		this.pushToServer(token);		
}

Terminal.prototype.pushToServer = function(token) {
	var input = token.join("");
	var query = "http://psychstudioxpress.net/visustat/src/interface/rTerminalInterface.php?action=pushInput&param=" + encodeURIComponent(input);
	$.getJSON(query, function( json ) {
		console.log(json);
		json = JSON.parse(json);
		terminalOutput.innerHTML += '> ' + input + '<br />';
		terminalOutput.innerHTML += (Array.isArray(json.value) && json.value.length > 1) ? '[' + json.value +']' : json.value[0];
		terminalOutput.innerHTML += '<br />';
	});
}

/** 
 * Builds the runtime stack
 * 
 * @param String[] token array of all input tokens
 * @return String[] array representing the runtime stack
*/
Terminal.prototype.buildRuntimeStack = function(token) {
	var runtimeStack = new Array();

	for (var i = 0; i < token.length; i++)
		if (this.isFunctionCall(i, token))
			runtimeStack.push({"functionName":token[i],
				"functionIndex":i});
	
	return runtimeStack;
}

/** 
 * Checks for local functions on the runtime stack 
 * 
 * @param String[] runtimeStack
 * @param String[] token
 * @return mixed new input token if commands still need processing on
 *		server side, true if no other commands need to be executed,
 *		false if error
*/
Terminal.prototype.executeLocalFunctions = function(runtimeStack, token) {
	var seenRemoteFunction = false;
	var newToken = token.slice(0);

	// First determine if the order of runtime stack is valid for execution
	var isLocal;
	var response = new Array();
 	response["isValid"] = true;
	for (var i = (runtimeStack.length - 1); response["isValid"] && i >= 0; i--)
	{
		isLocal = this.isLocalFunction(runtimeStack[i]["functionName"]);
		if (isLocal && seenRemoteFunction)
			response["isValid"] = false;
		if (!isLocal && !seenRemoteFunction)
			seenRemoteFunction = true;
	}

	// Execute local functions
	if (response["isValid"])
	{
		var done = false;
		var functionParameters;
		// Parameterize and execute each local function
		for (var i = (newToken.length - 1); !done && i >= 0; i--)
		{
			if (this.isFunctionCall(i, newToken) 
				&& this.isLocalFunction(newToken[i]))
			{
				functionParameters = this.parameterize(i, newToken);
				newToken = this.executeLocalFunction(functionParameters,
					i, newToken);
			}

			else if (this.isFunctionCall(i, newToken) && 
				!this.isLocalFunction(newToken[i]))
				done = true;	
		}	
	}

	response["newToken"] = newToken;
	
	if (!seenRemoteFunction)
		response["complete"] = true;
	return response;
}

/**
 * Executes a local function, returning the output of that function
 *
 * @param String[] parameters parameters for the function
 * @param String functionName the function to execute
 * @param String[] token the command line
 * @return String the new command line
 */
Terminal.prototype.executeLocalFunction =function(functionParameters, 
	functionPointer, token)
{
	var returnValue;

	if (token[functionPointer] === "clear")
		this.clearScreen();	
	else if (token[functionPointer] === "mkOne")
		returnValue = this.wildDog(functionParameters);

	var newToken = this.updateToken(returnValue, functionPointer, token);

	return newToken;
}

Terminal.prototype.updateToken = function(returnValue, functionPointer, token) {
	var newToken = token.slice(0);

	newToken[functionPointer] = returnValue;
	var end = false;
	for (var i = (functionPointer + 1); !end && i < newToken.length; i++)
	{
		if (newToken[i] === ")")
			end = true;
		newToken[i] = "";
	}
	
	return newToken.filter(Boolean);	
}


// About to pull my hair out
Terminal.prototype.wildDog = function(params) {
	var sum = 0;
	for (var i = 0; i < params.length; i++)
		sum += parseInt(params[i]);
	return sum;
} 

/**
 * Parses the parameters for a function
*/
Terminal.prototype.parameterize = function(functionPointer, token) {
	var parameters = new Array();
	var inFunctionCall = false;

	for (var i = functionPointer; i < token.length; i++)
	{
		if (token[i] === "(")
			inFunctionCall = true;
		else if (token[i] === ")")
			inFunctionCall = false;
		else if (inFunctionCall && token[i] !== ",")
			parameters.push(token[i]);
	}

	return parameters;
}

/**
 * Uses whitespace to split input string into tokens
 *
 * @param input String input string from user
 * @return String[] array of tokens from input
*/
Terminal.prototype.tokenize = function(input) {
	var initialSplit = input.split(" ");
	var secondarySplit = new Array();
	var tokenizedInput = new Array();
	var i;
	
	for (i = 0; i < initialSplit.length; i++)
	{
		secondarySplit.push(initialSplit[i].replace(/(\(|\)|,)/gi, "~$1~"));
		secondarySplit[i] = secondarySplit[i].split("~");
		tokenizedInput = tokenizedInput.concat(secondarySplit[i]);
	}
	
	tokenizedInput = tokenizedInput.filter(Boolean);
	
	return tokenizedInput;	
}

/**
 * Checks if a given token is valid
 *
 * @param index int index of the current token
 * @param token String[] array of all input tokens
 * @return boolean whether the current token is valid
*/
Terminal.prototype.isValidToken = function(index, token) {
	var isValid = false;
	
	// Check if token is a function call, if not check if operand or operator
	if (this.isFunctionCall(index, token))
		isValid = this.isValidFunction(token[index]); 
	else
		isValid = this.isValidOperand(token[index]) 
			|| this.isValidOperator(token[index]);

	return isValid;
}

/**
 * Check whether an input string contains a function call
 *
 * @param String token collection of input tokens
 * @return boolean whether the input contains a function call
*/
Terminal.prototype.containsFunctionCall = function(token) {
	var result = false;	
	for (var i = 0; !result && i < token.length; i++)
		result = this.isFunctionCall(i, token);

	return result;
}

/**
 * Checks if a function is a local function
 *
 * @param String requestedFunction the requested function
 * @return boolean whether the requested function is local
*/
Terminal.prototype.isLocalFunction = function(requestedFunction) {
	return jQuery.inArray(requestedFunction, this.customLocalCommands) > -1;
}

/**
 * Determines if a function call has white space or not
 *
 * @param token String token representing the function call
 * @return boolean whether the function call has a space between the name and
 *	opening paren
*/
Terminal.prototype.hasSpace = function(token) {
	return !(new RegExp(".*[(].*").test(token));
}

/**
 *  Checks if a token is a function call
 *
 * @param index int index of the current token
 * @param token String[] array of all input tokens
 * @return boolean whether the current token is a function call
*/
Terminal.prototype.isFunctionCall = function(index, token) {
	return index < (token.length - 1) && token[index + 1] === "(";
}

/**
 *  This checks if a token is a valid operand
 *
 * @param String token current token
 * @return boolean whether the current token is a valid operand
*/
Terminal.prototype.isValidOperand = function(token) {
	var acceptablePatternVariable = new RegExp("^[A-Z|a-z|\?].*$");
	return this.isANumber(token) || acceptablePatternVariable.test(token);
}

/**
 * This checks if a token is a valid operator
 *
 * @param String token current token
 * @return boolean whether the current token is a valid operator
*/
Terminal.prototype.isValidOperator = function(token) {
	return jQuery.inArray(token, this.allowableOperators) > -1;
}

/**
 * Checks if a given value is a number
 *
 * @param mixed value a given value
 * @return boolean whether the value is a number
*/
Terminal.prototype.isANumber = function(value) {
	return !isNaN(parseFloat(value)) && isFinite(value);
}

/** This checks if a token that is a function is an allowable function
 *
 * @param String requestedFunction the function being requested
 * @return boolean whether the requested function is allowed
*/
Terminal.prototype.isValidFunction = function(requestedFunction) {
	return jQuery.inArray(requestedFunction, this.allowableCommands) > -1;
}

/**
 *  Ensures input is properly formatted synatically and uses allowable functions
 *		and operands
 *	@param String[] token array of input tokens
 *  @return boolean whether the input is valid
 */
Terminal.prototype.validateInput = function(token) {
	var isValid = true;

	// Check each token for invalid input 
	for (var i = 0; isValid && i < token.length; i++)
		isValid = this.isValidToken(i, token);		
	
	return isValid;
}

/**
 * Clears the terminal screen
 */
Terminal.prototype.clearScreen = function() {
	this.terminalOutput.innerHTML = '';    
}

/**
 * Enables keyboard functions
 *
 * @param e a keyup event
*/
Terminal.prototype.keyboardListener = function(e) {
	if (e.keyCode == 13) 
		document.getElementById('submitBtn').click();
	else if (e.keyCode == 38)
	{
		e.preventDefault();
		this.rewindHistoryPointer();
	}
	else if (e.keyCode == 40)
		this.progressHistoryPointer();
}

/**
 * Moves the history pointer forwards (more recent) and updates the terminal input box
 */
Terminal.prototype.progressHistoryPointer = function() {
	if (this.historyPointer <= (this.history.length - 1))
	{
		this.historyPointer++;
		document.getElementById('terminalInput').value = this.history[this.historyPointer];
	}
}

/**
 * Moves the history pointer backwards (older) and updates the terminal input box
 */
Terminal.prototype.rewindHistoryPointer = function() {
	if (this.history.length > 0 && this.historyPointer > 0)
	{
		this.historyPointer--;
		document.getElementById('terminalInput').value = this.history[this.historyPointer];
	}
}

var terminal = new Terminal();
