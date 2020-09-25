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
let cpuDifficulty;
let cpuTurnInterval;

function StartGame() {
	playerName = $("input#playerName").val();
	cpuDifficulty = $("#cpuLevel").val();
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

const diceRoll = function (){
	const randNum = Math.floor(Math.random() * (6 - 1) + 1) // Roll random dice number
	document.getElementById("diceRolled").src = "img/dice" + randNum + ".png"; // Update dice graphic

	if (IsPlayersTurn()) {
		clearInterval(cpuTurnInterval);
		ShowGameButtons();
		$("#playGame h3").html("Turn " + parseInt(turnCount) + " | Roll " + parseInt(rollsThisTurn++) + ": " + playerName + " Rolls!");

		if (randNum === 1) {
			playerPtsThisTurn = 0;
		}
		else {
			playerPtsThisTurn += randNum;
			playerDiceCount++;
		}
	}
	else {
		$("#playGame h3").html("Turn " + parseInt(turnCount) + " | Roll " + parseInt(rollsThisTurn++) + ": CPU Rolls!");

		if (randNum === 1) {
			cpuPtsThisTurn = 0;
		}
		else {
			cpuPtsThisTurn += randNum;
			cpuDiceCount++;
		}
	}

	OnRollEnd(randNum);
}

function OnRollEnd(numberRolled) {
	if (IsPlayersTurn()) {
		clearInterval(cpuTurnInterval);

		if (playerPtsThisTurn > 0) {
			$("#rollSummary").html("You rolled a <b>" + parseInt(numberRolled) + "</b>! You have accumlated <b>" + playerPtsThisTurn + "</b> points this turn. You have a total of <b>" + playerPts + "</b> points.");
		}
		else {
			HideGameButtons();
			$("#rollSummary").html("Oh no! You lost your points for this round :(");

			// Wait some time
			setTimeout(function() {
				AddTurn();
			}, 3000);
		}
	}
	else {
		if (cpuPtsThisTurn > 0) {
			$("#rollSummary").html("CPU <b>rolled</b>! They have accumlated <b>" + cpuPtsThisTurn + "</b> points this turn. They have a total of <b>" + cpuPts + "</b> points.");
		}
		else {
			$("#rollSummary").html("CPU <b>lost</b> all their points for this round! They have a total of <b>" + cpuPts + "</b> points.");
			clearInterval(cpuTurnInterval);

			// Wait some time
			setTimeout(function () {
				AddTurn();
			}, 3000);
		}
	}
}

function OnHold() {
	if (IsPlayersTurn()) {
		HideGameButtons();
		$("#rollSummary").html("You have <b>held</b> your <b>" + playerPtsThisTurn + "</b> points this turn. You now have a total of <b>" + (playerPts + playerPtsThisTurn) + "</b> points.");

		// Wait some time
		setTimeout(function () {
			playerDiceCount = 0;
			playerPtsThisTurn = 0;
			UpdateScore(playerPtsThisTurn);
		}, 3000);
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
	if (cpuDifficulty === "Easy") {
		// 50/50 chance to roll dice or hold
		const randNum = Math.round(Math.random());

		// Roll dice
		if (randNum === 0) {
			diceRoll();
		}
		else {
			// Stop CPU's turn
			clearInterval(cpuTurnInterval);

			// Output result
			$("#rollSummary").html("CPU has <b>held</b> their <b>" + cpuPtsThisTurn + "</b> points this turn. They now have a total of <b>" + (cpuPts + cpuPtsThisTurn) + "</b> points.");

			// Wait some time
			setTimeout(function () {
				OnHold();
			}, 5000);
		}
	}
	else {
		//
	}
}

function AddTurn() {
	turnCount++;
	rollsThisTurn = 1;

	diceRoll();

	// If CPU's turn
	if (!IsPlayersTurn()) {
		HideGameButtons();
		cpuTurnInterval = setInterval(CPUTurn, 2500);
	}
}

function GameWin() {
	HideGameButtons();
	console.log("The game has finished!");
}

function ShowGameButtons() {
	$("#gameplayButtons").show();
}

function HideGameButtons() {
	$("#gameplayButtons").hide();
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
		diceRoll();
	});

	// On click hold
	$("#hold").click(function (e) { 
		e.preventDefault();
		OnHold();
	});

});