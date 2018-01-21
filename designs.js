var tableCreated = false;
var color = "black";
var h = $('#input_height').val();
var w = $('#input_width').val();
makeGrid(h, w);

// Select size input
$('#sub').click(function(){
	h = $('#input_height').val();
	w = $('#input_width').val();
	// When size is submitted by the user, call makeGrid()
	makeGrid(h, w);
});

// Generates the grid dynamically
function makeGrid(h, w) {
	if(tableCreated === true)
		clearTable();
	var table = $('.pixel_canvas');
	for(var i = 0; i < h; i ++){
		var row = $('<tr>').attr("class", "table");
     		setColor(row, "white");
		for(var j = 0 ; j < w; j++){	
			var cell = $('<td>').attr("class", "table");
			row.append(cell);
		}
		table.append(row);
	}
	tableCreated = true;
	console.log("table generated successfully");
}

// Select color input
$('#colorPicker').mouseleave(function(){
	color = $(this).val();
	console.log("color picked");
});

// Changes color according to what the user selected
$('.pixel_canvas').mousedown(function(e){
	var cell = $(e.target);
	setColor(cell, color);
				
	$(this).mouseover(function(e){
		var cell = $(e.target);
		setColor(cell, color);
	});
});

$('.pixel_canvas').mouseup(function(e){
	$(this).unbind("mouseover");
});

function setColor(cell, color){
	cell.css("background-color", color);
	console.log("color set to:" + color);
}

// Changes color back to white
$('.pixel_canvas').dblclick(function(event){	
	var cell = $(event.target);
	cell.css("background-color", "white");
});


// Clears the table
function clearTable(){
	$(".table").remove();
}

var firstTime = true;
function pop() {
	console.log(firstTime);
	if(firstTime === true){
    	var pup = document.getElementById("helper_popup");
   		pup.classList.toggle("show");
		firstTime = false;
		$('.pixel_canvas').click(function(){	
			pup.classList.toggle("hide");
		});
	}
}

