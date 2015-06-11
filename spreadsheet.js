// At ths point my hair is falling out - 6/26/2014
// Mission accomplished - 6/30/2014

// Constructor
// Takes a JSON dataset
Spreadsheet = function(dataController) {
	this.dataController = dataController;
	this.datasetId = dataController.getDatasetId();
	this.metadata = dataController.getMetadata();
	this.importData();
	document.getElementById('dataTable').innerHTML = "";
console.log(window.dialog.changeTable);
	this.loadNewDataset();
}

Spreadsheet.prototype.loadNewDataset = function () {
	if (typeof $('#dataTable').handsontable('getInstance') !== "undefined") {
		if (window.dialog.changeTable) {
			$('#dataTable').handsontable('getInstance').destroy();
			document.getElementById('datasetName').innerHTML = "";
			document.getElementById('datasetMetadata').innerHTML = "";
		}
	}

	$("#dataTable").handsontable({
		data: this.data,	
		minSpareRows: 1,
		contextMenu: true
		});

	this.outputMetadata();
}

Spreadsheet.prototype.getDataset = function() {
	return this.dataController.getDataset();
}

Spreadsheet.prototype.outputMetadata = function() {
	var datasetNameLabel = document.getElementById('datasetName');
	var datasetMetadataLabel = document.getElementById('datasetMetadata');

	datasetNameLabel.innerHTML = " " + this.metadata["name"];
	if (this.metadata['locked'])
		datasetMetadataLabel.innerHTML = "Locked. ";
	else
		datasetMetadataLabel.innerHTML = "Unlocked. ";
	if (this.metadata['public'])
		datasetMetadataLabel.innerHTML += "Public. ";
	else
		datasetMetadataLabel.innerHTML += "Private. ";
	datasetMetadataLabel.innerHTML += "<br />Last mofified on " + this.getTimeStamp(this.metadata['time']) + ".<br />";
	datasetMetadataLabel.innerHTML += "Dataset ID: " + this.datasetId;
	
	if (this.metadata['owner'])
		datasetMetadataLabel.innerHTML += "<br /><button onClick='spreadsheet.deleteDatasetMenu();' class='btn btn-default btn-sm'><span class='glyphicon glyphicon-remove'></span>&nbsp;Delete</button>";
}	

Spreadsheet.prototype.deleteDatasetMenu = function() {
	$.Zebra_Dialog('<strong>Are you sure</strong> you would like to delete' +
		' the dataset ' + this.metadata['name'] + '?<br />' +
		'Note that a deleted dataset cannot, under any circumstances, be' +
		' recovered.', {
			'type':'warning',
			'title':'Confirm Delete Request',
			'buttons': ['Yes', 'No'],
			'onClose': function(caption) {
				if (caption === "Yes")
					window.spreadsheet.dataController.deleteDataset();
			}
		}); 
}

Spreadsheet.prototype.deleteDataset = function(response) {
	if (response == true) {
			$('#dataTable').handsontable('getInstance').destroy();
			document.getElementById('datasetName').innerHTML = "";
			document.getElementById('datasetMetadata').innerHTML = "";
			document.getElementById('dataTable').innerHTML = "Dataset deleted";
	}

	else
		console.log("error");
}

Spreadsheet.prototype.getTimeStamp = function(timestamp) {
	var obj = new Date(timestamp * 1000); // Turn to milliseconds
	var year = obj.getFullYear();
	var month = obj.getMonth() + 1;
	var day = obj.getDate();
	var hours = obj.getHours();
	var minutes = obj.getMinutes();

	return month + "/" + day + "/" + year + ", " + 	hours + ":" + minutes;
}


// I know it has some built in load and save shit, but fuck that...maybe this
// should be refactored to use that someday but its too hard to understand

