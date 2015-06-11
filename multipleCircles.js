/*
 * Contains the MultipleCircles canvas object, which represents a t-test 
 *	or ANOVA
*/

/*
 * Initialize the multipleCircles canvas object for either tTest (2 circles) or
 *	anova (3 circles)
*/
function init(option) {
	if (option == 'tTest')
	{
		var group1 = Array(14, 48, 28, 35, 34, 23, 21, 19, 26, 38, 5, 43, 25,23, 37, 36, 20, 39, 21, 35);
		var group2 = Array(-4, 22, 35, -13, 5, 14, -9, 8, -11, 16, -14, 18, 21, 1, 3, -12, 8, 30, -4, 2);
		window.s = new tTestCanvas(document.getElementById('graph'), [group1, group2]);
		var canvasWorkBench = document.getElementById("canvasWorkBench");
		var exerPanel = document.createElement('div');
		exerPanel.setAttribute('class', 'well well-large');
		exerPanel.setAttribute('id', 'exerPanel');
		canvasWorkBench.appendChild(exerPanel);
		var exerPanel = document.getElementById('exerPanel');
		var exerString = "<b><i>t</i>-test</b><br /><br />";

		exerString += "This graph represents two independent samples.<br /><br />";
		exerString += "<p>The centers of the shaded circles represent the "
		exerString += "samples’ means.</p>";
		exerString += "<p>The outer rings represent one standard deviation ";
		exerString += "the samples’ means The following graphic might help make "
		exerString += "this visual representation clearer:</p>";
		exerString += "<center><img src='ratPig.png' width='555' height='452' /></center>";
		exerString += "<p>As the above graphic illustrates, the circles may be "
		exerString += "thought of as a different view of a distribution. As shown, "
		exerString += "by the graphic, the center of the circle represents the "
		exerString += "mean of the distribution and the entire circle itself "
		exerString += "represents one standard deviation's worth of a distribution.</p>";
		exerString += "<p>The circles in the middle of the distributions can "
			+ "be click-dragged to the left or right, corresponding to lower "
			+ "and higher values, respectively.</p>"; 
		exerString += "<p>The circles on the standard deviation rings can be "
			+ "click-dragged closer to or further from the samples’ means.</p>";
		exerString += "<p>As soon as you click-drag a mean or standard "
			+ "deviation, all measures of central tendency and dispersion are "
			+ "updated. Note these changes to get a feel for the scaling.</p>";

		exerString += "<p>Note that you must scroll the Descriptive Data box "
			+ "up and down to reveal all measures of central tendency and "
			+ "dispersion.</p>";

		exerString += "In addition, two important values are also updated "
			+ "upon releasing click-drag movement of any of the mean or "
			+ "standard deviation circles. These are: 1) the independent "
			+ "samples <i>t</i> value, and 2) the probability value for the "
			+ "associated <i>t</i> value.</p>";

	exerString += "<p>The conventional rule for determining statistical "
		+ "significance is for the test statistic to have an associated "
		+ "probability value that is less than or equal to 0.05 (i.e., "
		+ "<i>p</i> < 0.05). This means that the value, e.g., <i>t</i>, "
		+ "occurs less than 5% of the time, which is considered "
		+ "statistically rare.</p>";
	
	exerString += "<p>When the degrees of freedom for the model are large, "
		+ "and when the alpha (i.e., critical rejection) region of the "
		+ "<i>t</i> sampling distribution equal 0.05, and when using a "
		+ "two-tailed <i>t</i>-test of significance, the cut-off for "
		+ "significant values is at approximately 1.96 standard deviations. "
		+ "In essence, this means that the obtained value for a <i>t</i>-test "
		+ "needs to be &plusmn;1.96 in order to meet the alpha equal 0.05 "
		+ "criterion to be considered statistically significant.</p>"; 

	exerString += "<p>This graph shows an independent samples t-test, and "
		+ "assumes a two-tailed test.</p>";

	exerString += "<b>Try These Exercises:</b><br />";
	exerString += "<ol>";
	exerString +="<li>Once the graph is loaded, move the smaller right-hand "
		+ "circle to the ef, just until it completely verlap the left-hand "
		+ "circle. Note that when a set of values is normally distributed "
		+ "nearly all of its values (~99.7%) are contained within three "
		+ "standard deviations from its mean (i.e., mean &plusmn;3 standard "
		+ "deviations). The circles represent just one standard deviation, "
		+ "so it may be helpful to imagine that the shaded areas extend to "
		+ "around three times the distance from each circle’s mean to its "
		+ "outer in. What do you notice about the measures of central "
		+ "tendency and dispersion for the two samples? What is the "
		+ "<i>t</i>-value? What is the <i>t</i>’s associated probability "
		+ "value?</li>";

	exerString += "<li>Keeping the standard deviations the same, how far must "
		+ "you move one mean away from the other before the <i>t</i> value "
		+ "grows sufficiently large that its probability value drops to "
		+ "(or below) 0.05? Pay attention to the values for each samples' "
		+ "mean when <i>t</i> meets or exceeds the alpha = 0.05 "
		+ "criterion.</li>";

	exerString += "<li>Expand the standard deviation rings until they are "
		+ "equal sized, and the standard deviations are about 25. With this "
		+ "much dispersion within each sample, how far apart do the "
		+ "means for the samples have to be in order for the <i>t</i> value "
		+ "to be statistically significant?</li>";

	exerString += "<li>Click-drag the means and standard deviations and "
		+ "attend to the resulting t values and associated probabilities. "
		+ "What does it take to return a significant probability value? "
		+ "Then, refresh the page and test yourself to see if you can get "
		+ "close to <i>p</i> = 0.05 without watching the values in the "
		+ "report. Can you use observation of the circles to visualize the"
		+ " thresholds that separates significant from non-significant "
		+ "<i>t</i> values at differing diameters (standard deviations) for "
		+ "the samples?</li>";
	exerString += "</ol>";
	exerPanel.innerHTML = exerString;
}

	else if (option == "anova")
	{
		var group1 = Array(14, 48, 28, 35, 34, 23, 21, 19, 26, 38, 5, 43, 25,23, 37, 36, 20, 39, 21, 35);
		var group2 = Array(-4, 22, 35, -13, 5, 14, -9, 8, -11, 16, -14, 18, 21, 1, 3, -12, 8, 30, -4, 2);
		var group3 = Array(9, 9, 3, 90, 99, 89, 19, 39, 96, 58, 73, 46, 93, 93, 20, 100, 67, 80, 5, 15);
		window.s = new tTestCanvas(document.getElementById('graph'), [group1, group2, group3]);
	}
}

