/*
 * Contains the SingleDist canvas object, which represents a single distribution
*/

/*
 * Initialize the single distribution canvas object
*/
function init() {
	//var data = Array(0, 0, 1, 1, 2, 2, 2, 3, 3, 3, 5, 5,5,5,5,5,5, 10);
	var data = Array(0, 0, 0.59, 0.59, 1.59, 1.59, 0.77, 2.59, 2.59, 1.77, 4.59, 4.59,4.59,4.59,4.59,4.59,4.59, 10);
	var s = new SingleDist(document.getElementById('graph'), data);	
	//var r = new VarianceCircle(document.getElementById('graph'), data);
	var canvasWorkBench = document.getElementById("canvasWorkBench");
	var exerPanel = document.createElement('div');
	exerPanel.setAttribute('class', 'well well-large');
	exerPanel.setAttribute('id', 'exerPanel');
	canvasWorkBench.appendChild(exerPanel);
	var exerPanel = document.getElementById('exerPanel');
	var exerString = "<b>Single Distribution</b><br />";
	exerString += "<p>You can change the shape of the distribution by click-dragging the "
		+ "mode-circle.</p>";	
	exerString += "<p>The shaded area under the curve of the distribution remains "
		+ "approximately the same no matter where you drag the mode-circle."
	 	+ "</p>";
	exerString += "<p>The program that calculates the measures of central tendency (i.e., mean, "		+ "median, and mode) and dispersion (i.e., variance and standard "
		+ "deviation) rounds, so all posted values are approximate.</p><br />";

	exerString += "The <span style='color:rgb(255, 0, 0)'>Mean</span> is represented by the "
		+ "red line.<br />";
	exerString += "The <span style='color:rgb(0, 255, 0)'>Median</span> is represented by "
		+ "the green line.<br />";
	exerString += "The <b>Mode</b> is represented by the open circle.<br /><br />";

	exerString += "Standard Deviation = <math><msqrt><mi>variance</mi></msqrt></math><br /><br />";

	exerString += "<p>When skewed, the skew of the distribution is in the direction of its "
		+ "longer tail.</p>"; 

	exerString += "<p>When the single distribution is first loaded, it is negatively skewed. "
		+ "A negatively skewed distribution has a longer tail on its left side "
		+ "(a.k.a, left skewed), which is the side associated with lower "
		+ "numbers; positively skewed distributions therefore have longer "
		+ "right-side tails (a.k.a., right-skewed).</p>";

	exerString += "<b>Try These Exercises:</b><br /><br />";
	exerString += "<ol>";
	exerString += "<li>When the distribution is negatively skewed, note the relative sizes "
		+ "of the three measures of central tendency&mdash;mean, median, and "
		+ "mode. How do they change when the distribution is positively "
		+ "skewed? Keeping the mode-circle's height the same, where are the locations of the measures of central "
		+ "tendency relative to one another when the distribution is skewed "
		+ "to the left or to the right?</li>";  

	exerString += "<li>Variance = (Standard Deviation)<sup>2</sup> . "
		+ "(Note: Due to rounding, you may not get the values exactly as "
		+ "prescribed.) Click-drag the mode-circle until variance is "
		+ "approximately 4.0 and the standard deviation is approximately 2.0." 
		+ " Compare the shape of the distribution when standard deviation "
		+ "is approximately 2.0 and when standard deviation is "
		+ "approximately 3.0?</li>";

	exerString += "<li>The shape of the distribution is approximately <i>normal</i> when the "
		+ "measures of central tendency are all equal, and the mode-circle "
		+ "is near the top of the lines for the median and mode. The "
		+ "X-axis labels are at approximately one standard deviation "
		+ "intervals when the distribution is about normal. What percentage of the "
		+ "distribution appears to extend beyond the mean &plusmn;2 standard "
		+ "deviations?</li>";

	exerString += "<li>Keeping the distribution symmetric, with the measures of central "
		+ "tendency being equal, manipulate the kurtosis by dragging the "
		+ "mode-circle up and down in the Y-axis direction, moving it along "
		+ "the mean/median lines. Do the measures of dispersion—i.e., "
		+ "variance and standard deviation&mdash;get bigger or smaller as "
		+ "the distribution moves from tall and skinny (leptokurtic) to short "
		+ "and wide (platykurtic)? If you could keep dragging upward while "
		+ "maintaining the same values for the measures of central tendency "
		+ "until all of the values in the distribution were the same "
		+ "(i.e., 2.0), what would be the values for variance and "
		+ "standard deviation?</li></ol>";

	exerPanel.innerHTML = exerString;
}

