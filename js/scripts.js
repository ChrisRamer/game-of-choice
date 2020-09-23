// Business Logic

let turnCount = 0;
let playerPts;
let cpuPts;
let playerDiceCount;
let cpuDiceCount;

function AddTurn() {
	turnCount++;
}

const addPoints = function(points) {
	// If player's turn
	if (turnCount % 2 == 1) {
		playerPts += points;
	}
	// Else if CPU's turn
	else {
		cpuPts += points;
	}
}

function GenerateDice() {
	//
}

// User interface logic

$(document).ready(function () {

	$("form#startGame").submit(function (e) { 
		e.preventDefault();
		StartGame();
	});

	function StartGame() {
		AddTurn(); // Start on turn 1 (player)
		$("#startGame").hide(); // Hide game setup
		$("#playGame").show(); // Show gameplay
	}

});