// Key : what you're gettin that dataset with (ex: id)
// Value :teh value of the key ur searching by (ex: an ID number)
/*queryServer = function(request, key, value, callbackFunction) {
var query = "http://psychstudioxpress.net/visustat/src/interface/datasetInterface.php?action=" + request + "&param=" + key + "|" + value;
console.log(query);
$.ajax({
	type: 'GET',
	url: query,
	dataType: 'json',
	success: function(response) {
console.log("call back function " + callbackFunction);
		var json = response;
		console.log(json);
		if (json[0]["class"] !== "Dataset" && json[0]["class"] !== "DatasetId")
			console.log("Response from server is of an invalid type.");
		else
			eval(callbackFunction + "(json)");
	},
	data: {},
	asynch: false
	});//["responseJSON"];

}
*/
initializeSpreadsheet = function(json) {
	console.log('dog'); console.log(json);
	json = json[0];
	var dataController = new WorkspaceDataController(json, dialog.datasetId);
	spreadsheet = new Spreadsheet(dataController);
	dialog.menu.innerHTML = "";
}

// Takes JSON data and extrats metadata from it
getMetadata = function(json) {
	var metadata = {};
	metadata['name'] = json['name'];
	metadata['class'] = json['class'];
	metadata['locked'] = Boolean(json['locked']);
	metadata['public'] = Boolean(json['public']);
	metadata['time'] = json['time'];
	metadata['datasetId'] = json['datasetId'];
	metadata['owner'] = json['owner'];
	return metadata;

}

// Takes JSON data and puts it in a format that HandsonTable can understand
Spreadsheet.prototype.importData = function() {
	var j;
	var data = [];
	var rawData = this.dataController.getData();
	console.log(rawData);
	var keys = Object.keys(rawData[0]);

	//for (var i = 0; i < json["data"].length; i++)
	//	data[i] = [];
	data[0] = keys;

	console.log(data);
	for (var i = 0; i < rawData.length; i++)
	{
		data[i + 1] = [];
		for (j = 0; j < keys.length; j++)
		{
			data[i + 1][j] = rawData[i][keys[j]];
		}
	}
	console.log(data);

	this.data = data;
/*	
var data = [
["", "Kia", "Nissan", "Toyota", "Honda"],
["2008", 10, 11, 12, 13],
["2009", 20, 11, 14, 13],
["2010", 30, 15, 12, 13]
]; */
}

// Takes dta from spreadsheet n puts it in format the rest of the system uses
Spreadsheet.prototype.exportData = function() {
	var j;
	var exportData = [];
	var rawData = $("#dataTable").handsontable("getData");
	console.log(rawData);
	var keys = rawData[0];

	//for (var i = 0; i < json["data"].length; i++)
	//	data[i] = [];

	console.log(exportData);
	for (var i = 1; i < rawData.length; i++)
	{
		exportData[i - 1] = {};
		for (j = 0; j < keys.length; j++)
		{
			exportData[i - 1][keys[j]] = rawData[i][j];
		}
	}
	console.log(exportData);

	return exportData;
/*	
var data = [
["", "Kia", "Nissan", "Toyota", "Honda"],
["2008", 10, 11, 12, 13],
["2009", 20, 11, 14, 13],
["2010", 30, 15, 12, 13]
]; */
}

Dialog = function() {
	//this.openDialog(dialog);
}

// Takes a string specifying what the dialog is needed for, calls
// appropriate function to generate dialog. Does starting stuff common to all
// dialogs
Dialog.prototype.openDialog = function(dialog) {
	this.controlPanel = document.getElementById('controlPanel');
	this.menuTitle = 'dialogMenu';	
	var hr = document.createElement('hr');
	this.controlPanel.appendChild(hr); // Bug here
	this.menu = document.createElement('span');
	this.menu.setAttribute('id', this.menuTitle);
	this.controlPanel.appendChild(this.menu);
	this.menu = document.getElementById(this.menuTitle);

	if (dialog === "new")
		this.newDialog();
	else if (dialog === "load")
		this.loadDialog();
	else if (dialog === "save")
		this.saveDialog();
	else
		document.getElementById(menuTitle).innerHTML = "Invalid Request.";
}

