/*
var WORKSPACE = (function(){

	var workspace = {}
	
	// Load the workspace with the given problems objectiveId.
	// Reference any data associated to this objectiveId, and load it with the init function of the graph.js module.
	workspace.loadWorkspace = function(objectiveId)
	{	
		var dataset = [{"x": "100", "y": "400"}, {"x": "150", "y": "380"}, {"x": "300", "y": "300"}, {"x": "400", "y": "100"},{"x": "500", "y": "100"},{"x": "600", "y": "300"},{"x": "700", "y": "450"}];
		
		$('#main').load('workspace.html', function() {
			jQuery.getScript('js/graph.js').done(function(data, textStatus, jqxhr) {
				init(dataset);
			}).fail(function() {
				console.log('ERROR: Did not load graph.js');
			});
			
			$('li').removeClass("active");
			$('li').first().addClass("active");
		});
	}
	
	return workspace;

}(jQuery)); */
/*$(document).ready(function() {
	$('#pig').on('click', function() { alert('fuck u'); }); });

/*function loadWorkArea(area) {
	if (area === "analyze")
		alert('');
}*/

// Loads workspace home page
loadWorkspaceHome = function() {
	$('#main').load('workspace.html', function() {
			includeFile();// Must go before getScript	
			// These next two lines are ugly, I have to wait to update attributes to give time for includeFile() to execute
			setTimeout (function() {document.getElementsByClassName('active')[0].setAttribute('class', '');
			document.getElementById('workspaceHomeTab').setAttribute('class', 'active'); }, 10);
		}).hide().fadeIn(600);
	}

// Loads workspace spreadsheet
loadSpreadsheet = function() {
	$('#main').load('spreadsheet.html', function() {
			includeFile();// Must go before getScript	
			// These next two lines are ugly, I have to wait to update attributes to give time for includeFile() to execute
			setTimeout (function() {document.getElementsByClassName('active')[0].setAttribute('class', '');
			document.getElementById('spreadsheetTab').setAttribute('class', 'active'); }, 100);
		}).hide().fadeIn(600);
	}

loadGraph = function() {
	$('#main').load('graph.html', function() {
		includeFile();
		setTimeout(function() {document.getElementsByClassName('active')[0].setAttribute('class', '');
				document.getElementById('graphTab').setAttribute('class', 'active'); }, 100);
		}).hide().fadeIn(600);
	}
// Loads the graph
/*loadGraph = function() {
	$('#main').load('graph.html', function() {
		includeFile();// Must go before getScript	
			jQuery.getScript('js/graph.js').done(function(data, textStatus, jqxhr) {
				document.getElementsByClassName('active')[0].setAttribute('class', '');
				document.getElementById('graphTab').setAttribute('class', 'active');
			})
			.fail(function(jqxhr, settings, exception) {
			
				console.log('ERROR: Did not load graph.js');
				console.log('Exception: ' + exception);
				
			});
		}).hide().fadeIn(600);
	}
*/
// Loads the terminal
/*loadTerminal = function() {
	$('#main').load('terminal.html', function() {
			includeFile(); // Must be up here so that updating tabs works
		  var text_input = document.getElementById('terminalInput');
		  text_input.focus();
		  text_input.select();
		jQuery.getScript('js/terminal.js').done(function(data, textStatus, jqxhr) {
			document.getElementsByClassName('active')[0].setAttribute('class', '');
			document.getElementById('terminalTab').setAttribute('class', 'active');
		}).fail(function(jqxhr, settings, exception) {
		
			console.log('ERROR: Did not load terminal.js');
			console.log('Exception: ' + exception);
			
		});
	}).hide().fadeIn(600);
} */


// Data Controller for workspace
WorkspaceDataController = function(json, datasetId) {
	this.dataset = json;	
	this.datasetId = datasetId;
	this.metadata = this.extractMetadata(json);
console.log(this.metadata);
}

WorkspaceDataController.prototype.deleteDataset = function() {
	queryServer("datasetInterface", "deleteDataset", this.datasetId, 
		"window.spreadsheet.deleteDataset", false); // Make call back a var
}

// Takes JSON data and extrats metadata from it
WorkspaceDataController.prototype.extractMetadata = function(json) {
	var metadata = {};
console.log(metadata);
	metadata['name'] = json['name'];
	metadata['class'] = json['class'];
	metadata['locked'] = Boolean(json['locked']);
	metadata['public'] = Boolean(json['public']);
	metadata['time'] = json['time'];
	metadata['datasetId'] = json['datasetId'];
	metadata['owner'] = json['owner'];
console.log(metadata);
	return metadata;
}

WorkspaceDataController.prototype.updateDataset = function(newDataset) {
	this.dataset = newDataset;
	this.metadata = this.extractMetadata(newDataset);
}