/*
 * Constructor for the multiple circles canvas object
 * @param CanvasContext the canvas context to attach this object to
 * @param arr[int][float] this object's initial data, each row is a group
 */
tTestCanvas = function(canvas, groups) {
	// Initial set up
    this.canvas = canvas;
	this.width = canvas.width;
    this.height = canvas.height;
    this.ctx = canvas.getContext('2d');
	this.group = groups;
	this.mean = [];
	this.mode = [];
	this.variance = [];
	this.standardDeviation = [];
	this.median = [];
	this.range = {};
    
	// Calculate padding
	this.TOTAL_X = this.width;
    this.TOTAL_Y = this.height;
    this.TOTAL_PADDING = 100;
    this.USABLE_X = this.TOTAL_X - this.TOTAL_PADDING;
    this.USABLE_Y = this.TOTAL_Y - this.TOTAL_PADDING;  
    
	this.points = new Array();

    // This complicates things a little but but fixes mouse co-ordinate problems
    // when there's a border or padding. See getMouse for more detail
    var stylePaddingLeft, stylePaddingTop, styleBorderLeft, styleBorderTop;
    if (document.defaultView && document.defaultView.getComputedStyle) {
		this.stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingLeft'], 10)      || 0;
		this.stylePaddingTop  = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingTop'], 10)       || 0;
		this.styleBorderLeft  = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderLeftWidth'], 10)  || 0;
		this.styleBorderTop   = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderTopWidth'], 10)   || 0;
    }
    // Some pages have fixed-position bars (like the stumbleupon bar) at the top or left of the page
    // They will mess up mouse coordinates and this fixes that
    var html = document.body.parentNode;
    this.htmlTop = html.offsetTop;
    this.htmlLeft = html.offsetLeft;

    // Initialize state
	this.sDevMod = 2; // start as int 
	this.editedGroup = -1; // Initialize edited group to -1 (no group)
    this.valid = false; // when set to false, the canvas will redraw everything
    this.dragging = false; // Keep track of when we are dragging

    // the current selected object. In the future we could turn this into an array for multiple selection
    this.selection = null;
    this.dragoffx = 0; // See mousedown and mousemove events for explanation
    this.dragoffy = 0;

    // Event listeners
    // If these don't make sense, look at single.js
    var myState = this;
  
    canvas.addEventListener('selectstart', function(e) { e.preventDefault(); return false; }, false);
    canvas.addEventListener('mousedown', function(e) {
		var mouse = myState.getMouse(e);
		var mx = mouse.x;
		var my = mouse.y;
		var points = myState.points;
		var l = points.length;
		
		for (var i = l-1; i >= 0; i--) {
			if (points[i].contains(mx, my) && points[i].drawable) {
				var mySel = points[i];
				// Keep track of where in the object we clicked
				// so we can move it smoothly (see mousemove)
				myState.dragoffx = mx - mySel.x;
				myState.dragoffy = my - mySel.y;
				myState.dragging = true;
				myState.selection = mySel;
				//myState.valid = false;

				// what is being changed
				//if (i % 2 == 0)
					myState.sDevMod = (i % 2 == 0) ? false : true;
				//else if (i % 2 == 1)
					//myState.sDevMod = true;

				// Which group changing 
				myState.editedGroup = Math.floor(i/2);
				return;
			}
		}
		if (myState.selection) {
			myState.selection = null;
		}
	}, true);
	
	
	canvas.addEventListener('mousemove', function(e) {
		if (myState.dragging){
			var mouse = myState.getMouse(e);
			
			// We don't want to drag the object by its top-left corner, we want to drag it
			// from where we clicked. Thats why we saved the offset and use it here
			myState.selection.x = mouse.x - myState.dragoffx;
			myState.selection.y = mouse.y - myState.dragoffy;   
		//	if (myState.inBounds(mouse.x, mouse.y))
		//		myState.valid = false; // Something's dragging so we must redraw
		//	else
		//	{
				if (mouse.x < myState.MOUSE_MIN_X)
					mouse.x = myState.MOUSE_MIN_X;
				else if (mouse.x > myState.MOUSE_MAX_X)
					mouse.x = myState.MOUSE_MAX_X;
				if (mouse.y > myState.MOUSE_MIN_Y)
					mouse.y = myState.MOUSE_MIN_Y;	
				else if (mouse.y < myState.MOUSE_MAX_Y)
					mouse.y = myState.MOUSE_MAX_Y;
				myState.selection.x = mouse.x - myState.dragoffx;
				myState.selection.y = mouse.y - myState.dragoffy;   
				myState.valid = false;
		//	} 
		}
	}, true);
	
	
	canvas.addEventListener('mouseup', function(e) {
		myState.dragging = false;
		myState.valid = false;
	}, true);

	// Initialize data and points
	this.computeDescriptiveData();
	this.computeVirtualRange();
	this.computeCircleData();
	for (var i = 0; i < this.group.length; i++)
	{
		this.addPoint(new Point(this.circleData[i]["centerXval"], this.circleData[i]["centerYval"], true));
		this.addPoint(new Point(this.circleData[i]["centerXval"], this.circleData[i]["centerYval"] - this.circleData[i]["radius"], true));
	}    

	// Graph Loop options
	this.interval = 30;
	setInterval(function() { myState.graphLoop(); }, myState.interval);

	// Add information about how graph works
	this.createAboutDiv();
}