/*
 * Checks whether a given mouse posistion is within the canvas' bounding box
 * @param int mx the mouse's x-coord
 * @param int my the mouse's y-coord 
 * @return boolean whether the mouse is within the bounding box
 */ 
SingleDist.prototype.inBounds = function(mx, my) {
	return (mx >= this.MOUSE_MIN_X && mx <= this.MOUSE_MAX_X
		&& my <= this.MOUSE_MIN_Y && my >= this.MOUSE_MAX_Y);
}

/*
 * Constructor for the single distribution canvas object
 * @param CanvasContext the canvas context to attach this object to
 * @param data this object's initial data
 */
function SingleDist(canvas, data) {
	// Set up some key data
    this.canvas = canvas;
    this.width = canvas.width;
    this.height = canvas.height;
    this.ctx = canvas.getContext('2d');
    this.data = data;
    this.data_length = data.length; 

	// Set up mouse data
	this.MOUSE_MIN_X = 120;
	this.MOUSE_MAX_X = this.width - 150;
	this.MOUSE_MIN_Y = this.height - ((this.height/6) * 2) - 75;
	this.MOUSE_MAX_Y = 175;
 
	// Padding data
    this.TOTAL_X = this.width;
    this.TOTAL_Y = this.height;
    this.TOTAL_PADDING = 100;
    this.USABLE_X = this.TOTAL_X - this.TOTAL_PADDING;
    this.USABLE_Y = this.TOTAL_Y - this.TOTAL_PADDING;  
    this.NUM_HASH_MARKS = 6;
	this.minValue = 0;
	this.maxValue = 0;

    this.points = new Array();
    this.axesData = null;
	this.modePointers = this.generateModePointers(data);
    this.mean = computeMean(data);
    this.median = computeMedian(data);
    this.mode = computeMode(data);
	this.freqMode = this.computeModeFrequency(this.mode, this.data);
    this.variance = computeVariance(data);
    this.standardDeviation = computeStandardDeviation(data);
	this.colors = {"mean":"rgb(255, 0 , 0)", "median":"rgb(0, 255, 0)"};

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

    // Initialize State
    this.valid = false; // when set to false, the canvas will redraw everything
    this.dragging = false; // Keep track of when we are dragging
    // the current selected object. In the future we could turn this into an array for multiple selection
    this.selection = null;
    this.dragoffx = 0; // See mousedown and mousemove events for explanation
    this.dragoffy = 0;

	// Compute initial data
    this.computeAxesData(data); // Compute data for the axes
    var range = this.computeRange(data); // Compute the virtual range 
    this.createModePoint(range); // Determine the mode point
    this.addAnchorPoints(); // Add anchor points at distribution's tails
    this.points.sort(function (a, b) { return a.x - b.x; }); // Sort data points

    // Add event listeners
    // Right here "this" means the SingleDist. But we are making events on the Canvas itself,
    // and when the events are fired on the canvas the variable "this" is going to mean the canvas!
    // Since we still want to use this particular SingleDist in the events we have to save a reference to it.
    // This is our reference!
    var myState = this;
  
    // Fixes a problem where double clicking causes text to get selected on the canvas
    canvas.addEventListener('selectstart', function(e) { e.preventDefault(); return false; }, false);
    
	// Up, down, and move are for dragging
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
				return;
			}
		}
	
		// If we haven't returned, we have failed to select anything.
		// If there was an object selected, we deselect it
		if (myState.selection) {
			myState.selection = null;
			if (myState.inBounds(mouse.x, mouse.y))
				myState.valid = false; // Need to clear the old selection border
		}
	}, true);
	
	
	canvas.addEventListener('mousemove', function(e) {
		if (myState.dragging){
			var mouse = myState.getMouse(e);
			// We don't want to drag the object by its top-left corner, we want to drag it
			// from where we clicked. Thats why we saved the offset and use it here
			myState.selection.x = mouse.x - myState.dragoffx;
			myState.selection.y = mouse.y - myState.dragoffy;   
			if (myState.inBounds(mouse.x, mouse.y))
				myState.valid = false; // Something's dragging so we must redraw
			else
			{
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
			} 
		}
	}, true);
	
	
	canvas.addEventListener('mouseup', function(e) {
		myState.dragging = false;
		myState.valid = false; // Has to be here or things that should only
							  // be dran when not dragging, won't draw
	}, true);

	// Graph Loop options
	this.interval = 30; // Refresh canvas 30 times a second
	setInterval(function() { myState.graphLoop(); }, myState.interval);
	
	// Add about div
	this.createAboutDiv();
	this.removeInferentialDiv();
}