WorkspaceDataController.prototype.updateData = function(newData) {
	this.dataset["data"] = newData;
}

WorkspaceDataController.prototype.updateMetadata = function(newMetadata) {
	this.metadata = newMetadata;
}

WorkspaceDataController.prototype.getData = function() { 
	return this.dataset["data"];
}

WorkspaceDataController.prototype.getDataset = function() { 
	return this.dataset;
}

WorkspaceDataController.prototype.getMetadata = function() {
	return this.metadata;
}

WorkspaceDataController.prototype.saveDataset = function() {
}

WorkspaceDataController.prototype.getDatasetId = function() {
	return this.datasetId;
}

WorkspaceDataController.prototype.setDatasetId = function(datasetId) {
	this.datasetId = datasetId;
}

// Someday add support for colum ntypes...
generateNewDataset = function(metadata, columnTitles, numRows, dataType, 
	range, conditionSwitchPoints, numConditions) {
	var dataset = {};
console.log(dataset);
	dataset = metadata;
	var data = [];
	var value;
	var nextSwitchPoint;
	
console.log(dataset);
	if (numConditions > 0)
		var nextSwitchPoint = 0; 

	data[0] = columnTitles;
	for (var row = 0; row < numRows; row++)
	{
		data[row] = [];
		for (var col = 0; col < columnTitles.length; col++)
		{
			if (numConditions > 0 && col == 0 
					&& conditionSwitchPoints[nextSwitchPoint] == row)
				nextSwitchPoint++;

			if (numConditions > 0 && col == 0) 
				value = nextSwitchPoint; // This var has 2 values at once, change later
			else if (dataType[col].toLowerCase() == "d")
				value = getRandomInt(range[col]["min"], range[col]["max"]);
			else if (dataType[col].toLowerCase() == "c")
				value = getRandomArbitrary(range[col]["min"], range[col]["max"]);
			data[row][columnTitles[col]] = value; 
		}
	}
console.log(dataset);
	dataset.data = data;	
console.log(dataset);
	return dataset;
}

/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
function getRandomArbitrary(min, max) {
    var result = Math.random() * (max - min) + min;
	console.log(result);
	return result;
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
	var min = parseInt(min);
	var max = parseInt(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

saveNewDataset = function(dataset, callbackFunction) {
	dataset.data = transformToObject(dataset.data);
	console.log(dataset);
	$.ajax({
		type: "POST",
		url: "http://visustat.com/interface/datasetInterface.php",
		data: {"param": JSON.stringify(dataset), "action":"storeDataset"},
		success: function(response) { callbackFunction(response); }//callbackFunction(response); },
		});
} 

updateDataset = function(dataset, callbackFunction, datasetId) {
	dataset.data = transformToObject(dataset.data);
	console.log(dataset);
	$.ajax({
		type: "POST",
		url: "http://visustat.com/interface/datasetInterface.php",
		data: {"param": JSON.stringify(dataset) + "|" + datasetId, "action":"updateDataset"},
		success: function(response) { callbackFunction(response); }//callbackFunction,
		});
} 

computeMean = function(data)
{
	var sum = 0;
	for (var i = 0; i < data.length; i++)
		sum += data[i];
	return sum/data.length;
}

computeMedian = function(data)
{
	data.sort(function (a, b) { return a-b; });
	var median;
	var midPoint = Math.floor(data.length / 2);

	if (data.length % 2 == 0)
		median = (data[midPoint - 1] + data[midPoint]) / 2;
	else 
		median = data[midPoint];

	return median;
}

computeMode = function(data)
{
	var currentNum; // The current number
	var currentCount; // The frequency of the current number
	var mode; // The current mode
	var modeCount = 0; // The count for that there mode
	
	data.sort(function (a, b) { return a-b; });

	// Set up the current number values
	currentNum = data[0];
	currentCount = 1;

	// Iterate through the collection and determine the mode: O(n)
	for (var i = 1; i < data.length; i++)
	{
		// If switching numbers
		if (data[i] != currentNum)
		{
			// If there mode needs to be reset to the last number, do so
			if (currentCount >= modeCount)
			{
				modeCount = currentCount;
				mode = currentNum;	
			}	

			// Clear the values from the last number
			currentCount = 0;
			currentNum = data[i];
		}
	
		currentCount++;	
	}

	return mode;
}

computeVariance = function(data)
{
	var variance = 0;
	var mean = this.computeMean(data);
	
	for (var i =0; i < data.length; i++)
		variance += Math.pow(mean - data[i], 2);
	
	return variance / data.length; 
}

computeStandardDeviation = function(data) 
{
	return Math.sqrt(this.computeVariance(data));
}
