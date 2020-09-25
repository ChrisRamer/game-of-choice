// Business Logic

let playerName = "Steve";
let turnCount = 0;
let rollsThisTurn = 1;
let playerPts = 0;
let playerPtsThisTurn = 0;
let cpuPts = 0;
let cpuPtsThisTurn = 0;
let playerDiceCount = 0;
let cpuDiceCount = 0;

function StartGame() {
	playerName = $("input#playerName").val();
	AddTurn(); // Start on turn 1
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

	if (IsPlayersTurn()) {
		$("#playGame h3").text("Turn " + parseInt(turnCount) + " | Roll " + parseInt(rollsThisTurn++) + ": " + playerName + " Rolls!");

		if (randNum === 1) {
			playerPtsThisTurn = 0;
		}
		else {
			playerPtsThisTurn += randNum;
			playerDiceCount++;
		}
	}
	else {
		$("#playGame h3").text("Turn " + parseInt(turnCount) + " | Roll " + parseInt(rollsThisTurn++) + ": CPU Rolls!");

		if (randNum === 1) {
			cpuPtsThisTurn = 0;
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
		if (playerPtsThisTurn > 0) {
			$("#rollSummary").text("You have accumlated " + playerPtsThisTurn + " points this turn. You have a total of " + playerPts + " points.");
		}
		else {
			$("#rollSummary").text("Oh no! You lost your points for this round :(");

			// Wait some time
			setTimeout(function() {
				AddTurn();
			}, 2500);
		}
	}
	else {
		$("#rollSummary").text("");
	}
}

function OnHold() {
	if (IsPlayersTurn()) {
		UpdateScore(playerPtsThisTurn);
		playerDiceCount = 0;
		playerPtsThisTurn = 0;
	}
	else {
		UpdateScore(cpuPtsThisTurn);
		cpuDiceCount = 0;
		cpuPtsThisTurn = 0;
	}
}

function UpdateScore (points) {
	// If player's turn
	if (IsPlayersTurn()) {
		playerPts += points;
	}
	// Else if CPU's turn
	else {
		cpuPts += points;
	}

	if  (playerPts >= 100 || cpuPts >= 100) {
		GameWin();
	}
	else {
		AddTurn();
	}
}

function CPUTurn() {
	console.log("Is the CPU's turn now!");
}

function AddTurn() {
	turnCount++;
	rollsThisTurn = 1;

	OnDiceRoll();

	// If CPU's turn
	if (!IsPlayersTurn()) {
		CPUTurn();
	}
}

function GameWin() {
	//
	console.log("The game has finished!");
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