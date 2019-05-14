var game;
var ctx;
var canvas;
var canvasColor = "#fff2e6";
var grid = [];

var boxSize = 35;

var speedLimit = 15; //less means fast more means slow
var speed = 0;

var score = 0;
var scorePerLine = 50;

currentShape = [ [5,-4], [5, -3], [5,-2], [5,-1] ];
nextShape = [ [4,-1], [5, -2], [5,-1], [6,-1] ];
shapeDuo = [currentShape, nextShape ];
shapeDuoString = ["line", "podium"];

var shapeMode = 0;

//SELECT A RANDOM BRICK
function randomShape(){
    var line = [ [5,-4], [5, -3], [5,-2], [5,-1] ];
    var box = [ [4,-2], [4, -1], [5,-2], [5,-1] ];
    var podium = [ [4,-1], [5, -2], [5,-1], [6,-1] ];
    var leftStep = [ [4,-1], [5, -2], [5,-1], [6,-2] ];
    var rightStep = [ [4,-2], [5, -2], [5,-1], [6,-1] ];
    var leftFallenMan = [ [4,-2], [4, -1], [5,-1], [6,-1] ];
    var rightFallenMan = [ [4,-1], [5, -1], [6,-2], [6,-1] ];

    var shapes = [line, box, podium, leftStep, rightStep, leftFallenMan, rightFallenMan  ];
    var strings = ["line", "box", "podium", "leftStep", "rightStep", "leftFallenMan", "rightFallenMan" ];
    var random = Math.floor(Math.random() * shapes.length);

    shapeDuo[0] = shapeDuo[1];
    shapeDuo[1] = shapes[random];
    shapeDuoString[0] = shapeDuoString[1];
    shapeDuoString[1] = strings[random];
    shapeMode = 0;

    currentShape = shapeDuo[0];
    nextShape = shapeDuo[1];
    nextBrick();


}

//PAINT TETRIS AND NEXT BRICK
function redraw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = canvasColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    //check if the shape is down or not and make it go down once if it hasnt
    check = checkIfAvailable("down");
    if(speed >= speedLimit && check){
        updateCurrentShapePosition("down");
        speed = 0;
    }else{
        speed++;
    }

    //paint the grid
    for(i = 0; i < grid.length; i++){
        for(j = 0; j < 15; j++){
            if(grid[i][j] == 1){
                ctx.beginPath();
                ctx.rect(i * 35, j * 35,boxSize,boxSize);
                ctx.fillStyle = "red";
                ctx.strokeStyle = "black";
                ctx.fill();
                ctx.stroke();
            }
	    }
    }
}

function nextBrick(){
    var canvas2 = document.getElementById("nextBlock");
	var ctx2 = canvas2.getContext("2d");
    var size = 25;
	var positionX = 55;
	var positionY = 75;
	var previousX = nextShape[0][0];
	var previousY = nextShape[0][1];

	ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
    ctx2.fillStyle = canvasColor;
    ctx2.fillRect(0, 0, canvas2.width, canvas2.height);

    for(i = 0; i < nextShape.length; i++){
        positionX += size * (nextShape[i][0] - previousX);
        positionY += size * (nextShape[i][1] - previousY);

        ctx2.beginPath();
        ctx2.rect(positionX, positionY, size, size);
        ctx2.fillStyle = "red";
        ctx2.strokeStyle = "black";
        ctx2.fill();
        ctx2.stroke();

        previousX = nextShape[i][0];
        previousY = nextShape[i][1];
    }
}

//MOVE THE CURRENT SHAPE
function updateCurrentShapePosition(direction){
    if(direction == "down"){
        for(i = currentShape.length- 1; i >= 0; i--){
            if(currentShape[i][1] + 1 >= 0){
                grid[currentShape[i][0]][currentShape[i][1]] = 0;
                grid[currentShape[i][0]][currentShape[i][1] + 1] = 1;
            }
            currentShape[i][1] += 1;
        }
    }else if(direction == "left"){
        for(i = 0; i < currentShape.length; i++){
            grid[currentShape[i][0]][currentShape[i][1]] = 0;
            grid[currentShape[i][0] - 1][currentShape[i][1]] = 1;
            currentShape[i][0] -= 1;
        }
    }else if(direction == "right"){
        for(i = currentShape.length- 1; i >= 0; i--){
            grid[currentShape[i][0]][currentShape[i][1]] = 0;
            grid[currentShape[i][0] + 1][currentShape[i][1]] = 1;
            currentShape[i][0] += 1;
        }
    }
}