Dialog.prototype.newDialog = function() {
	this.menu.innerHTML = "";
	this.menu = document.getElementById('dataTable');

	this.menu.innerHTML = "<h4>Create new dataset</h4>";
	this.menu.innerHTML += "<hr />";
	this.menu.innerHTML += "Would you like this dataset to contain computer generated";
	this.menu.innerHTML += " data?&nbsp;";
	this.menu.innerHTML += "<button id='randomDataBtn' onClick='window.dialog.newRandomDsMenu();' class='btn btn-default btn-sm'>Yes</button>&nbsp;";
	this.menu.innerHTML += "<button id='nonRandomDtaBtn' onClick='window.dialog.emptyDatasetMenu();' class='btn btn-default btn-sm'>No</button>";
}

Dialog.prototype.buildEmptyDataset = function() {
	/*
	dataset["name"] = "Untitled Dataset";
	dataset["time"] = (new Date).getTime();
	dataset["owner"] = "Dwight2";
	dataset["class"] = "Dataset";
	dataset["locked"] = true;
	dataset["public"] = false; */
	var dataset = this.createNewMetadata();
	dataset["data"] = [];
	dataset["data"][0] = [];
	dataset["data"][0]["var1"] = 
	dataset["data"][0]["var2"] = "";
	var dataController = new WorkspaceDataController(dataset);
	document.getElementById('dataTable').innerHTML = "";
	spreadsheet = new Spreadsheet(dataController);
}

Dialog.prototype.createNewMetadata = function() {
	var metadata = {};
	metadata["name"] = document.getElementById('newName').value;
	metadata["time"] = Math.round(+new Date()/1000);
	metadata["owner"] = readCookie('username');
	metadata["class"] = "Dataset";
	metadata["locked"] = (document.querySelector('input[name="lock"]:checked').value === "y") ? true : false;
	metadata["public"] = (document.querySelector('input[name="public"]:checked').value === "y") ? true: false;
	return metadata;
}

Dialog.prototype.emptyDatasetMenu = function() {
	document.getElementById('randomDataBtn').setAttribute("disabled", "");
	document.getElementById('nonRandomDtaBtn').setAttribute("disabled", "");
	this.menu.innerHTML += "<hr />Name: <input type=\"text\" id=\"newName\" /><br />";
	this.menu.innerHTML += "Locked:&nbsp;<input type=\"radio\" name=\"lock\" "
		+ "value=\"y\" />Yes &nbsp;<input type=\"radio\" name=\"lock\" "
		+ "value=\"n\" />No<br />";
	this.menu.innerHTML += "Public:&nbsp;&nbsp;&nbsp;<input type=\"radio\" name=\"public\" "
		+ "value=\"y\" />Yes&nbsp;&nbsp;<input type=\"radio\" name=\"public\" "
		+ "value=\"n\" />No<br /><br />";
	this.menu.innerHTML += "<button onClick='dialog.buildEmptyDataset();' class='btn btn-default btn-sm'><span class='glyphicon glyphicon-ok-circle'></span>&nbsp;Build</button><br /><br />";
			this.menu.innerHTML += "<button onClick='dialog.buildAndSaveEmpty();' class='btn btn-default btn-sm'><span class='glyphicon glyphicon-floppy-disk'>&nbsp;Build and Save</span></button>";
}

Dialog.prototype.buildAndSaveEmpty = function() {
	this.buildEmptyDataset();
	window.dialog.openDialog('save');
}