tTestCanvas.prototype.createAboutDiv = function() {
	var canvasInfoColumn = document.getElementById('canvasInfoColumn');
	var aboutDiv = document.getElementById('about');
	if (canvasInfoColumn.contains(aboutDiv))
		canvasInfoColumn.removeChild(aboutDiv);
	
	aboutDiv = document.createElement("div");
	var dataDiv = document.getElementById('data');
	aboutDiv.setAttribute("id", "about");
	aboutDiv.setAttribute("class", "well well-sm");
	aboutDiv.setAttribute("style", "height:125px; overflow:auto");
	aboutDiv.innerHTML = "<p>Here each circle represents a distribution. The " 
		+ "center of each circle represents the sample's mean. "
		+ "The radius of each circle represents its standard deviation.";
	canvasInfoColumn.insertBefore(aboutDiv, dataDiv.nextSibling);
}

/*
 * Graph loop for this canvas object. Is ran 30 times per second. Calls
 *	computeData and dwindow..computeInferentialData
 */
tTestCanvas.prototype.graphLoop = function(){ 
	if (!this.valid) {
		this.computeData();
		this.draw();		
		this.computeInferentialData();
	}
	
}

/*
 * Computes descriptive data for each group
 */
tTestCanvas.prototype.computeDescriptiveData = function() {
	for (var i = 0; i < this.group.length; i++)
	{
		this.mean[i] = computeMean(this.group[i]);
		this.mode[i] = computeMode(this.group[i]);
		this.median[i] = computeMedian(this.group[i]);
		this.variance[i] = computeVariance(this.group[i]);
		this.standardDeviation[i] = computeStandardDeviation(this.group[i]);
	}
}