//CHECK IF THE CURRENT SHAPE IS ALLOWED TO MOVE
/*
For each direction( left, right) first check if the brick is going out of the tetris box. if it is do not allow it to move.
if it is not then find the boxes of the brick closest to this direction. For example for the left find the left bricks.
then check if there is something to the direction of these boxes. if there is do not let the brick move. else let it move.

in the case of the down direction find each box on the bottom of each column in the matrix inside the brick. then check
if there is something underneath those boxes.
*/
function checkIfAvailable(direction){
    if(direction == "down"){

        var tempo = [];
        for(i = 0; i < currentShape.length; i++){
            tempo.push(currentShape[i]);
        }



        for(i = 0; i < currentShape.length; i++){
            for(j = 0; j < tempo.length; j++){
                if(currentShape[i][0] == tempo[j][0] && currentShape[i][1] > tempo[j][1] ){
                    tempo[j] = [];
                }
            }
        }

        for(i = 0; i < tempo.length; i++){
            if(isNaN(tempo[i]) && (tempo[i][1] == 14 || grid[tempo[i][0]][tempo[i][1] + 1] == 1)){
                if(tempo[i][1] == -1){
                    clearInterval(game);
                    alert("you lost");
                }else{
                    randomShape();
                }
                calculateScore();
                return false;
            }
        }

    }else if(direction == "left"){
        min = 99;
        for(i = 0; i < currentShape.length; i++){
            if(currentShape[i][0] == 0){
                return false;
            }else{
                if(currentShape[i][0] < min){
                    min = currentShape[i][0];
                }
            }
        }

        for(i = 0; i < currentShape.length; i++){
            if(currentShape[i][0] == min && grid[currentShape[i][0] - 1][currentShape[i][1]] == 1){

                return false;
            }
        }
    }else if(direction == "right"){
        max = 0;
        for(i = 0; i < currentShape.length; i++){
            if(currentShape[i][0] == 9){
                return false;
            }else{
                if(currentShape[i][0] > max){
                    max = currentShape[i][0];
                }
            }
        }

        for(i = 0; i < currentShape.length; i++){
            if(currentShape[i][0] == max && grid[currentShape[i][0] + 1][currentShape[i][1]] == 1){
                return false;
            }
        }
    }
    return true;
}


//USER INPUT FOR BRICK MOVEMENTS
document.onkeydown = function direction(e){
    var event = window.event ? window.event : e
    var key = event.keyCode;

    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {

    }else{
        checkBottom = checkIfAvailable("down");
        if((key == "40" || key == "83" ) && checkBottom){
            updateCurrentShapePosition("down");
        }

        check = checkIfAvailable("left");
        if((key == "37" || key == "65" ) && check && checkBottom){
            updateCurrentShapePosition("left");
        }

        check = checkIfAvailable("right");
        if((key == "39" || key == "68") && check && checkBottom){
            updateCurrentShapePosition("right");
        }

        if(key == "32"){
            try{
                rotateBrick();
            }
            catch{

            }
        }
    }
}

//let the user choose direction using mobile
function keypad(dir){

    checkBottom = checkIfAvailable(dir);
    if(dir == "down" && checkBottom){
        updateCurrentShapePosition("down");
    }

    check = checkIfAvailable(dir);
    if(dir == "left" && check && checkBottom){
        updateCurrentShapePosition("left");
    }

    check = checkIfAvailable(dir);
    if(dir == "right" && check && checkBottom){
        updateCurrentShapePosition("right");
    }

    if(dir == "rotate"){
        try{
            rotateBrick();
        }
        catch{

        }
    }
}