Dialog.prototype.newRandomDsMenu = function() {
	createCookie('random', true, 1); // For input validation, make sure they went thru this stage first
	//document.getElementById('randomDataBtn').setAttribute("disabled", "");
	//document.getElementById('nonRandomDtaBtn').setAttribute("disabled", "");
	this.menu.innerHTML = "<h4>Create new dataset</h4>";
	this.menu.innerHTML += "<hr />";
	this.menu.innerHTML += "Name: <input type=\"text\" id=\"newName\" /><br />";
	this.menu.innerHTML += "Locked:&nbsp;<input type=\"radio\" name=\"lock\" "
		+ "value=\"y\" />Yes &nbsp;<input type=\"radio\" name=\"lock\" "
		+ "value=\"n\" />No<br />";
	this.menu.innerHTML += "Public:&nbsp;&nbsp;&nbsp;<input type=\"radio\" name=\"public\" "
		+ "value=\"y\" />Yes&nbsp;&nbsp;<input type=\"radio\" name=\"public\" "
		+ "value=\"n\" />No<br />";
	this.menu.innerHTML += "<br />Number of Rows:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type=\"text\" id=\"numRows\" size=\"2\" /><br />";
	this.menu.innerHTML += "<br />Number of Columns: <input type=\"text\" id=\"numCols\" size=\"2\" /><br />";
	this.menu.innerHTML += "<hr />";
	this.menu.innerHTML += "<p>If you would like this dataset to have different conditions, or factors, use this menu to do so. If you would not like multiple conditions, simply put 0 in the box below.</p>";
	this.menu.innerHTML += "<br />Number of Conditions: <input type=\"text\" id=\"numConds\" size=\"2\" /><br />";
	this.menu.innerHTML += "Please enter the number of observations in each condition seperated by commons:<br />";
	this.menu.innerHTML += "<input type=\"text\" id=\"condSwitchPts\" placeholder=\"Seperated by commas\" /><br />";
	this.menu.innerHTML += "<button onClick='dialog.columnBuilder();' class='btn btn-default btn-sm'><span class='glyphicon glyphicon-arrow-right'></span>&nbsp;Next</button>";
}

Dialog.prototype.columnBuilder = function() {
	// Get some data from the last run
	var numConds = document.getElementById('numConds').value;
	var condSwitchPoints = document.getElementById('condSwitchPts').value;
	var numRows = document.getElementById('numRows').value;
	this.numCols = document.getElementById('numCols').value;
	createCookie('numRows', numRows, 1);
	createCookie('numCols', numCols, 1);
	createCookie('numConds', numConds, 1);
	createCookie('condSwitchPts', JSON.stringify(condSwitchPoints.split(",")), 1);
	createCookie('column', JSON.stringify([]), 1); // If I use numCols here this might be better
	createCookie('metadata', JSON.stringify(this.createNewMetadata()), 1); // Store last form's results
	this.singleColumnMenu(0); // Ghetto loop
}

Dialog.prototype.parseColumnData = function() {
	var column = JSON.parse(readCookie('column'));
	var columnTitle = [];
	var dataType = [];
	var range = [];
	var numConds = readCookie('numConds');
	var startCol = (numConds == 0) ? 0 : 1; 
	
	if (startCol == 1)
	{
		range[0] = [];

		columnTitle[0] = "cond";
		dataType[0] = "d";
		range[0]["min"] = 0;
		range[0]["max"] = 1;
		numConds;
	}	

	var index;
	for (var i = 0; i < column.length; i++)
	{
		index = (startCol == 0) ? i : (i + 1);
	
		range[index] = [];
		columnTitle[index] = column[i]["name"];
		dataType[index] = column[i]["dataType"];
		range[index]["min"] = column[i]["min"];
		range[index]["max"] = column[i]["max"];
	}
	
//	setTimeout(
this.newDataset(JSON.parse(readCookie('metadata')), columnTitle, readCookie('numRows'), dataType, range, JSON.parse(readCookie('condSwitchPts')), numConds);//, 10000);
}