/*
 * Displays descriptive statistics information
*/
tTestCanvas.prototype.displayStatistics = function() {	
	var i, r, g, b;
	var color = [];
	var dataString = "<b>Descriptive Data:</b><br />";
	dataString += '<b>Mean:</b>';
	dataString += '<ul>';

	for (i = 0; i < this.group.length; i++) {
		// Color coding -- matched in drawCircles
		r = (5 * ((i + 1) * 10)) % 255; // Max value is 255
		g = (57 * (i + 1)) % 255;
		b = 89;
		color[i] = "rgb(" + r + ", " + g + ", " + b + ")";
	}
	for (i = 0; i < this.group.length; i++)
		dataString += '<li style="color: ' + color[i] + '">Group ' + (i + 1) + ': ' + this.mean[i].toPrecision(3) + '</li>';
	dataString += '</ul>';
	dataString += '<b>Median:</b>';
	dataString += '<ul>';
	for (i = 0; i < this.group.length; i++)
		dataString += '<li style="color: ' + color[i] + '">Group ' + (i + 1) + ': ' + this.median[i].toPrecision(3) + '</li>';
	dataString += '</ul>';
	dataString += '<b>Mode:</b>';
	dataString += '<ul>';
	for (i = 0; i < this.group.length; i++)
		dataString += '<li style="color: ' + color[i] + '">Group ' + (i + 1) + ': ' + this.mode[i].toPrecision(3) + '</li>';
	dataString += '</ul>';
	dataString += '<b>Variance:</b>';
	dataString += '<ul>';
	for (i = 0; i < this.group.length; i++)
		dataString += '<li style="color: ' + color[i] + '">Group ' + (i + 1) + ': ' + this.variance[i].toPrecision(3) + '</li>';
	dataString += '</ul>';
	dataString += '<b>Standard Deviation:</b>'; 
	dataString += '<ul>';
	for (i = 0; i < this.group.length; i++)
		dataString += '<li style="color: ' +color[i] + '">Group ' + (i + 1) + ': ' + this.standardDeviation[i].toPrecision(3) + '</li>';
	dataString += '</ul>';	
	document.getElementById('data').innerHTML = dataString;
}

/*
 * Converts a given physical value to the corresponding virtual value
 * @param int totalSpace total space in the direction in question
 * @param int usablePhysicalSpace space in the direction in question minus 
 *	padding
 * @param int virtualSpace the virtual space in the direction in question
 * @param double minValue minimum possible virtual value
 * @param double physicalPoint physical point to convert into a virtual value
 * @param boolean isVerticalPoint whether the supplied physical point, and 
 *	therefore the direction is horizontal or simply distance
 * @return the virtual value corresponding to the supplied physical point
*/
tTestCanvas.prototype.physicalToVirtual = function(totalSpace, usablePhysicalSpace, virtualSpace, minValue, physicalPoint, isHorizontalPoint) {
	var conversionFactor = usablePhysicalSpace / virtualSpace;
	var virtualPoint;

	// Place in context on X-axis
	if (isHorizontalPoint) {	
		physicalPoint = physicalPoint - (this.TOTAL_PADDING / 2);	
		virtualPoint = physicalPoint / conversionFactor;
		virtualPoint = virtualPoint + minValue;
	}

	else	
		var virtualPoint = physicalPoint / conversionFactor;

	return virtualPoint; 
}





