//sudoku generator js file

/**** Variables and Objects ****/
var puzzle = new Array(9);
var solution;
var quadrants;
var usedSolver = false;
var emptyBoard = true;
var currInputBox;

function Box(boxNum, minRow, maxRow, minCol, maxCol){
	this.boxNum = boxNum;
	this.minRow = minRow;
	this.maxRow = maxRow;
	this.minCol = minCol;
	this.maxCol = maxCol;
}

function Cell(row, col){
	this.row = row;
	this.col = col;
	this.candArr = findCandidates(this.row, this.col);
}

function oneToNine(){
	return [1,2,3,4,5,6,7,8,9];
}

/**** General Purpose Functions ****/
function createArrays(arr){
	for (var i = 0; i<arr.length; i++){
		arr[i] = new Array(9);
		arr[i].fill(0); //inits all array elements to 0s
	}
}

//returns true if puzzle is solved (for use by solve())
function solved(){
	for (var i = 0; i<9; i++){
		if (puzzle[i].indexOf(0)!=-1)
			return false;
	}
	return true;
}

function getNextEmptyCell(row, col){
	while (puzzle[row][col]!=0){
		if (col==8){
			row++;
			col=0;
		}
		else col++;
	}
	return new Cell(row, col);
}

function getPrevEmptyCell(row, col){
	if (col==0){
		col=8;
		row--;
	}
	else col--;
	return new Cell(row, col);
}

function solve(row, col){
	if (solved())
		return true;
	else {
		nextCell = getNextEmptyCell(row, col);
		console.log(nextCell);
		console.log("cell: " + nextCell.row + ", " + nextCell.col + ": " + nextCell.candArr);
		for (var i = 0; i<nextCell.candArr.length; i++){
			//console.log("im in");
			puzzle[nextCell.row][nextCell.col]=nextCell.candArr[i];
			if (solve(nextCell.row, nextCell.col)) return true;
			puzzle[nextCell.row][nextCell.col]=0;
			nextCell = getPrevEmptyCell(nextCell.row, nextCell.col);
			console.log(nextCell);
			//console.log("oh no");
		}
	}
	console.log("backtracking");
	return false;
}

function findCandidates(row, col){
	var candArr = oneToNine();
	//init by checking row
	for (var i=0; i<9; i++){
		if (candArr.indexOf(puzzle[row][i])!=-1)
			candArr.splice(candArr.indexOf(puzzle[row][i]), 1);
	}
	//console.log("after row check: " + candArr);
	//check column
	for (var i = 0;i < 9; i++){
		if (candArr.indexOf(puzzle[i][col])!=-1)
			candArr.splice(candArr.indexOf(puzzle[i][col]), 1);
	}
	//console.log("after col check: " + candArr);
	//check box
	var box = quadrant(row, col);
	for (var i = box.minRow; i<=box.maxRow; i++){
		for (var j = box.minCol; j<=box.maxCol; j++){
			if (candArr.indexOf(puzzle[i][j])!=-1)
				candArr.splice(candArr.indexOf(puzzle[i][j]), 1);
		}
	}
	//console.log("after box check: " + candArr);
	return shuffleArray(candArr);
}