Dialog.prototype.singleColumnMenu = function(colNum) {
	this.menu.innerHTML = "<h4>Create new dataset</h4>";
	this.menu.innerHTML += "<h5>Information for Column " + (colNum + 1)+ "</h4>";
	this.menu.innerHTML += "<hr />";
	this.menu.innerHTML += "Column name:<br />";
	this.menu.innerHTML += "<input type=\"text\" id=\"colName\" placeholder=\"\"/><br />";
	this.menu.innerHTML += "Column's data type:&nbsp;<input type=\"radio\" name=\"dataType\" "
		+ "value=\"d\" />Discrete &nbsp;<input type=\"radio\" name=\"dataType\" "
		+ "value=\"c\" />Continuous<br />";
	this.menu.innerHTML += "Ranges for this column:<br />";
	this.menu.innerHTML += "Min: <input type=\"text\" id=\"min\" placeholder=\"m\" size=\"2\" />&nbsp;&nbsp;";
	this.menu.innerHTML += "Max: <input type=\"text\" id=\"max\" size=\"2\" /><br />";
	this.menu.innerHTML += "<button onClick='dialog.buildSingleColumn(" + colNum + ");' class='btn btn-default btn-sm'><span class='glyphicon glyphicon-arrow-right'></span>&nbsp;Next</button>";
}

Dialog.prototype.buildSingleColumn = function(colNum) {
	var column = JSON.parse(readCookie('column'));
	if (column) 
	{
		var name = document.getElementById('colName').value;
		var min = document.getElementById('min').value;
		var max = document.getElementById('max').value;
		var dataType = document.querySelector('input[name="dataType"]:checked').value;
		if (dataType !== "d" && dataType !== "c")
			console.log("error");
		column[colNum] = {"name":name, "dataType":dataType, "min":min, "max":max};
		createCookie("column", JSON.stringify(column), 1);

		colNum++;

		console.log(colNum +"<"+ this.numCols)
		if (colNum < this.numCols)
			this.singleColumnMenu(colNum);
		else {
			this.menu.innerHTML = "<h4>Create new dataset</h4>";
			this.menu.innerHTML += "<hr />";
			this.menu.innerHTML += "<p>The dataset may now be built, click finish to build and load the dataset.</p>";
			this.menu.innerHTML += "<button onClick='dialog.parseColumnData();' class='btn btn-default btn-sm'><span class='glyphicon glyphicon-ok-circle'>&nbsp;Build</span></button><br /><br />";
			this.menu.innerHTML += "<button onClick='dialog.buildAndSave();' class='btn btn-default btn-sm'><span class='glyphicon glyphicon-floppy-disk'>&nbsp;Build and Save</span></button>";
		}
	}	
}

Dialog.prototype.buildAndSave = function() {
	this.parseColumnData();
	window.dialog.openDialog('save');
}

Dialog.prototype.newDataset = function(metadata, columnTitle, numRows, dataType, range, conditionSwitchPoints, numConditions) {
	//console.log(columnTitle); console.log(numRows); console.log(dataType);
	//	console.log(range); console.log(conditionSwitchPoints); console.log(numConditions);
	console.log(range);
	/*var metadata = this.createNewMetadata();
	var columnTitles = document.getElementById('colNames').value.split(",");
	var numRows = parseInt(document.getElementById('numRows').value) + 1;
	var dataType = document.getElementById('dataTypes').value.split(",");
	var conditionSwitchPoints = document.getElementById('condSwitchPts').value.split(",");
	var numConditions = document.getElementById('numCond').value;	
	var range = this.parseRange(document.getElementById('range').value);	
*/
	var dataset = generateNewDataset(metadata, columnTitle, numRows, dataType,
		range, conditionSwitchPoints, numConditions);
	var dataController = new WorkspaceDataController(dataset);
	document.getElementById('dataTable').innerHTML = "";
	spreadsheet = new Spreadsheet(dataController);
} 

Dialog.prototype.parseRange = function(range) {
	range = range.split("|");
	var segment;
	for (var i = 0; i < range.length; i++)
	{
		segment = range[i].split(",");
		range[i] = [];
		range[i]["min"] = segment[0];
		range[i]["max"] = segment[1];
	}
	return range;	
}