SingleDist.prototype.removeInferentialDiv = function() {
	var canvasInfoColumn = document.getElementById('canvasInfoColumn');
	var inferentialBox = document.getElementById('inferential');
	if (canvasInfoColumn.contains(inferentialBox))
		canvasInfoColumn.removeChild(inferentialBox);
}

SingleDist.prototype.createAboutDiv = function() {
	var canvasInfoColumn = document.getElementById('canvasInfoColumn');
	var aboutDiv = document.getElementById('about');
	if (canvasInfoColumn.contains(aboutDiv))
		canvasInfoColumn.removeChild(aboutDiv);

	aboutDiv = document.createElement("div");
	var dataDiv = document.getElementById('data');
	aboutDiv.setAttribute("id", "about");
	aboutDiv.setAttribute("class", "well well-sm");
	aboutDiv.setAttribute("style", "height:140px; overflow:auto");
	aboutDiv.innerHTML = "<p>This graph represents a single distribution. "
		+ "Initially the distribution is slightly skewed. The center toggle-point "
		+ "represents the mode. The two lines represent the mmean (red) and median (green).";
	canvasInfoColumn.insertBefore(aboutDiv, dataDiv.nextSibling);
}

/* 
 * Create the mode point which will be used to toggle the shape of the
 *	distribution
 * @param Object range the virtual range for this distribution
*/
SingleDist.prototype.createModePoint = function(range) {
	var max = range["max"];
	var min = range["min"];
	this.frequency = this.computeModeFrequency(this.mode, this.data);

	var yVal = this.virtualToPhysical(this.TOTAL_Y, this.USABLE_Y, 
		this.frequency * 2, this.frequency, true);
	var xVal = this.virtualToPhysical(this.TOTAL_X, this.USABLE_X, max - min,
		this.mode, false);
  
	var physicalMax = this.virtualToPhysical(this.TOTAL_X, this.USABLE_X,
		max - min, max, false);
	
	xVal = this.virtualToPhysicalCorrected(this.USABLE_X, xVal, physicalMax);

	this.addPoint(new Point(xVal, yVal, true)); 
}

/*
 * Compute data about this distribution
 */
SingleDist.prototype.computeData = function(){
	var mode = this.physicalToVirtual(this.TOTAL_X, this.USABLE_X, 
									  this.maxValue - this.minValue, 
									  this.minValue, this.points[1].x, false);

	var frequency = this.physicalToVirtual(this.TOTAL_Y, this. USABLE_Y, 
										   this.freqMode * 2, 0, 
										   this.points[1].y, true);
    
	this.modifyMode(frequency, mode);

	// Using slice to make copies of data instead of passing by reference.
	this.mean = computeMean(this.data.slice(0));
	this.median = computeMedian(this.data.slice(0));
	this.mode = mode;
	this.variance = computeVariance(this.data.slice(0));
	this.standardDeviation = computeStandardDeviation(this.data.slice(0));
}

/*
 * Modifies the mode frequency and the mode values.  
 *	This is where the y-axis additions are added and removed from the data as a
 *	consequency of user interaction.
 * @param int frequency new mode frequency
 * @param int mode new mode value
*/
SingleDist.prototype.modifyMode = function(frequency, mode) {
	if (frequency > this.freqMode)
    {
		var add = (frequency - this.freqMode) - (this.data.length - this.data_length);

		// Add points
		if (add > 0)
			for(var i = 0; i < add; i++)
				this.data.push(mode);
		
		//Remove points
		else if (add < 0)
		{
			//Gives us the number that needs to be popped from the data array
			add = Math.abs(add);
			if(this.data.length - add >= this.data_length)
				for(var i = 0; i < add; i++)
					this.data.pop();

		}
	}
	
	// Update the mode values for the mode pointers
	for (var i = 0; i < this.modePointers.length; i++)
	{
		var index = this.modePointers[i];
		this.data[index] = mode;
	}

	// Updatet the mode values for the values that are added by pulling 
	// the graph upwards.
	for(var i = this.data_length; i < this.data.length; i++)
		this.data[i] = mode;
}