function findCandidates2(row, col){
	var candArr = oneToNine();
	for (var i=0; i<9; i++){
		if (inputBox(row, i) && i!=col){
			if (candArr.indexOf(Number(puzzleContainer.children[row].children[i].children[0].innerText))!=-1)
				candArr.splice(candArr.indexOf(Number(puzzleContainer.children[row].children[i].children[0].innerText)));
		}
		else{
			if (candArr.indexOf(puzzle[row][i])!=-1)
				candArr.splice(candArr.indexOf(puzzle[row][i]), 1);
		}
	}
	for (var i = 0;i < 9; i++){
		if (inputBox(i, col) && i!=row){
			if (candArr.indexOf(Number(puzzleContainer.children[i].children[col].children[0].innerText))!=-1)
				candArr.splice(candArr.indexOf(Number(puzzleContainer.children[i].children[col].children[0].innerText)));
		}
		else{
			if (candArr.indexOf(puzzle[i][col])!=-1)
				candArr.splice(candArr.indexOf(puzzle[i][col]), 1);
		}
	}
	var box = quadrant(row, col);
	for (var i = box.minRow; i<=box.maxRow; i++){
		for (var j = box.minCol; j<=box.maxCol; j++){
			if (inputBox(i, j) && i!=row && j!=col){
				if (candArr.indexOf(Number(puzzleContainer.children[i].children[j].children[0].innerText))!=-1)
					candArr.splice(candArr.indexOf(Number(puzzleContainer.children[i].children[j].children[0].innerText)));
			}
			else{
				if (candArr.indexOf(puzzle[i][j])!=-1)
					candArr.splice(candArr.indexOf(puzzle[i][j]), 1);
			}
		}
	}
	return candArr;
}

//Checks to see if current box is an input box or a printed number
function inputBox(row, col){
	if (document.getElementById("puzzleContainer").children[row].children[col].children.length > 0)
		return true;
	else return false;
}

//returns quadrant of entry (0-8)
function quadrant(row, col){
	var currBox;
	//6, 7, 8
	if (row>5){
		if (col>5)
			currBox = new Box(8, 6, 8, 6, 8);
		else if (col>2 && col<6)
			currBox = new Box(7, 6, 8, 3, 5);
		else currBox = new Box(6, 6, 8, 0, 2);
	}
	//3, 4, 5
	else if (row>2 && row<6){
		if (col>5)
			currBox = new Box(5, 3, 5, 6, 8);
		else if (col>2 && col<6)
			currBox = new Box(4, 3, 5, 3, 5);
		else currBox = new Box(3, 3, 5, 0, 2);
	}
	//0, 1, 2
	else{
		if (col>5){
			//console.log('hi');
			currBox = new Box(2, 0, 2, 6, 8);
		}
		else if (col>2 && col<6){
			//console.log('hello');
			currBox = new Box(1, 0, 2, 3, 5);
		}
		else {
			//console.log('sup');
			currBox = new Box(0, 0, 2, 0, 2);
		}
	}
	return currBox;
}

function printPuzzle(){
	var htmlPuzzle = document.getElementById("puzzleContainer");
	var boxNum = 0;
	for (var i = 0; i<9; i++){
		htmlPuzzle.innerHTML += "<div class = 'row'></row>";
		var currRow = document.getElementsByClassName("row")[i];
		if (i===2 || i===5){
			currRow.style.borderBottomWidth = "4px";
			currRow.style.borderBottomStyle = "solid";
			currRow.style.borderColor = "black";
		}
		for (var j = 0; j<9; j++){
			currRow.innerHTML += "<span class = 'box' data-row = '' data-col = ''></span>";
			var currBox = document.getElementsByClassName("box")[boxNum];
			if (puzzle[i][j]==0) {
				if (!emptyBoard) {
					currBox.innerHTML += "<div class = 'stacked' contenteditable = 'false' name = 'candInput' onkeypress='return (this.innerText.length < 9)'></div>";
					currBox.innerHTML += "<div class = 'stacked' contenteditable = 'true' name = 'boxInput' onkeypress='return (this.innerText.length < 1)'></div>";
				}
			}
			else document.getElementsByClassName("box")[boxNum].innerText = puzzle[i][j];
			if (j===2 || j===5){
				currRow.children[j].style.borderRightWidth = "4px";
				currRow.children[j].style.borderRightStyle = "solid";
				currRow.children[j].style.borderColor = "black";
			}
			currBox.setAttribute("data-row", i);
			currBox.setAttribute("data-col", j);
			boxNum++;
		}
	}
}

//Randomize array element order in-place using Durstenfeld shuffle algorithm.
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];//temp = last element
        array[i] = array[j];//last element = other random element
        array[j] = temp;//place where random el was is now previous last element (temp)
    }
    return array;
}