Dialog.prototype.loadDialog = function() {
	this.menu.innerHTML = "";
	this.menu.innerHTML += "<small>Select a public dataset: <select id='getPublic'>";
	this.generatePublicDatasetDropDown();
	this.menu.innerHTML += "</select></small><br />";
	this.menu.innerHTML += "<small>Select dataset you own: </small>";
	this.menu.innerHTML += "<small><select id='getOwn'>";
	setTimeout(function() { dialog.generateOwnDatasetDropDown(); }, 1000);
	this.menu.innerHTML += "</select></small><br />";
	this.menu.innerHTML += "<small>Load dataset by ID: ";
	this.menu.innerHTML += "<input type='text' id='getDirect' /></small><br />";
	this.menu.innerHTML += "<button onClick='dialog.executeLoad();' class='btn btn-default btn-sm'><span class='glyphicon glyphicon-ok-circle'></span>&nbsp;Load</button>";
}


Dialog.prototype.generatePublicDatasetDropDown = function() {
console.log(this.menu);
	this.dropDownType = "getPublic";
	queryServer("datasetInterface", "getDatasetIds", "public|trueB", "window.dialog.makeDropDown", false); 
console.log(this.menu);
}

Dialog.prototype.generateOwnDatasetDropDown = function() {
console.log(this.menu);
	this.dropDownType = "getOwn";
	queryServer("datasetInterface", "getDatasetIds", "owner|" + readCookie('username'), "window.dialog.makeDropDown", false); 
console.log(this.menu);
}

Dialog.prototype.makeDropDown = function(json) {
console.log(json);
console.log(this.dropDownType);
	var selectMenu = document.getElementById(this.dropDownType);
	selectMenu.innerHTML += "<option value=\"empty\" selected></option";
	for (var i = 0; i < json.length; i++)
		selectMenu.innerHTML += "<option value=" + json[i]["id"] + ">" + json[i]["name"] + "</option>";
}

Dialog.prototype.executeLoad = function() {
	var getPublic = document.getElementById('getPublic');	
	var getOwn = document.getElementById('getOwn');
	var getDirect = document.getElementById('getDirect');

	//console.log("if ("+getPublic.options[getPublic.selectedIndex].value+" != \"empty\" && "+getOwn.options[getOwn.selectedIndex].value+" == \"empty\" && "+getDirect.value+" == \"\"");
	// Might can redo usng index not vlaue..
	if (getPublic.options[getPublic.selectedIndex].value != "empty" && getOwn.options[getOwn.selectedIndex].value == "empty" && getDirect.value == "")
		this.datasetId = getPublic.options[getPublic.selectedIndex].value; 
	else if (getPublic.options[getPublic.selectedIndex].value == "empty" && getOwn.options[getOwn.selectedIndex].value != "empty" && getDirect.value == "")
		this.datasetId = getOwn.options[getOwn.selectedIndex].value; 
	else if (getPublic.options[getPublic.selectedIndex].value == "empty" && getOwn.options[getOwn.selectedIndex].value == "empty" && getDirect.value != "")
		this.datasetId = getDirect.value; 
	else
		this.datasetId = "error";

	if (this.datasetId != "error")
	{
		// Take care of existing tables
		if (typeof $('#dataTable').handsontable('getInstance') !== "undefined")
		{
			// Make sep function
			$.Zebra_Dialog('Are you sure you weant to leave this dataset without ' +
				'saving it first?', {
				'type': 'question',
				'title': 'Save Dataset?',
				'buttons':	[
								{caption: 'Save and Exit', callback: function() { window.dialog.openDialog('save'); window.dialog.reallyLoad(true); }},
								{caption: 'Exit w/o saving', callback: function() { window.dialog.reallyLoad(true); }},
								{caption: 'Cancel', callback: function() { return; }}
							]
			});
		}

		else
			this.reallyLoad(true);
	}
	else
		alert("Please select a dataset to load");
}	

