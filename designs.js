var tableCreated = false;
var color = "#000000";
var h = $('#input_height').val();
var w = $('#input_width').val();
makeGrid(h, w);
var bucket = false; // bucket intiated
var tbl_matrix;
var dirX = [-1, -1, -1, 0, 0, 0, 1, 1, 1];
var dirY = [-1, 0, 1, -1, 0, 1, -1, 0, 1];

// Select size input
$('#sub').click(function(){
	h = $('#input_height').val();
	w = $('#input_width').val();
	// When size is submitted by the user, call makeGrid()
	makeGrid(h, w);
});

// Generates the grid dynamically
function makeGrid(h, w) {
    tbl_matrix = [];
    
	if(tableCreated === true)
		clearTable();

	var table = $('.pixel_canvas');

	for(var i = 0; i < h; i ++){
        var arr = [];
		var row = $('<tr>').attr("class", "table");
     	setColor(row, "#ffffff");

		for(var j = 0 ; j < w; j++){	
			var cell = $('<td>').attr("class", "table");
			row.append(cell);
			arr.push(cell);
		}
		table.append(row);
		tbl_matrix.push(arr);
	}
	tableCreated = true;
	//console.log("table generated successfully");
}

// Select color input
$('#colorPicker').mouseleave(function(){
	color = $(this).val();
	//console.log("color picked");
});

// Changes color according to what the user selected
$('.pixel_canvas').mousedown(function(e){
	if(bucket){
		//console.log("bucket tool initiated");

        var x = e.target.parentNode.rowIndex;
	    var y = e.target.cellIndex;
        var currColor = toHex(tbl_matrix[x][y].css('background-color'));

		bucketTool(x, y, currColor, color);
		bucket = false;
		$('.pixel_canvas').css('cursor', 'default');
        return;
	}
	
	displayHelperPopUp();

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
	//console.log("color set to:" + color);
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

// Displays helper popUp
function displayHelperPopUp() {
   	$(".popup").show(); 
/*  setTimeout(function() {
      	$(".popup").hide();
   	}, 3000);
*/
}

// bucket function
$('.bucket-tool').click(function(){
	$('.pixel_canvas').css('cursor', 'url(cursor.cur) 1 14, auto');
	bucket = true;
});

function bucketTool(x, y, oldc, newc){
        if(oldc === newc) return;
        
        setColor(tbl_matrix[x][y], newc);
        
        for(var i = 0; i < dirX.length; i++){
            var newX = x + dirX[i];
            //console.log("New x: " + newX);
            for(var j = 0; j < dirY.length; j++){
                var newY = y + dirY[j];
                //console.log("New y: " + newY);
                if(newX >= 0 && newX < h && newY >= 0 && newY < w){
                    //console.log(tbl_matrix[newX][newY].css('background-color'));
                    var otherColor = toHex(tbl_matrix[newX][newY].css('background-color')); // color of the neighbouring cell            
                        
                    if(otherColor === newc) continue;

                    //console.log(oldc + " " + otherColor);
                    if(oldc === otherColor)
                        bucketTool(newX, newY, oldc, newc);
                }
            }
        }
}

// converts to hex

var hexDigits = new Array
        ("0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"); 

//Function to convert rgb color to hex format
function toHex(rgb) {
 rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
 if(rgb === null) return "#ffffff";
 return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}

function hex(x) {
  return isNaN(x) ? "00" : hexDigits[(x - x % 16) / 16] + hexDigits[x % 16];
}