function randBool(divVal){ //lower number for chance = higher chance of returning true
	if ((Math.floor(Math.random()*5))/5 >= 1/divVal) return true;
}

function diffAdjust(clearBoxes){
	var eachRow = clearBoxes;
	for (var i=0; i<9; i++){
		for (var j=0; j<eachRow; j++){
			puzzle[i][randInt()] = "";
		}
	}
}

//returns random number 0-8
function randInt(){
	return Math.floor(Math.random()*9);
}

//checks current puzzle against solution to see if correct
function loadSolution(){
	for (var i=0; i<9; i++){
		for (var j=0; j<9; j++){
			puzzle[i][j] = solution[i][j];
		}
	}
	document.getElementById("puzzleContainer").innerHTML = "";
	printPuzzle();
	usedSolver = true;
}

//rewrite later
function puzzleCheck(event){
	var latestCell = document.activeElement;
	//console.log(event.keyCode);
	if (!(event.keyCode >= 49 && event.keyCode <= 57)) {
		latestCell.innerText = "";
		return false
	}
	if (latestCell.getAttribute("name") == "candInput"){
		if (event.keyCode == 8){
		var cellText = latestCell.innerText;
		cellText = cellText.slice(0, -1);
		}
		return;
	}
	if (event.keyCode == 8){
		latestCell.innerText = "";
		return;
	}
	latestCell.parentElement.childNodes[0].innerText = "";
	var candArr = findCandidates2(latestCell.parentElement.getAttribute("data-row"), latestCell.parentElement.getAttribute("data-col"));
	if (candArr.indexOf(Number(latestCell.innerText))!=-1)
		latestCell.style.color = "#415bb5";
	else latestCell.style.color = "red";
}

//final verdict on whether or not puzzle is correct (maybe automate later)
function puzzleSubmit(){
	if (usedSolver) {
		alert("Try solving it yourself next time ;)");
		return;
	}
	if (checkSolved()){
		alert("Congratulations! The puzzle is solved.");
	}
	else alert("Sorry! This puzzle is either incomplete or contains a false solution.");
}

function checkSolved(){
	var inputs = document.getElementsByName("boxInput");
	for (var i = 0; i<inputs.length; i++)
		if ((inputs[i].style.color == "red") || (inputs[i].innerText == "")) return false;
	return true;
}

//switches input divs
function swapChildren(sender){
	var boxes = document.getElementsByClassName("box");
	if (sender == currInputBox) return;
	for (var i = 0; i<boxes.length; i++){
		if (boxes[i].children.length > 0){
			boxes[i].insertBefore(boxes[i].childNodes[1], boxes[i].childNodes[0]);
			boxes[i].childNodes[0].contentEditable = false;
			boxes[i].childNodes[1].contentEditable = true;
		}
	}
	currInputBox = sender;
}

function addDivListener(){
	var regBoxes = document.getElementsByName('boxInput');
	var candBoxes = document.getElementsByName('candInput');
	for (var i = 0; i<regBoxes.length; i++){
		regBoxes[i].addEventListener("keyup", puzzleCheck);
		candBoxes[i].addEventListener("keyup", puzzleCheck);
	}
}

function run(clearBoxes){
	currInputBox = "reg";
	usedSolver = false;
	document.getElementById("puzzleContainer").innerHTML = "";
	//change this later to a loop or something
	document.getElementById("subOrSolveBox").style.display = "";
	document.getElementById("candBtn").style.display = "";
	document.getElementById("regBtn").style.display = "";
	createArrays(puzzle); //creates 9x9 array for puzzle
	solve(0, 0); //solver
	emptyBoard = false;
	solution = JSON.parse(JSON.stringify(puzzle));
	diffAdjust(clearBoxes);
	printPuzzle();
	addDivListener(); //adds key listener to all regular div input boxes
}

window.onload = function(){
	createArrays(puzzle);
	printPuzzle();
}

/**** Bugs ****/

/**** Goals ****/
	
//add keypress option for changing input types
	
//css: change size of puzzle to percents so that you dont have to scroll to see all of it