Dialog.prototype.reallyLoad = function(changeTable) {
		this.changeTable = changeTable;
		if (changeTable)
			queryServer("datasetInterface", "getDataset", "id|" + this.datasetId, "initializeSpreadsheet", false); 
}



Dialog.prototype.saveDialog = function() {
	if (typeof spreadsheet.dataController.getDatasetId() === "string")
	{
		var dataset = spreadsheet.getDataset();
		var datasetId = spreadsheet.datasetId;
	dataset.data = spreadsheet.exportData();
	dataset.time = Math.round(+new Date()/1000);
	updateDataset(dataset, function(response) { alert("Dataset " + response + " updated successfully."); }, datasetId);
}
else if (typeof spreadsheet.dataController.getDatasetId() === "undefined")
{
	var dataset = spreadsheet.getDataset();
	dataset.data = spreadsheet.exportData();
	saveNewDataset(dataset, function(response) { alert("Dataset created with ID " + response); });
}
}

Spreadsheet.prototype.displayAnalysisMenu = function(analysisType) {
	if (analysisType === "tTest")
		this.launchTtestMenu();
	else if (analysisType === "oneway")
		this.launchOnewayMenu();
	else
		alert("Invalid analysis type");
}

Spreadsheet.prototype.launchTtestMenu = function() {
	var independentVariable = prompt("What is the independent variable for this analysis?");
	var dependentVariable = prompt("What is the dependent variable for this analysis?");
	this.computeInferentialData("tTest", independentVariable, dependentVariable);
}

Spreadsheet.prototype.launchOnewayMenu = function() {
	var independentVariable = prompt("What is the independent variable for this analysis?");
	var dependentVariable = prompt("What is the dependent variable for this analysis?");
	this.computeInferentialData("oneway", independentVariable, dependentVariable);
}

Spreadsheet.prototype.computeInferentialData = function(test, independentVariable, dependentVariable) {
	var i, j;
	var commandString = "";
	var dataset = this.getDataset(); 
	dataset.data = this.exportData();
	this.dataset = dataset;
	var data = this.dataset.data;
	var names = Object.keys(data[0]);
	names.splice(names.indexOf(independentVariable), 1);

console.log("rat test");
console.log(this.dataset);
	if (test === "tTest") {
		this.test ="tTest";
		commandString += "t.test(c(";
	}

	else if (test === "oneway") {
		this.test = "oneway";
		commandString += "summary(aov(c(";
	}
			
		// Build data group
		for (i = 0; i < (data.length - 2); i++) 
			commandString += data[i][dependentVariable] + ", ";
		commandString += data[i][dependentVariable] + ") ~ c(";
		
		// Cond stuff
		for (i = 0; i < (data.length - 2); i++) 
				commandString += data[i][independentVariable] + ", ";

		commandString += data[i][independentVariable] + "))";
		console.log(commandString);
		
		if (test === "oneway")
			commandString += ")";

	var canvasInfoColumn = document.getElementById('spreadsheetInfoColumn');
	var selectionMenu = document.getElementById('options');
	var inferentialBox = document.getElementById('inferential');
	if (canvasInfoColumn.contains(inferentialBox))
		canvasInfoColumn.removeChild(inferentialBox);
		queryServer("rTerminalInterface", "pushInput", commandString, "window.spreadsheet.displayInferentialData", true);
}