/*
 * Computes data for this object. Checks if any dataset should be changed and
 *	directs the appropriate changes and consequential recomputations
*/
tTestCanvas.prototype.computeData = function() {
	// Determine new mean
		// Call physicalToVirtual to turn the physical mean point back into a virtual point
		// This gives us a virtual point, this is the new mean
	// Determine new standard deviation
		// Get x,y coords for sDev point
		// Using the distance formula, compute distance from mean...this is the physical radius of the circle
		// Treating this as an x coord, convert it using physicalToVirtual
		// standard deviation = valueAbove / 3
	// Give the new mean and Sdev to to a function that modulates the dataset 
		// Adjust dataset for mean
			// Determine if it is a plus or minus change
			// while newmean != mean within tolerance
				// foreach data point
					// is plus change ? current + 0.05 : current - 0.05
		// Adjust for standard deviation
			// Determine if plus or minus change
			// while newSd != Sd within tolerance
				// for each data point
				// if current < (mean - 0.5 Sd) && current > (mean - sd)
				//	is plus change ? current - 0.05 : current + 0.05
				// else if current <= (mean - sd)
				//	is plus change ? current - 1 : current + 1
				// else if current > (mean + 0.5 Sd) && current < (mean + sd)
				//	is plus change ? current + 0.05 : current - 0.05
				// else if current >= (mean + sd)
				//	is plus change ? current + 1 : current - 1
	var i;
	var newMeanPoint;
	var newMeanVirtual;
	var newStandardDeviationPoint;
	var newStandardDeviationPhysical;
	var newStandardDeviationVirtual;
	var newStandardDeviation;
	this.computeDescriptiveData();
	var range = this.range["max"] - this.range["min"];

	// Determine new mean and new standard deviation for each group
	for (i = 0; typeof this.sDevMod == "boolean" && i < this.group.length; i ++)
	{
		if (this.editedGroup == i)
		{
			// Use a single variable here because we know that something has been moved, if its not sdev, it is the mean
			if (this.sDevMod)
			{
				// Find new standard deviation by computing new radius' virtual vlaue
				//  and dividing it by 3
				newStandardDeviationPoint = this.points[((i * 2) + 1)];
				newStandardDeviationPhysical = newStandardDeviationPoint.computeDistance(this.points[i * 2]);
				newStandardDeviationVirtual = this.physicalToVirtual(this.TOTAL_X, this.USABLE_X, range, this.range["min"], newStandardDeviationPhysical, false);
				//newStandardDeviationVirtual /= 3;

				// Mutate dataset	
				this.modifyDataset(i, newStandardDeviationVirtual);
			}

			else
			{
				// Find new mean
				newMeanPoint = this.points[i * 2];
				newMeanVirtual = this.physicalToVirtual(this.TOTAL_X, this.USABLE_X, 
					range, this.range["min"], newMeanPoint.x, true);

				// Mutate dataset	
				this.modifyDataset(i, newMeanVirtual);
			}
		}
	}

	// Recompute data
	this.computeDescriptiveData();
	this.computeCircleData();
}

/*
 * Modify a dataset based upon user action
 * @param int datasetNumber the group or dataset to modify
 * @param float newDataPoint the new standard deviation or the new mean, 
 *	depending upon what the value of this.sDevMod is
*/
tTestCanvas.prototype.modifyDataset = function(datasetNumber, newDataPoint) {
	var i;

	// Dataset to modify
	var data = this.group[datasetNumber];
	
	// The old mean or the old standard deviation
	var currentValue = (this.sDevMod) ? this.standardDeviation[datasetNumber] : this.mean[datasetNumber];
	
	// Whether the new mean or standard deviation is less than or greater than the old one
	var plusChange = (newDataPoint > currentValue) ? true : false;

	// Array containing indices to modify if standard deviation is what changed
	var indicesToModify = [];

	// If sDevMod, decide which indices to modify
	for (i = 0; this.sDevMod && i < data.length; i++)
		if (data[i] < (this.mean[datasetNumber] - (0.5 * this.standardDeviation[datasetNumber])) 
			|| data[i] > (this.mean[datasetNumber] + (0.5 * this.standardDeviation[datasetNumber])))
			indicesToModify.push(i);

	// Actually modify the data
	while (Math.abs(newDataPoint - currentValue) > 0.5)
	{
		for (i = 0; i < data.length; i++)
		{
			// Change the mean
			if (!this.sDevMod)
				data[i] = (plusChange) ? data[i] + 0.05 : data[i] - 0.05;
	
			// Change standard deviation
			else if (indicesToModify.indexOf(i) != -1) // If i is index to modify, don't get this
			{
				if (data[i] < (this.mean[datasetNumber] - (0.5 * this.standardDeviation[datasetNumber])) && (data[i] > (this.mean[datasetNumber] - this.standardDeviation[datasetNumber])))
					data[i] = (plusChange) ? data[i] - 0.5 : data[i] + 0.5;
				else if (data[i] <= (this.mean[datasetNumber] - this.standardDeviation[datasetNumber]))
					data[i] = (plusChange) ? data[i] - 1 : data[i] + 1;
				else if (data[i] > (this.mean[datasetNumber] + (0.5 * this.standardDeviation[datasetNumber])) && (data[i] < (this.mean[datasetNumber] + this.standardDeviation[datasetNumber])))
					data[i] = (plusChange) ? data[i] + 0.5 : data[i] - 0.5;
				else if (data[i] >= (this.mean[datasetNumber] + this.standardDeviation[datasetNumber]))
					data[i] = (plusChange) ? data[i] + 1 : data[i] - 1;
			}
		}

		currentValue = (this.sDevMod) ? computeStandardDeviation(data) : computeMean(data);
	}
	this.group[datasetNumber] = data;
}