function rotateBrick(){

    if(shapeDuoString[0] == "line"){
        //check if safe to rotate
        var topX = currentShape[0][0];
        var topY = currentShape[0][1];
        if(grid[topX + 2][topY + 1] == 0 &&
           grid[topX + 1][topY + 1] == 0 &&
           grid[topX - 1][topY + 1] == 0 && shapeMode == 0){

           grid[currentShape[0][0]][currentShape[0][1]] = 0;
           grid[currentShape[0][0] - 1][currentShape[0][1] + 1] = 1;
           currentShape[0][0] -= 1;
           currentShape[0][1] += 1;

           grid[currentShape[2][0]][currentShape[2][1]] = 0;
           grid[currentShape[2][0] + 1][currentShape[2][1] - 1] = 1;
           currentShape[2][0] += 1;
           currentShape[2][1] -= 1;

           grid[currentShape[3][0]][currentShape[3][1]] = 0;
           grid[currentShape[3][0] + 2][currentShape[3][1] - 2] = 1;
           currentShape[3][0] += 2;
           currentShape[3][1] -= 2;

           shapeMode = 1;
         }

        if(grid[topX + 1][topY - 1] == 0 &&
           grid[topX + 1][topY + 1] == 0 &&
           grid[topX + 1][topY + 2] == 0 && shapeMode == 1){


           grid[currentShape[0][0]][currentShape[0][1]] = 0;
           grid[currentShape[0][0] + 1][currentShape[0][1] - 1] = 1;
           currentShape[0][0] += 1;
           currentShape[0][1] -= 1;

           grid[currentShape[2][0]][currentShape[2][1]] = 0;
           grid[currentShape[2][0] - 1][currentShape[2][1] + 1] = 1;
           currentShape[2][0] -= 1;
           currentShape[2][1] += 1;

           grid[currentShape[3][0]][currentShape[3][1]] = 0;
           grid[currentShape[3][0] - 2][currentShape[3][1] + 2] = 1;
           currentShape[3][0] -= 2;
           currentShape[3][1] += 2;

            shapeMode = 0;

        }

    }else if(shapeDuoString[0] == "podium"){
        //check if safe to rotate
        var topX = currentShape[0][0];
        var topY = currentShape[0][1];
        if(grid[topX + 1][topY + 1] == 0 && shapeMode ==0){

            grid[topX + 1][topY + 1] = 1;
            grid[currentShape[0][0]][currentShape[0][1]] = 0;

            currentShape[0][0] += 1;
            currentShape[0][1] -= 1;

            currentShape[1][1] += 1;
            currentShape[2][1] += 1;

            shapeMode = 1;

        }else if(grid[topX - 1][topY + 1] == 0 && shapeMode == 1){
            grid[topX][topY] = 0;
            grid[topX - 1][topY + 1] = 1;

            currentShape[0][0] -= 1;
            currentShape[0][1] += 1;

            shapeMode = 2;
        }else if(grid[topX + 1][topY - 1] == 0 && shapeMode == 2){
            grid[topX + 2][topY] = 0;
            grid[topX + 1][topY - 1] = 1;

            currentShape[1][1] -= 1;

            currentShape[2][1] -= 1;

            currentShape[3][0] -= 1;
            currentShape[3][1] += 1;

            shapeMode = 3;
        }else if(grid[topX + 2][topY] == 0 && shapeMode == 3){
            grid[topX + 1][topY + 1] = 0;
            grid[topX + 2][topY] = 1;

            currentShape[3][0] += 1;
            currentShape[3][1] -= 1;

            shapeMode = 0;
        }



    }else if(shapeDuoString[0] == "leftStep"){
        //check if safe to rotate
        var topX = currentShape[0][0];
        var topY = currentShape[0][1];

        if(grid[topX + 1][topY - 2] == 0 && grid[topX + 2][topY] == 0 && shapeMode == 0){
            grid[topX + 1][topY - 2] = 1;
            grid[topX + 2][topY] = 1;
            grid[currentShape[0][0]][currentShape[0][1]] = 0;
            grid[currentShape[2][0]][currentShape[2][1]] = 0;

            currentShape[0][0] += 1;
            currentShape[0][1] -= 2;

            currentShape[2][0] += 1;
            currentShape[2][1] -= 1;

            currentShape[3][1] += 1;

            shapeMode = 1;

        }else if(grid[topX - 1][topY + 2] == 0 && grid[topX][topY + 2] == 0 && shapeMode == 1){
            grid[topX - 1][topY + 2] = 1;
            grid[topX][topY + 2] = 1;
            grid[currentShape[0][0]][currentShape[0][1]] = 0;
            grid[currentShape[3][0]][currentShape[3][1]] = 0;

            currentShape[0][0] -= 1;
            currentShape[0][1] += 2;

            currentShape[2][0] -= 1;
            currentShape[2][1] += 1;

            currentShape[3][1] -= 1;

            shapeMode = 0;
        }

    }else if(shapeDuoString[0] == "rightStep"){
        var topX = currentShape[0][0];
        var topY = currentShape[0][1];

        if(grid[topX + 1][topY - 1] == 0 && grid[topX][topY + 1] == 0 && shapeMode == 0 ){
            grid[topX + 1][topY - 1] = 1;
            grid[topX][topY + 1] = 1;
            grid[currentShape[2][0]][currentShape[2][1]] = 0;
            grid[currentShape[3][0]][currentShape[3][1]] = 0;

            currentShape[1][0] -= 1;
            currentShape[1][1] += 1;

            currentShape[2][1] -= 2;

            currentShape[3][0] -= 1;
            currentShape[3][1] -= 1;

            shapeMode = 1;


        }else if(grid[topX + 1][topY + 1] == 0 && grid[topX + 2][topY + 1] == 0 && shapeMode == 1 ){
            grid[topX + 1][topY + 1] = 1;
            grid[topX + 2][topY + 1] = 1;
            grid[currentShape[1][0]][currentShape[1][1]] = 0;
            grid[currentShape[2][0]][currentShape[2][1]] = 0;

            currentShape[1][0] += 1;
            currentShape[1][1] -= 1;

            currentShape[2][1] += 2;

            currentShape[3][0] += 1;
            currentShape[3][1] += 1;

            shapeMode = 0;

        }

    }else if(shapeDuoString[0] == "leftFallenMan"){
        var topX = currentShape[0][0];
        var topY = currentShape[0][1];

        if(grid[topX + 1][topY] == 0 && grid[topX][topY + 2] == 0 && shapeMode == 0){
            grid[topX + 1][topY] = 1;
            grid[topX][topY + 2] = 1;
            grid[currentShape[3][0]][currentShape[3][1]] = 0;
            grid[currentShape[2][0]][currentShape[2][1]] = 0;

            currentShape[2][0] -= 1;
            currentShape[2][1] += 1;

            currentShape[3][0] -= 1;
            currentShape[3][1] -= 1;

            shapeMode = 1;
        }else if(grid[topX - 1][topY + 1] == 0 && grid[topX + 1][topY + 1] == 0 && grid[topX + 1][topY + 2] == 0 && shapeMode == 1){
            grid[topX - 1][topY + 1] = 1;
            grid[topX + 1][topY + 1] = 1;
            grid[topX + 1][topY + 2] = 1;
            grid[currentShape[3][0]][currentShape[3][1]] = 0;
            grid[currentShape[2][0]][currentShape[2][1]] = 0;
            grid[currentShape[0][0]][currentShape[0][1]] = 0;

            currentShape[0][0] -= 1;
            currentShape[0][1] += 1;

            currentShape[2][0] += 1;
            currentShape[2][1] -= 1;

            currentShape[3][1] += 2;

            shapeMode = 2;

        }else if(grid[topX + 1][topY + 1] == 0 && grid[topX + 2][topY - 1] == 0 && shapeMode == 2){
            grid[topX + 1][topY + 1] = 1;
            grid[topX + 2][topY - 1] = 1;
            grid[currentShape[0][0]][currentShape[0][1]] = 0;
            grid[currentShape[1][0]][currentShape[1][1]] = 0;

            currentShape[0][0] += 1;
            currentShape[0][1] += 1;

            currentShape[1][0] += 1;
            currentShape[1][1] -= 1;

            shapeMode = 3;
        }else if(grid[topX][topY - 1] == 0 && grid[topX + 2][topY] == 0 && shapeMode == 3){
           grid[topX][topY - 1] = 1;
           grid[topX + 2][topY] = 1;
           grid[currentShape[2][0]][currentShape[2][1]] = 0;
           grid[currentShape[1][0]][currentShape[1][1]] = 0;

           currentShape[0][1] -= 1;

           currentShape[1][0] -= 1;
           currentShape[1][1] += 2;

           currentShape[3][0] += 1;

           currentShape[2][1] += 1;

           shapeMode = 0;
        }

    }else if(shapeDuoString[0] == "rightFallenMan"){
        var topX = currentShape[0][0];
        var topY = currentShape[0][1];

        if(grid[topX + 1][topY - 1] == 0 && grid[topX + 1][topY - 2] == 0 && shapeMode == 0 ){
            grid[topX + 1][topY - 1] = 1;
            grid[topX + 1][topY - 2] = 1;
            grid[currentShape[2][0]][currentShape[2][1]] = 0;
            grid[currentShape[0][0]][currentShape[0][1]] = 0;

            currentShape[0][0] += 1;
            currentShape[0][1] -= 2;

            currentShape[1][1] -= 1;

            currentShape[2][0] -= 1;
            currentShape[2][1] += 1;

            shapeMode = 1;
        }else if(grid[topX + 1][topY + 1] == 0 && grid[topX + 2][topY + 1] == 0 && shapeMode == 1 ){
            grid[topX + 1][topY + 1] = 1;
            grid[topX + 2][topY + 1] = 1;
            grid[currentShape[3][0]][currentShape[3][1]] = 0;
            grid[currentShape[0][0]][currentShape[0][1]] = 0;

            currentShape[0][1] += 1;

            currentShape[1][1] += 1;

            currentShape[2][0] += 1;
            currentShape[2][1] -= 1;

            currentShape[3][0] += 1;
            currentShape[3][1] -= 1;

            shapeMode = 2;

        }else if(grid[topX][topY - 1] == 0 && grid[topX + 1][topY - 1] == 0 && grid[topX + 1][topY + 1] == 0 && shapeMode == 2 ){
            grid[topX][topY - 1] = 1;
            grid[topX + 1][topY - 1] = 1;
            grid[topX + 1][topY + 1] = 1;
            grid[currentShape[3][0]][currentShape[3][1]] = 0;
            grid[currentShape[0][0]][currentShape[0][1]] = 0;
            grid[currentShape[1][0]][currentShape[1][1]] = 0;

            currentShape[0][1] -= 1;

            currentShape[1][0] += 1;
            currentShape[1][1] -= 2;

            currentShape[3][0] -= 1;
            currentShape[3][1] += 1;

            shapeMode = 3;

        }else if(grid[topX][topY + 1] == 0 && grid[topX - 1][topY + 1] == 0 && shapeMode == 3 ){

            grid[topX][topY + 1] = 1;
            grid[topX - 1][topY + 1] = 1;
            grid[currentShape[3][0]][currentShape[3][1]] = 0;
            grid[currentShape[0][0]][currentShape[0][1]] = 0;

            currentShape[0][0] -= 1;
            currentShape[0][1] += 1;

            currentShape[1][0] -= 1;
            currentShape[1][1] += 1;

            currentShape[2][1] -= 1;
            currentShape[3][1] -= 1;

            shapeMode = 0;

        }


    }
}