Spreadsheet.prototype.displayInferentialData = function(json) {
	var canvasInfoColumn = document.getElementById('spreadsheetInfoColumn');
	var selectionMenu = document.getElementById('options');
	var inferentialBox = document.createElement("div");
	inferentialBox.setAttribute("class", "well well-sm");
	inferentialBox.setAttribute("id", "inferential");
	inferentialBox.setAttribute("style", "height:225px; overflow:auto");
	//canvasInfoColumn.innerHTML += "<div class='well well-sm' id='inferential' style='height:225px;overflow:auto'></div>";

	var result;
	var pValue;
	if (this.test === "tTest") {
		result = json.split(" ");
		var tValue = result[(result.indexOf("/>t") + 2)];
		pValue = result[(result.indexOf("p-value") + 2)];
		pValue = pValue.substring(0, pValue.length - 3);
		pValue = parseFloat(pValue).toFixed(5);

		if (pValue != 0)
			pValue = "= " + pValue;
		else
			pValue = "< 0.00001";

		var confInt = [];
		confInt[0] = result[(result.indexOf("interval:<br") + 2)];
		confInt[1] = result[(result.indexOf("interval:<br") + 3)];
		inferentialBox.innerHTML += "<b>Independent Samples <i>t</i>-Test:</b><br />";
		inferentialBox.innerHTML += "<i>t</i> = " + tValue + "<br />";
		inferentialBox.innerHTML += "Probability (<i>p</i>) " + pValue + "<br />";
		inferentialBox.innerHTML += "95% confidence: " 
			+ confInt[0] + 
			"-" + confInt[1] + "<br />";
		inferentialBox.innerHTML += "<br /><br />";
		inferentialBox.innerHTML += "<i>t</i> = the difference between the means of "
			+ "two groups divided by a value derived from the combined "
			+ "standard deviations of the two groups.";

	}
	else if (this.test === "oneway") {
			result = JSON.parse(json);
			var names = result["value"][0]["attributes"]["names"]["value"];
			var dfIndex = names.indexOf("Df");
			var sumSquareIndex = names.indexOf("Sum Sq");
			var meanSquareIndex = names.indexOf("Mean Sq");
			var fIndex = names.indexOf("F value");
			var pIndex = names.indexOf("Pr(>F)");

			var values = result["value"][0]["value"];

			var df = new Array();
			var sumSquare = new Array();
			var meanSquare = new Array();
			var i;
			for (i = 0; i < 2; i++)
				df.push(values[dfIndex]["value"][i]);
			for (i = 0; i < 2; i++)
				sumSquare.push(values[sumSquareIndex]["value"][i]);
			for (i = 0; i < 2; i++)
				meanSquare.push(values[meanSquareIndex]["value"][i]);
			var fValue = values[fIndex]["value"][0];
			var pValue = values[pIndex]["value"][0];
			pValue = pValue.toFixed(5);
			
			if (pValue != 0)
				pValue = pValue;
			else
				pValue = "< 0.00001";
			var totalSs = sumSquare[0] + sumSquare[1];
			var totalMs = meanSquare[0] + meanSquare[1];
			var totalDf = df[0] + df[1];
			inferentialBox.innerHTML += "<b>Between Subjects Oneway ANOVA</b><br />";
			inferentialBox.innerHTML += "<table border='1'>"
										+ "<tr>"
										+ "<td></td><td>Sum Sq</td><td>Df</td><td>Mean Sq</td><td>F</td><td>Probability (<i>p</i>)</td>"
										+ "</tr><tr>"
										+ "<td>Main Effect A</td><td> " + sumSquare[0].toFixed(2) + "</td><td> " + df[0] + "</td>"
										+ "<td>" + meanSquare[0].toFixed(2) + "</td><td>" + fValue.toFixed(3) + "</td><td>" + pValue + "</td>"
										+ "</tr><tr>"
										+ "<td>Within Groups</td><td> " + sumSquare[1].toFixed(2) + "</td><td> " + df[1] + "</td>"
										+ "<td colspan='3'>" + meanSquare[1].toFixed(2) + "</td>"
										+ "</tr><tr>"
										+ "<td>Total</td><td> " + totalSs.toFixed(2) + "</td><td> " + totalDf + "</td>"
										+ "<td colspan='3'>" + totalMs.toFixed(2) + "</td>"
										+ "</tr></table>";
		}

		canvasInfoColumn.insertBefore(inferentialBox, selectionMenu);
}

//loadData("id", "fc84c75d000c0862b4bf5216550036f6");