/* 
 * Determine the circle's center points and radius
*/
tTestCanvas.prototype.computeCircleData = function() {
	// For each group
	// Determine center of circle based upon mean
	// This means determining min and max (do that somewhere else), taking the mean and giving it to virtual to physical
	// This will give us the physical x coord of the center, the y coord is just max y / 2
	// Now, determine the radius based off variance
	var radius;
	var circleData = [];
	var centerXval;
	var centerYval = this.USABLE_Y / 2;
	var range = this.range["max"] - this.range["min"];
	var physicalMax = this.virtualToPhysical(this.TOTAL_X, this.USABLE_X,
		range, this.range["max"], false);
	
	for (var i = 0; i < this.group.length; i++)
	{
		// Determine circle's center based upon mean
		centerXval = this.virtualToPhysical(this.TOTAL_X, this.USABLE_X, range, 
			this.mean[i], false);	
		centerXval = this.virtualToPhysicalCorrected(this.USABLE_X, centerXval, physicalMax);

		// Determine radius based upon standard deviation
		radius = this.mean[i] + (1 * this.standardDeviation[i]);
		radius = this.virtualToPhysical(this.TOTAL_X, this.USABLE_X, range,
			radius, false);
		radius = this.virtualToPhysicalCorrected(this.USABLE_X, radius, physicalMax);
		radius = radius - centerXval;

		// Package this information
		circleData[i] = {};
		circleData[i]["centerXval"] = centerXval;
		circleData[i]["centerYval"] = centerYval;
		circleData[i]["radius"] = radius;
	}

	this.circleData = circleData;
}

/*
 * Actually draw circles
*/
tTestCanvas.prototype.drawCircles = function() {
	for (var i = 0; i < this.group.length; i++)
	{
		// Color coding -- matched in displayStatistics
		var r = (5 * ((i + 1) * 10)) % 255; // Max value is 255
		var g = (57 * (i + 1)) % 255;
		var b = 89;
		var a = 0.4;

		this.ctx.strokeStyle = "rgb(5,57,89)";
		this.ctx.fillStyle = "rgba(" + r + ", " + g + ", " + b + ", " + a + ")";
		
		// Draw actual circle
		this.ctx.beginPath();
		this.ctx.arc(this.circleData[i]["centerXval"], 
			this.circleData[i]["centerYval"], this.circleData[i]["radius"], 0, 
			2 * Math.PI);
		this.ctx.fill();
		this.ctx.stroke();


		// If mean was moved, move sDev point too
		if (this.editedGroup == i && !this.sDevMod)
			this.points[((i * 2) + 1)] = new Point(this.circleData[i]["centerXval"], this.circleData[i]["centerYval"] - this.circleData[i]["radius"], true);
		
	}
}

/* 
 * Computes the virtual range
*/
tTestCanvas.prototype.computeVirtualRange = function() {
	// Find the lowest mean
	// Find the standard deviation for that mean
	// Set min = lowestMean - (6 * sDev)
	// Find highest mean and it's sDev
	// Set max = highestMean + (6 * highestSdev)
	var lowestMean = Math.min.apply(Math, this.mean);
	var highestMean = Math.max.apply(Math, this.mean);
	var lowestIndex = this.mean.indexOf(lowestMean);
	var highestIndex = this.mean.indexOf(highestMean);
	var lowestSdev = this.standardDeviation[lowestIndex];
	var highestSdev = this.standardDeviation[highestIndex];
	this.range['min'] = lowestMean - (3 * lowestSdev);
	this.range['max'] = highestMean + (3 * highestSdev);
} 

