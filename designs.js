var tableCreated = false;
var color = "#000000";
var h = $('#input_height').val();
var w = $('#input_width').val();
makeGrid(h, w);
var bucket = false; // bucket intiated
var eraser = false;
var picker = false; // color picker
var rainbow = false;
var tbl_matrix;
var dirX = [-1, -1, -1, 0, 0, 0, 1, 1, 1];
var dirY = [-1, 0, 1, -1, 0, 1, -1, 0, 1];
var color_arr = ["#f64444", "#f69f44", "#f6ea44", "#53c82b", "#2dccf2", "#2d31f2", "#9445f0"];
var audioPlays = false;
var audio = new Audio('nyan.mp3');     

// Select size input
$('#sub').click(function() {
    h = $('#input_height').val();
    w = $('#input_width').val();
    // When size is submitted by the user, call makeGrid()
    makeGrid(h, w);
});

// Generates the grid dynamically
function makeGrid(h, w) {
    tbl_matrix = [];

    if (tableCreated === true)
        clearTable();

    var table = $('.pixel_canvas');

    for (var i = 0; i < h; i++) {
        var arr = [];
        var row = $('<tr>').attr("class", "table");
        setColor(row, "#ffffff");

        for (var j = 0; j < w; j++) {
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
$('#colorPicker').mouseleave(function() {
    color = $(this).val();
    //console.log("color picked");
});

// Changes color according to what the user selected
$('.pixel_canvas').mousedown(function(e) {
    if (picker) {
        color = toHex($(e.target).css('background-color'));
        picker = false;
        $('.pixel_canvas').css('cursor', 'default');
        $('#colorPicker').val(color);
        $(".picker-tool-change").toggleClass("picker");
        return;
    }
    if (bucket) {
        //console.log("bucket tool initiated");

        var x = e.target.parentNode.rowIndex;
        var y = e.target.cellIndex;
        var currColor = toHex(tbl_matrix[x][y].css('background-color'));

        bucketTool(x, y, currColor, color);
        bucket = false;
        $('.pixel_canvas').css('cursor', 'default');
        $(".bucket-tool-change").toggleClass("bucket-tool");
        return;
    }

    if (eraser) {
        color = "#ffffff";
        //console.log("eraser");
    }

    displayHelperPopUp();
    var cell = $(e.target);

    if(rainbow){
        rainbow = false;
        $(".rainbow-tool-change").toggleClass("rainbow");
        $('.pixel_canvas').css('cursor', 'default');
        $('.cat_gif').css('visibility', 'visible');
        
        playAudio();
 
        var i = 1;
        setColor(cell, "red");
        $(this).mouseover(function(e) {
                var cell = $(e.target);
                setColor(cell, color_arr[(i%7)]);
                i++;
         });
        return;
    }
    
    setColor(cell, color);
    $(this).mouseover(function(e) {
        var cell = $(e.target);
        setColor(cell, color);
    });
});

$('.pixel_canvas').mouseup(function(e) {
    $(this).unbind("mouseover");
    if(audioPlays){        
        stopAudio();
        $('.cat_gif').css('visibility', 'hidden');
    }

    if (eraser) {
        eraser = false;
        color = $('#colorPicker').val();
        $('.pixel_canvas').css('cursor', 'default');
        $(".eraser-tool-change").toggleClass("eraser");
    }
});

function setColor(cell, color) {
    cell.css("background-color", color);
    //console.log("color set to:" + color);
}

// Changes color back to white
$('.pixel_canvas').dblclick(function(event) {
    var cell = $(event.target);
    cell.css("background-color", "white");
});

// Clears the table
function clearTable() {
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
$('.bucket-tool').click(function() {
    $('.pixel_canvas').css('cursor', 'url(cursor.cur) 1 14, auto');
    bucket = true;
    $(".bucket-tool-change").toggleClass("bucket-tool");
});

function bucketTool(x, y, oldc, newc) {
    if (oldc === newc) return;

    setColor(tbl_matrix[x][y], newc);

    for (var i = 0; i < dirX.length; i++) {
        var newX = x + dirX[i];
        //console.log("New x: " + newX);
        for (var j = 0; j < dirY.length; j++) {
            var newY = y + dirY[j];
            //console.log("New y: " + newY);
            if (newX >= 0 && newX < h && newY >= 0 && newY < w) {
                //console.log(tbl_matrix[newX][newY].css('background-color'));
                var otherColor = toHex(tbl_matrix[newX][newY].css('background-color')); // color of the neighbouring cell            

                if (otherColor === newc) continue;

                //console.log(oldc + " " + otherColor);
                if (oldc === otherColor)
                    bucketTool(newX, newY, oldc, newc);
            }
        }
    }
}

// converts to hex

var hexDigits = new Array("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f");

//Function to convert rgb color to hex format
function toHex(rgb) {
    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    if (rgb === null) return "#ffffff";
    return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}

function hex(x) {
    return isNaN(x) ? "00" : hexDigits[(x - x % 16) / 16] + hexDigits[x % 16];
}

// eraser event
$('.eraser').click(function() {
    $('.pixel_canvas').css('cursor', 'url(eraser.cur) 10 5, auto');
    eraser = true;
    //console.log("eraser event");
    $(".eraser-tool-change").toggleClass("eraser");
});

// color picker event
$('.picker').click(function() {
    $('.pixel_canvas').css('cursor', 'url(picker.cur) 2 15, auto');
    picker = true;
    $(".picker-tool-change").toggleClass("picker");
});

// rainbow event
$('.rainbow').click(function() {
    $('.pixel_canvas').css('cursor', 'url(rainbow.cur) 10 5, auto');
    rainbow = true;
    $(".rainbow-tool-change").toggleClass("rainbow");
});

// audio 

function playAudio(){
        //if(audioPlayed) return;
        audio.play();
        audioPlays = true;
}
function stopAudio(){
        audio.pause();
        audioPlays = false;
}