/*
 * Computes x and y axis data 
 * @param float[] data data array for this distribution
*/
SingleDist.prototype.computeAxesData = function(data) {
	this.axesData = this.computeAxes(data, this.NUM_HASH_MARKS, this.TOTAL_Y, 
		this.USABLE_Y, this.TOTAL_X, this.USABLE_X);
}

/*
 * Graph loop for this canvas object. Is ran 30 times per second. Calls
 *	computeData and draw
*/
SingleDist.prototype.graphLoop = function(){ 
	this.computeData();
	this.draw();
}

/*
 * Adds a point to this object's data array
 * @param Point point new point to add
*/
SingleDist.prototype.addPoint = function(point) {
	this.points.push(point);
	this.valid = false;
}

/*
 * Clear's the canvas visually, but doesn't alter underlying data 
*/
SingleDist.prototype.clear = function() {
	this.ctx.clearRect(0, 0, this.width, this.height);
}

/* Redraws the object on the canvas.
*	While draw is called as often as graphLoop is executed, it only ever does 
*	something if the canvas gets invalidated by user interaction
*/
SingleDist.prototype.draw = function() {
	// if our state is invalid, redraw and validate!
	if (!this.valid) {
		var ctx = this.ctx;
		var data = this.data;
		this.clear();
			
		this.drawAxes(ctx, this.axesData);
		this.drawCurve(ctx);
		
		// Draw all points
		var l = this.points.length;
		for (var i = 0; i < l; i++) {
			var point = this.points[i];
			// We can skip the drawing of elements that have moved off the screen:
			if (point.x > this.width || point.y > this.height ||
			point.x + point.w < 0 || point.y + point.h < 0) continue;

			if(this.points[i].drawable)
				this.points[i].draw(ctx);
		}
			
		this.drawCentralTendencyLines(ctx);		
		
		// Display correct descriptive stats for this object
		this.displayStatistics();
		
		// Revalidate	
		this.valid = true;
	}
}