/*
 * Convert a virtual value into a physical value in pixels.
 *	Has a bug, so virtualToPhysicalCorrected must be used following
 *	virtualToPhysical
 * @param int totalSpace total space in the direction in question
 * @param int usablePhysicalSpace space in the direction in question minus 
 *	padding
 * @param int virtualSpace the virtual space in the direction in question
 * @param float virtualPoint the virtual point to convert to a physical value
 * @param boolean isVerticalPoint whether the supplied virtual point, and 
 *	therefore the direction in question, is vertical
 * @return double a slightly incorrect value of the virtual point in pixels
*/
tTestCanvas.prototype.virtualToPhysical = function(totalPhysicalSpace, 
	usablePhysicalSpace, virtualSpace, virtualPoint, isVerticalPoint)
{
	var conversionFactor = usablePhysicalSpace / virtualSpace;
	var physicalPoint = virtualPoint * conversionFactor;

	if (isVerticalPoint)
	{
		physicalPoint = totalSpace - physicalPoint;
		physicalPoint = physicalPoint - (this.TOTAL_PADDING / 2);
	}

	else
		physicalPoint = physicalPoint + (this.TOTAL_PADDING / 2);
	
	return physicalPoint;
}


/* 
 * virtualToPhysical has an unresolved bug, this function corrects that
 * @param int usablePhysicalSpace space in the direction in question minus 
 *	padding
 * @param double physicalPoint value given by virtualToPhysical
 * @param int lastPhysicalPoint the maximum possible physical point in a given
 *	direction that maps to a valid virtual value
 * @return double correct physical value
*/
tTestCanvas.prototype.virtualToPhysicalCorrected = function(usableSpace, 
	physicalPoint, lastPhysicalPoint) {
	var correction = usableSpace - lastPhysicalPoint;
	return physicalPoint + correction + (this.TOTAL_PADDING / 2);
} 

/*
 * Draws an X-axis on the canvas
*/
tTestCanvas.prototype.drawAxis = function() {
	var paddingX = (this.TOTAL_X - this.USABLE_X) / 2;
	var paddingY = (this.TOTAL_Y - this.USABLE_Y) / 2;
	var physicalSpaceX = this.TOTAL_X;
	var physicalSpaceY = this.TOTAL_Y;
	var numHashMarks = 6;	
	var ctx = this.ctx;
	
	ctx.lineWidth = 1;
	ctx.fillStyle = "#000000";
	ctx.font = "bold 14px Arial";

	// X axis
	ctx.beginPath();
	ctx.moveTo(paddingX, this.circleData[0]["centerYval"]); 
	ctx.lineTo(physicalSpaceX, this.circleData[0]["centerYval"]);
	ctx.closePath();
	ctx.stroke();

	// Figure out the hask mark data
	var hashMarkData = {};
	hashMarkData["virtualValue"] = new Array();
	hashMarkData["physicalValue"] = new Array();
	var range = this.range["max"] - this.range["min"];
	var physicalMax = this.virtualToPhysical(this.TOTAL_X, this.USABLE_X,
		range, this.range["max"], false);
	var virtualIntervalWidth = range / numHashMarks;
	var i;

	for (i = 0; i < (numHashMarks + 1); i++) {
		hashMarkData["virtualValue"][i] = this.range["min"] + i * virtualIntervalWidth;
		hashMarkData["physicalValue"][i] = this.virtualToPhysical(this.TOTAL_X, this.USABLE_X, range,
			hashMarkData["virtualValue"][i], false);	

		hashMarkData["physicalValue"][i] = this.virtualToPhysicalCorrected(this.USABLE_X, 
			hashMarkData["physicalValue"][i], physicalMax);
	}

	for (i = 0; i < (numHashMarks + 1); i++)
	{
		// X axis hash marks
		var physicalX = hashMarkData["physicalValue"][i];
		var labelX = (hashMarkData["virtualValue"][i]).toFixed(2);
		
		ctx.beginPath();
		ctx.moveTo(physicalX, this.circleData[0]["centerYval"] - 10);
		ctx.lineTo(physicalX, this.circleData[0]["centerYval"] + 10);
		ctx.closePath();
		ctx.stroke();
		ctx.fillText(labelX, physicalX - 12, this.circleData[0]["centerYval"] + 28);
	}	
}