function calculateScore(){
    counter = 1;
    for(j = 0; j < 15; j++){
        line = 0;
        for(i=0; i < 10; i++){
            line += grid[i][j];
        }
        if(line == 10){
            for(o = j; o > 0; o--){
                for(k = 0; k < 10; k++){
                    grid[k][o] = grid[k][o-1];
                }
            }
            score += scorePerLine * counter;
            if(speedLimit >= 1){
                speedLimit = Math.floor(0.95 * speedLimit);
            }
            counter++;


        }
    }

    document.getElementById("score").innerHTML = ("00000000" + score).slice(-8);
}

//RESTART THE GAME
function restart(){
	score = 0;
	grid = [];
	for(i = 0; i < 10; i++){
        grid.push([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);
    }
	clearInterval(game);
	game = window.setInterval(redraw, 50);

}

var lastTouchEnd = 0;
document.addEventListener('touchend', function (event) {
  var now = (new Date()).getTime();
  if (now - lastTouchEnd <= 500) {
    event.preventDefault();
  }
  lastTouchEnd = now;
}, false);

window.onload = function() {

	if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
        document.getElementById("keypad").style.display = "block";
    }
    for(i = 0; i < 10; i++){
        grid.push([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);
    }

    canvas = document.getElementById("canvas");
	ctx = canvas.getContext("2d");
    nextBrick();
	game = window.setInterval(redraw, 50);
};