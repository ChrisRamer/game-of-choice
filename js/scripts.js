// Business Logic

let playerName = "Steve";
let turnCount = 0;
let rollCount = 1;
let playerPts = 0;
let playerPtsThisTurn = 0;
let cpuPts = 0;
let cpuPtsThisTurn = 0;
let playerDiceCount = 0;
let cpuDiceCount = 0;

function StartGame() {
	playerName = $("input#playerName").val();
	//AddTurn();
	OnRollEnd(); // Start game
	$("#startGame").hide(); // Hide game setup
	$("#playGame").fadeIn(500); // Show gameplay
}

const IsPlayersTurn = function() {
	if (turnCount % 2 == 1) {
		return true;
	}

	return false;
}

function OnDiceRoll() {
	const randNum = Math.floor(Math.random() * (6 - 1) + 1) // Roll random dice number
	document.getElementById("diceRolled").src = "img/dice" + randNum + ".png"; // Update dice graphic

	// If rolled a 1, lose all points
	if (randNum === 1) {
		playerPtsThisTurn = 0;
	}
	else {
		if (IsPlayersTurn()) {
			playerPtsThisTurn += randNum;
			playerDiceCount++;
		}
		else {
			cpuPtsThisTurn += randNum;
			cpuDiceCount++;
		}
	}

	OnRollEnd();
}

function OnRollEnd() {
	if (IsPlayersTurn()) {
		$("#playGame h3").text("Turn " + parseInt(turnCount) + " | Roll " + parseInt(rollCount++) + ": " + playerName + " Rolls!");
	}
	else {
		$("#playGame h3").text("Turn " + parseInt(turnCount) + " | Roll " + parseInt(rollCount++) + ": CPU Rolls!");
	}
}

function OnHold() {
	if (IsPlayersTurn()) {
		playerPts += playerPtsThisTurn;
		playerDiceCount = 0;
		playerPtsThisTurn = 0;
	}
	else {
		cpuPts += cpuPtsThisTurn;
		cpuDiceCount = 0;
		cpuPtsThisTurn = 0;
	}
}

function UpdateScore (points) {
	// If player's turn
	if (turnCount % 2 == 1) {
		playerPts += points;
	}
	// Else if CPU's turn
	else {
		cpuPts += points;
	}
}

function NextTurn() {
	//
}

function CPUTurn() {
	//
}

function AddTurn() {
	turnCount++;
}

// User interface logic

$(document).ready(function () {

	$("form#startGame").submit(function (e) { 
		e.preventDefault();
		StartGame();
	});
	
	// On click roll again
	$("#roll").click(function (e) { 
		e.preventDefault();
		OnDiceRoll();
	});

	// On click hold
	$("#hold").click(function (e) { 
		e.preventDefault();
		OnHold();
	});

});