/*
 * Calls all other draw functions and controls drawing the object on the canvas
*/
tTestCanvas.prototype.draw = function() {
	var ctx = this.ctx;
	this.clear();
	
	this.drawCircles();
	this.drawAxis();	
		
	// draw all points
	var l = this.points.length;
	for (var i = 0; i < l; i++) {
		var point = this.points[i];
		// We can skip the drawing of elements that have moved off the screen:
		if (point.x > this.width || point.y > this.height ||
			point.x + point.w < 0 || point.y + point.h < 0) continue;

		if(this.points[i].drawable)
			this.points[i].draw(ctx);
	}
		
	this.displayStatistics();
	this.valid = true;
}

/*
 * Clear's the canvas visually, but doesn't alter underlying data 
*/
tTestCanvas.prototype.clear = function() {
	this.ctx.clearRect(0, 0, this.width, this.height);
}

tTestCanvas.prototype.computeInferentialData = function() {
	if (!this.dragging) {
	var i, j;
	var commandString = "";
	if (this.group.length == 2)
		commandString += "t.test(c(";
	else if (this.group.length > 2)
		commandString += "summary(aov(c(";

	// Build data group
	for (i = 0; i < this.group.length; i++) {
		for (j = 0; j < this.group[i].length; j++) {
			if (!((j == (this.group[i].length - 1)) && (i == (this.group.length - 1))))
				commandString += this.group[i][j] + ", ";
		}	
	}
	commandString += this.group[i - 1][j - 1] + ") ~ c(";
	// Cond stuff
	for (i = 0; i < this.group.length; i++) {
		for (j = 0; j < this.group[i].length; j++)
		{
			if (!((j == (this.group[i].length - 1)) && (i == (this.group.length - 1))))
				commandString += i + ", ";
		}	
	}
		commandString += (i - 1) + "))";
		if (this.group.length > 2)
			commandString += ")";
		queryServer("rTerminalInterface", "pushInput", commandString, "window.s.displayInferentialData", true);
	}
}

tTestCanvas.prototype.displayInferentialData = function(json) {
	var canvasInfoColumn = document.getElementById('canvasInfoColumn');
	var selectionMenu = document.getElementById('options');
	var inferentialBox = document.getElementById('inferential');
	if (canvasInfoColumn.contains(inferentialBox))
		canvasInfoColumn.removeChild(inferentialBox);
	inferentialBox = document.createElement("div");
	inferentialBox.setAttribute("class", "well well-sm");
	inferentialBox.setAttribute("id", "inferential");
	inferentialBox.setAttribute("style", "height:225px; overflow:auto");
	//canvasInfoColumn.innerHTML += "<div class='well well-sm' id='inferential' style='height:225px;overflow:auto'></div>";

	var result;
	var pValue;
	if (this.group.length == 2) {
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
		inferentialBox.innerHTML += "<br /><br />";
		inferentialBox.innerHTML += "<i>t</i> = the difference between the means of "
			+ "two groups divided by a value derived from the combined "
			+ "standard deviations of the two groups.";

	}
	else if (this.group.length > 2) {
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

/*
 * Adds a point to this object's data array
 * @param Point point new point to add
*/
tTestCanvas.prototype.addPoint = function(point) {
	this.points.push(point);
	this.valid = false;
}

/* 
 * Creates an object with x and y defined, set to the mouse position relative 
 *	to the state's canvas
 *	If you wanna be super-correct this can be tricky, we have to worry about 
 *	padding and borders
 *	In english: Makes the mouse acceisible by this object
 * @param MouseEvent e a mouse event
*/
tTestCanvas.prototype.getMouse = function(e) {
	var element = this.canvas, offsetX = 0, offsetY = 0, mx, my;
	  
	// Compute the total offset
	if (element.offsetParent !== undefined) {
		do {
			offsetX += element.offsetLeft;
			offsetY += element.offsetTop;
		} while ((element = element.offsetParent));
	}

	// Add padding and border style widths to offset
	// Also add the <html> offsets in case there's a position:fixed bar
	offsetX += this.stylePaddingLeft + this.styleBorderLeft + this.htmlLeft;
	offsetY += this.stylePaddingTop + this.styleBorderTop + this.htmlTop;

	mx = e.pageX - offsetX;
	my = e.pageY - offsetY;
	  
	//return a simple javascript object (a hash) with x and y defined
	return {x: mx, y: my};
}