/* 
 * Creates an object with x and y defined, set to the mouse position relative 
 *	to the state's canvas
 *	If you wanna be super-correct this can be tricky, we have to worry about 
 *	padding and borders
 *	In english: Makes the mouse acceisible by this object
 * @param MouseEvent e a mouse event
*/
SingleDist.prototype.getMouse = function(e) {
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

/*
 * Display descriptive statistics for this object's data array
*/
SingleDist.prototype.displayStatistics = function() {
	var PRECISION = 3;
	
	var dataString = "<span style='color: " + this.colors['mean'] + "'><b>Mean:</b> </span>" + this.mean.toPrecision(PRECISION) + '<br />';
	dataString += '<span style="color: ' + this.colors['median'] + '"><b>Median:</b> </span>' + this.median.toPrecision(PRECISION) + '<br />';
	dataString += '<b>Mode:</b> ' + this.mode.toPrecision(PRECISION) + '<br />';
	dataString += '<b>Variance:</b> ' + this.variance.toPrecision(PRECISION) + '<br />';
	dataString += '<b>Standard Deviation:</b> ' + 
					this.standardDeviation.toPrecision(PRECISION) + '<br />'; 
	
	document.getElementById('data').innerHTML = dataString;
}

/*
 * Compute the frequency with which the mode occurs, determines height of the
 *	the mode point
 * @param float mode the mode for this object's data array
 * @param float[] data object's data array
 * @return int the mode's frequency
*/
SingleDist.prototype.computeModeFrequency = function(mode, data) {
	var modeCount = 0;	

	for (var i = 0; i < data.length;  i++)
		if (data[i] === mode)
			modeCount++;
	
	return modeCount;
}

/*
 * Add invisible anchor points at each tail of the distribution
*/
SingleDist.prototype.addAnchorPoints = function() {
	var padding = this.TOTAL_PADDING / 2;
	this.addPoint(new Point(padding, this.TOTAL_Y - padding, false));
	this.addPoint(new Point(this.TOTAL_X - padding, this.TOTAL_Y - padding, false));
}

/*
 * Compute the data underlying the canvas axes
 * @param float[] data this object's data array
 * @param int numHashMarks the number of hash marks for each axis
 * @param int physicalSpaceY the height of the canvas in pixels
 * @param int usableSpaceY the height of the canvas in pixels minux vertical 
 *	padding
 * @param int physicalSpaceX the width of the canvas in pixels
 * @param int usableSpaceX the width of the canvas in pixels minux horizontal 
 *	padding
 * @return Object An object containing information about each hashMark and 
 *	containing the supplied parameters except for data
*/
SingleDist.prototype.computeAxes = function(data, numHashMarks, physicalSpaceY, usableSpaceY,
	physicalSpaceX, usableSpaceX) {
	var mode = computeMode(data);
	var freqMode = this.freqMode;
	var paddingY = (physicalSpaceY - usableSpaceY) / 2;
	var paddingX = (physicalSpaceX - usableSpaceX) / 2;

	var hashDataY = this.computeHashMarksY(numHashMarks, freqMode, usableSpaceY,
		paddingY); 
	
	this.range = this.computeRange(data);	
	this.minValue = this.range["min"];
	this.maxValue = this.range["max"];
	var hashDataX = this.computeHashMarksX(numHashMarks, this.minValue, this.maxValue, 
		usableSpaceX, paddingX);

	return {"hashDataY": hashDataY, "hashDataX": hashDataX, 
			"physicalSpaceY": physicalSpaceY, "usableSpaceY": usableSpaceY,
			"physicalSpaceX": physicalSpaceX, "usableSpaceX": usableSpaceX,
			"paddingX": paddingX, "paddingY": paddingY, 
			"numHashMarks": numHashMarks};
}

/*
 * Uses the data from computeAxes to draw the axes onto the canvas
 * @param CanvasContext ctx the canvas context to draw upon
 * @param Object hashData the data returned by computeAxes
*/
SingleDist.prototype.drawAxes = function(ctx, hashData) {
	var hashDataY = hashData["hashDataY"];
	var hashDataX = hashData["hashDataX"];
	var paddingY = hashData["paddingY"];
	var paddingX = hashData["paddingX"];
	var physicalSpaceY = hashData["physicalSpaceY"];
	var physicalSpaceX = hashData["physicalSpaceX"];
	var numHashMarks = hashData["numHashMarks"];
	
	ctx.lineWidth = 1;
	ctx.fillStyle = "#000000";
	ctx.font = "bold 14px Arial";

	// Y axis
	ctx.beginPath();
	ctx.moveTo(paddingX, paddingY);
	ctx.lineTo(paddingX, physicalSpaceY - paddingY);
	ctx.closePath();
	ctx.stroke();

	// X axis
	ctx.beginPath();
	ctx.moveTo(paddingX, physicalSpaceY - paddingY); 
	ctx.lineTo(physicalSpaceX - paddingX, physicalSpaceY - paddingY);
	ctx.closePath();
	ctx.stroke();

	var i;
	for (i = 0; i < numHashMarks; i++)
	{
		// Y axis hash marks
		var physicalY = hashDataY["hashMark"][i];
		var labelY = (hashDataY["hashMarkValue"][i]).toFixed(2);
		ctx.beginPath();
		ctx.moveTo(paddingX - (paddingX / 6), physicalY);
		ctx.lineTo((paddingX + (paddingX / 6)), physicalY);
		ctx.closePath();
		ctx.stroke();
		
		ctx.fillText(labelY, 2, physicalY + 7, paddingX - 2);

		// X axis hash marks
		var physicalX = hashDataX["hashMark"][i];
		var labelX = (hashDataX["hashMarkValue"][i]).toFixed(2);
		
		if (i > 0)
		{
			ctx.beginPath();
			ctx.moveTo(physicalX, physicalSpaceY - paddingY + 10);
			ctx.lineTo(physicalX, physicalSpaceY - paddingY - 10);
			ctx.closePath();
			ctx.stroke();
		}		

		ctx.fillText(labelX, physicalX - 12, physicalSpaceY - 28);
	}

	// The last X hash mark
	var physicalX = hashDataX["hashMark"][i];
	var labelX = (hashDataX["hashMarkValue"][i]).toFixed(2);
	ctx.beginPath();
	ctx.moveTo(physicalX, physicalSpaceY - paddingY + 10);
	ctx.lineTo(physicalX, physicalSpaceY - paddingY - 10);
	ctx.closePath();
	ctx.stroke();
	ctx.fillText(labelX, physicalX - 12, physicalSpaceY - 28);	
}


/* 
 * Draw lines representing the mean and the median
 * @param CanvasContext ctx the canvas to draw the lines on
*/
SingleDist.prototype.drawCentralTendencyLines = function(ctx) {
	if (!this.dragging) {
		var lines = ["median", "mean"];
		for (var i = 0; i < lines.length; i++)
			this.drawLine(ctx, lines[i]);
	}
}

/* 
 * Draw a line representing either the mean or the median
 * @param CanvasContext ctx the canvas to draw the line on
 * @param String measure the measure (mean or median) to try
*/
SingleDist.prototype.drawLine = function(ctx, measure) {
	var value = eval("this." + measure);
	var min = this.range["min"];
	var max = this.range["max"];
	var physicalPoint = this.virtualToPhysical(this.TOTAL_X, this.USABLE_X, max - min, value, false);
	var physicalMax = this.virtualToPhysical(this.TOTAL_X, this.USABLE_X,
		max - min, max, false);
	physicalPoint = this.virtualToPhysicalCorrected(this.USABLE_X, physicalPoint, physicalMax);
	var frequencyPoint = this.USABLE_Y * 0.33; // How high to draw the line, this needs to hit curve but I don't understand drawCurve enough to do that
	var paddingY = (this.TOTAL_Y - this.USABLE_Y) / 2;

	ctx.strokeStyle = this.colors[measure];
	ctx.beginPath();
	ctx.moveTo(physicalPoint, this.TOTAL_Y - paddingY);
	ctx.lineTo(physicalPoint, frequencyPoint);
	ctx.stroke();
}


/*
 * Draw the curve created by the data array represented as a distribution
 * @param CanvasContext ctx the canvas upon which to draw the curve
*/
SingleDist.prototype.drawCurve = function(ctx) {
	// Mode point and tail-end anchor points
	var point1 = this.points[0]; 
	var point2 = this.points[1]; 
	var point3 = this.points[2]; 

	ctx.strokeStyle = "rgb(5,57,89)";
	ctx.fillStyle = "rgba(5, 57, 89, 0.4)";
	
	var midPointX = this.width / 2;
	var midPointY = this.height / 2;
	
	var distanceRange;
	var kertosisSkewLeft;
	var kertosisSkewRight;

	distanceRange = Math.abs(point2.x - point1.x);
	controlPoint = distanceRange / 2;
	
	var distanceBetweenPoints = Math.abs(midPointX - point2.x);
	
	
	// Note: ~ is the NOT bitwise operator	
	if (point2.y < midPointY  && distanceBetweenPoints > 50  && point2.x < midPointX) {
		kertosisSkewLeft = 0;
		kertosisSkewRight= (midPointY - point2.y) /  (~~(distanceBetweenPoints  / 50) * 2);
	}
	else if(point2.y < midPointY  && distanceBetweenPoints > 50  && point2.x > midPointX){
		kertosisSkewLeft = (midPointY - point2.y) /  (~~(distanceBetweenPoints  / 50) * 2);
		kertosisSkewRight = 0;
	}
	else {
		kertosisSkewLeft = midPointY - point2.y;
		kertosisSkewRight = midPointY - point2.y;
	}
	
	
	// Gives bumb at the top of the curve on left side.  Find better way...
	if ( controlPoint < 50)
		controlPoint = 50;
		
	ctx.beginPath();
	ctx.moveTo(point1.x, point1.y);
	ctx.bezierCurveTo((point2.x - controlPoint) + kertosisSkewLeft, point1.y, point2.x - controlPoint, point2.y + (kertosisSkewLeft / 4) , point2.x, point2.y);

	
	distanceRange = point3.x - point2.x;
	controlPoint = distanceRange / 2;
	
	// Gives bumb at the top of the curve on right side.  Find better way...
	if ( controlPoint < 50)
		controlPoint = 50;

	ctx.bezierCurveTo(point3.x - (distanceRange - controlPoint), point2.y + (kertosisSkewRight / 4), (point3.x - (distanceRange - controlPoint)) - kertosisSkewRight, point3.y, point3.x, point3.y);
	ctx.lineTo(point1.x, point1.y);
	ctx.closePath();
	
	
	//console.log('Kertosis Skew: ' + kertosisSkew);
	
	ctx.lineWidth = 3;
	ctx.fill();
	ctx.stroke();
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
SingleDist.prototype.virtualToPhysical = function(totalSpace, 
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
SingleDist.prototype.virtualToPhysicalCorrected = function(usableSpace, 
	physicalPoint, lastPhysicalPoint) {
	var correction = usableSpace - lastPhysicalPoint;
	var result = physicalPoint + correction + (this.TOTAL_PADDING / 2);
	return result;
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
 *	therefore the direction in question, is vertical
 * @return the virtual value corresponding to the supplied physical point
*/
SingleDist.prototype.physicalToVirtual = function(totalSpace, usablePhysicalSpace, virtualSpace, minValue, physicalPoint, isVerticalPoint) {
	var conversionFactor = usablePhysicalSpace / virtualSpace;
	
	if (isVerticalPoint){
		physicalPoint = totalSpace - physicalPoint;
		physicalPoint = physicalPoint - (this.TOTAL_PADDING / 2);
	}
	else
		physicalPoint = physicalPoint - (this.TOTAL_PADDING / 2);
		
	var virtualPoint = physicalPoint / conversionFactor;
	
	return virtualPoint - Math.abs(minValue);
}

/*
 * Compute the hash marks for the Y-axis
 * @param int numHashMarks the number of hash marks for both axes
 * @param int freqMode the frequency with which the mode appears in the 
 *	underlying data array
 * @param int usableSpace height of the canvas in pixels minus padding
 * @param int padding padding for the canvas in pixels
 * @return Object object containing the hashmark's physical and virtual values
*/
SingleDist.prototype.computeHashMarksY = function(numHashMarks, freqMode, usableSpace, padding) {
	var hashMark = new Array();
	var hashMarkValue = new Array();
	var intervalWidth = usableSpace / numHashMarks;

	for (var i = 0; i < numHashMarks; i++)
		hashMarkValue[i] = (i + 1) * ((freqMode * 2) / numHashMarks);

	for (var i = 0; i < numHashMarks; i++)
		hashMark[i] = this.virtualToPhysical(this.TOTAL_Y, this.USABLE_Y,
			freqMode * 2, hashMarkValue[i], true);

	return {"hashMark": hashMark, "hashMarkValue": hashMarkValue};
}

/*
 * Compute the hash marks for the X-axis
 * @param int numHashMarks the number of hash marks for both axes
 * @param float minValue the minimum possible virtual value 
 * @param float maxValue the maximum possible virtual value 
 * @param int usableSpace width of the canvas in pixels minus padding
 * @param int padding padding for the canvas in pixels
 * @return Object object containing the hashmark's physical and virtual values
*/
SingleDist.prototype.computeHashMarksX = function(numHashMarks, minValue, maxValue, usableSpace, padding)
{
	var hashMark = new Array();
	var hashMarkValue = new Array();
	var range = maxValue - minValue;
	var virtualIntervalWidth = range / numHashMarks;

	for (var i = 0; i < (numHashMarks + 1); i++) {
		hashMarkValue[i] = minValue + i * virtualIntervalWidth;

		hashMark[i] = this.virtualToPhysical(this.TOTAL_X, this.USABLE_X, range, 
			hashMarkValue[i], false);
	}

	var length = hashMark.length - 1;
	for (var i = 0; i < (numHashMarks + 1); i++)
		hashMark[i] = this.virtualToPhysicalCorrected(this.USABLE_X, hashMark[i],
			hashMark[length]);

	return {"hashMark": hashMark, "hashMarkValue": hashMarkValue};
}

/* 
 * Determine the indices of the data array that represent values equal to
 *	the mode
 * @param float[] data underlying data array
 * @return int[] array containing the indices of all values in data equal to the
 *	mode
*/
SingleDist.prototype.generateModePointers = function (data) {
	var mode = computeMode(data);
	var modePointers = new Array();

	for (var i = 0; i < data.length; i++)
		if (data[i] === mode)
			modePointers.push(i);

	return modePointers;
}

/* 
 * Find the mode point at which this distribution would be normal, in
 *	other words, find a value x, such that if x was this distribution's mode,
 *	then this distribution would be normally distributed. Used to center the
 *	mode point.
 * @param float[] data underlying data array
 * @param float minimum possible virtual value
 * @param float maximum possible virtual value
 * @param int[] modePointers array of mode pointers
 * @return float mode value that would make distribution normal
*/
SingleDist.prototype.findNormal = function(data, min, max, modePointers) {
	var normalVal = null;
	var normal = false;
	var dataCopy = null;
	var range = max - min;
	var tolerance = 0.5;	

	for (var i = min; i < range + min && !normal; i++)
		for (var j = 0; j < data.length && !normal; j++)
		{
			dataCopy = this.swapMode(data, i, modePointers);
			meanCopy = computeMean(dataCopy);
			medianCopy = computeMedian(dataCopy);
			
			if (this.equalWithinTolerance(new Array(meanCopy, medianCopy, i),
				tolerance))
			{
				normalVal = i;
				normal = true;
			}
		}

	if (!normal)
	{
		var extension = Math.floor(range / 2);
		this.findNormal(data, min - extension, max + extension, modePointers);
	}

	return normalVal;
}

/*
 * Change the mode without changing the mode frequency, this is like a 
 *	right-left drag
 * @param float[] data underlying data array
 * @param float newMode the new mode value
 * @param int[] modePointers the current mode pointers
 * @return float[] the modified data array
*/
SingleDist.prototype.swapMode = function(data, newMode, modePointers) {
	var dataCopy = data.slice(0);

	for (var i = 0; i < modePointers.length; i++)
		dataCopy[modePointers[i]] = newMode;

	return dataCopy;
}

/*
 * Evaluate if n-values are equal within tolerance
 * @param float[] values n-values to compare
 * @param float tolerance the tolerance threshhold
 @ @return boolean whether the n-values are equal within tolerance
*/	
SingleDist.prototype.equalWithinTolerance = function(values, tolerance) {
	var equal = true;	

	for (var i = 0; (i < (values.length - 1)) && equal; i++)
		for (var j = (i + 1); j < values.length && equal; j++)
			if (Math.abs(values[i] - values[j]) >= tolerance)
				equal = false;

	return equal;
}

/*
 * Compute the range of possible virtual values
 * @param float[] data underlying data array
 * @return Object minimum and maximum possible virtual values
*/
SingleDist.prototype.computeRange = function(data) {
	var result = null;
	var lowerbound = null;
	var upperbound = null;
	var mode = computeMode(data);
	var mean = computeMean(data);
	var median = computeMedian(data);
	var modePointers = this.modePointers;
	var min = Math.min.apply(Math, data);
	var max = Math.max.apply(Math, data);
	var normalMode = this.findNormal(this.data, min, max, modePointers);

	// Postiviely skewed
	if (mode < mean || mode < median)
	{
		if (mode > 0 && mode < normalMode)
			result = {"min": 0, "max":normalMode * 2};
		else
		{
			var bothModesEncapsulated = false;
			var i;
			
			for (i = 2; !bothModesEncapsulated; i++)
			{
				lowerbound = normalMode - (normalMode * i);
				if (mode > lowerbound)
					bothModesEncapsulated = true;
			}

			i++; // Extra padding
			lowerbound = normalMode - (normalMode * i);
			result = {"min": lowerbound, "max": normalMode + normalMode * i};
		}
	}

	// Negatively Skewed
	else if (mode > mean || mode > median)
	{
		if (mode > normalMode && mode < (normalMode * 2))
			result = {"min": 0, "max": normalMode * 2};
		
		else
		{
			var bothModesEncapsulated = false;
			var i;
			
			for (i = 2; !bothModesEncapsulated; i++)
			{
				upperbound = normalMode + (normalMode * i);
				if (mode < upperbound)
					bothModesEncapsulated = true;
			}

			i++; // Extra padding
			upperbound = normalMode + (normalMode * i);
			result = {"min": normalMode - normalMode * i, "max": upperbound};
		}
	}

	// Normal
	else
		result = {"min": normalMode - normalMode, "max": normalMode * 2};

	return result;
}
