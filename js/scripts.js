// Business Logic

const rollWaits = 3000;
const turnWaits = 5000;
let turnCount = 0;

let player = {
	name: "",
	pts: 0,
	ptsThisTurn: 0,
	rollsThisTurn: 0,
	diceRolledThisGame: 0,
};

let cpu = {
	difficulty: "",
	pts: 0,
	ptsThisTurn: 0,
	rollsThisTurn: 0,
	diceRolledThisGame: 0,
};

// Returns true if player's turn, false if CPU's turn
const isPlayersTurn = function () {
	// Player's turn is odd turn number
	if (turnCount % 2 == 1) {
		return true;
	}
	// CPU's turn is even turn number
	return false;
}

// Returns a string for a roll/turn summary
const getSummaryText = function(wantedText, numberRolled) {
	switch (wantedText) {
		case "playerRolled":
			return "You rolled a <b>" + numberRolled + "</b>! You have accumlated <b> " + player.ptsThisTurn + "</b> points this turn. You have a total of <b> " + player.pts + "</b> points."
		case "playerRolled1":
			return "Oh no! You lost your points for this round :( You have a total of " + player.pts + " points.";
		case "playerHeld":
			return "You have <b>held</b> your <b>" + player.ptsThisTurn + "</b> points this turn. You now have a total of <b>" + (player.pts + player.ptsThisTurn) + "</b> points.";
		case "cpuRolled":
			return "CPU <b> rolled</b> a <b>" + numberRolled + "</b>. They have accumlated <b> " + cpu.ptsThisTurn + "</b> points this turn.They have a total of <b> " + cpu.pts + "</b> points.";
		case "cpuRolled1":
			return "CPU <b>lost</b> all their points for this round! They have a total of <b>" + cpu.pts + "</b> points.";
		case "cpuHeld":
			return "CPU has <b>held</b> their <b>" + cpu.ptsThisTurn + "</b> points this turn. They now have a total of <b>" + (cpu.pts + cpu.ptsThisTurn) + "</b> points.";
		case "playerWon":
			return "Congratulations " + player.name + "! You won this game with " + player.pts + " amassed through " + player.diceRolledThisGame + " rolls! GG";
		case "cpuWon":
			return "Ohnoes! The CPU outdid you! CPU earned " + cpu.pts + " amassed through " + cpu.diceRolledThisGame + " rolls. Better luck next  time!";
	}

	return "Null text, you should not be seeing this...";
}

// Starts game
function StartGame() {
	// Set defaults
	turnCount = 0;
	player.name = $("input#playerName").val();
	// player.pts = parseInt($("input#playerStartPts").val());	// This comes in NaN with the placeholder, use tenerary operator below
	player.pts = parseInt($("input#playerStartPts").val()) ? parseInt($("input#playerStartPts").val()) : 0;
	player.rollsThisTurn = 0;
	player.diceRolledThisGame = 0;
	cpu.difficulty = $("#cpuLevel").val();
	cpu.pts = parseInt($("input#cpuStartPts").val()) ? parseInt($("input#cpuStartPts").val()) : 0;
	cpu.ptsThisTurn = 0;
	cpu.rollsThisTurn = 0;
	cpu.diceRolledThisGame = 0;
	
	// Starts game (player's turn)
	NextTurn();

	// Hide setup and show gameplay
	$("#startGame").hide();
	$("#playGame").fadeIn(500);
}

// Goes to next turn
function NextTurn() {
	turnCount++;
	player.rollsThisTurn = 0;
	cpu.rollsThisTurn = 0;

	if (isPlayersTurn()) {
		RollDice();
	}
	// CPU's turn
	else {
		CPUTurn();
	}
}

// Shows or hides gameplay buttons (should only be shown when it's player's turn)
function ShowGameButtons(doShow) {
	if (doShow) {
		$("#gameplayButtons").show();
	}
	else {
		$("#gameplayButtons").hide();
	}
}

// Rolls dice
function RollDice(randNum) {
	if (randNum == null) {
		randNum = Math.floor(Math.random() * (7 - 1) + 1); // Roll random dice number
	}

	if (isPlayersTurn()) {
		$("#playGame h3").html("Turn " + turnCount + " | Roll " + (++player.rollsThisTurn) + ": " + player.name + " Rolls!");
	}
	else {
		$("#playGame h3").html("Turn " + turnCount + " | Roll " + (++cpu.rollsThisTurn) + ": CPU Rolls!");
	}

	let interval;
	$("#diceRolled").show();
	$("#rollSummary").hide();
	ShowGameButtons(false);

	// "Roll" dice by cycling through images
	index = 1;
	interval = setInterval(function() {
		index++;
		if (index >= 6) {
			index = 1;
		}
		document.getElementById("diceRolled").src = "img/dice" + index + ".png";
	}, 50);

	setTimeout(function() {
		clearInterval(interval);
		document.getElementById("diceRolled").src = "img/dice" + randNum + ".png"; // Update dice graphic
		$("#rollSummary").show();

		// If player's turn
		if (isPlayersTurn()) {
			// If a 1 is rolled, lose points this turn
			if (randNum === 1) {
				player.ptsThisTurn = 0;
			}
			else {
				player.ptsThisTurn += randNum;
			}

			player.diceRolledThisGame++;
			ShowGameButtons(true);
		}
		// If CPU's turn
		else {
			// If a 1 is rolled, lose points this turn
			if (randNum === 1) {
				cpu.ptsThisTurn = 0;
			}
			else {
				cpu.ptsThisTurn += randNum;
			}

			cpu.diceRolledThisGame++;
			ShowGameButtons(false);
		}

		// End dice roll
		OnRollEnd(randNum);
	}, 1000);
}

// Outputs roll summary
function OnRollEnd(numberRolled) {
	// If player's turn
	if (isPlayersTurn()) {
		// If earned points this roll
		if (player.ptsThisTurn > 0) {
			$("#rollSummary").html(getSummaryText("playerRolled", numberRolled));
		}
		// If lost points for this roll
		else {
			$("#rollSummary").html(getSummaryText("playerRolled1"));

			ShowGameButtons(false);

			setTimeout(function () {
				NextTurn();
			}, turnWaits);
		}
	}
	// If CPU's turn
	else {
		// If earned points this roll
		if (cpu.ptsThisTurn > 0) {
			$("#rollSummary").html(getSummaryText("cpuRolled", numberRolled));

			setTimeout(function () {
				CPUTurn();
			}, rollWaits);
		}
		// If lost points for this roll
		else {
			$("#rollSummary").html(getSummaryText("cpuRolled1"));

			setTimeout(function () {
				NextTurn();
			}, turnWaits);
		}
	}
}

// Holds points and goes to next turn
function OnHold() {
	// If player's turn
	if (isPlayersTurn()) {
		$("#rollSummary").html(getSummaryText("playerHeld"));

		ShowGameButtons(false);

		// Update score and reset turn data
		setTimeout(function () {
			UpdateScore(player.ptsThisTurn);
			player.rollsThisTurn = 0;
			player.ptsThisTurn = 0;
		}, turnWaits);
	}
	// If CPU's turn
	else {
		$("#rollSummary").html(getSummaryText("cpuHeld"));

		// Update score and reset turn data
		setTimeout(function () {
			UpdateScore(cpu.ptsThisTurn);
			cpu.rollsThisTurn = 0;
			cpu.ptsThisTurn = 0;
		}, turnWaits);
	}

	// Hide dice rolled image to avoid confusion, especially when CPU's turn
	$("#diceRolled").hide();
}

// Updates total points
function UpdateScore(points) {
	// If player's turn
	if (isPlayersTurn()) {
		player.pts += points;
	}
	// If CPU's turn
	else {
		cpu.pts += points;
	}

	// If victory condition is met, end game
	if (player.pts >= 100) {
		EndGame(true);
	}
	else if (cpu.pts >= 100) {
		EndGame(false);
	}
	// If game is continuing, go to next turn
	else {
		NextTurn();
	}
}

// End game fanfare
function EndGame(playerIsWinner) {
	$("#playGame").hide();
	$("#endGame").show();

	if (playerIsWinner) {
		$("#playerWin").html("You won with " + player.pts + " points over " + player.diceRolledThisGame + " rolls! Congrazzles!!");
		$("#playerWin").show();
		$("#playerLose").hide();
	}
	else {
		$("#playerLose").html("CPU won with " + cpu.pts + " points over " + cpu.diceRolledThisGame + " rolls. Better luck next time, " + player.name + "...");
		$("#playerLose").show();
		$("#playerWin").hide();
	}

	$("#newGame").click(function (e) { 
		e.preventDefault();
		$("#endGame").hide();
		$("#startGame").show();
	});
}

// CPU takes their turn
function CPUTurn() {
	// If first roll of turn, force roll
	if (cpu.rollsThisTurn < 1) {
		RollDice();
	}
	else  {
		// If easy difficulty
		if (cpu.difficulty === "Easy") {
			// Always hold any points it gets, no risk taking here!
			OnHold();
		}
		// If normal difficulty
		else if (cpu.difficulty === "Normal") {
			const randNum = Math.round(Math.random()); // Chance to roll or hold

			// Roll
			if (randNum === 0) {
				RollDice();
			}
			// Hold
			else {
				OnHold();
			}
		}
		// If hard difficulty
		else if (cpu.difficulty === "Hard") {
			// If CPU has enough points to win, win
			if (cpu.pts + cpu.ptsThisTurn >= 100) {
				OnHold();
			}
			// Else play turn
			else {
				// TODO: Change hard AI to also play riskier if falling behind player in points!
				const randNum = Math.round(Math.random() * (11 - 0) + 1);

				// Increase chance of holding with the more points CPU has this turn
				const pts = cpu.ptsThisTurn;
				if (pts < 10) {
					if (randNum === 10) {
						OnHold();
					}
					else {
						RollDice();
					}
				}
				else if (pts >= 10) {
					if (randNum >= 7) {
						OnHold();
					}
					else {
						RollDice();
					}
				}
				else if (pts >= 20) {
					if (randNum >= 3) {
						OnHold();
					}
					else {
						RollDice();
					}
				}
				else if (pts >= 30) {
					if (randNum >= 1) {
						OnHold();
					}
					else {
						RollDice();
					}
				}
				else if (pts >= 40) {
					OnHold();
				}
			}
		}
		// If impossible difficulty
		else if (cpu.difficulty === "Impossible") {
			const randNum = Math.floor(Math.random() * (7 - 1) + 1); // Roll random dice number
			
			// Hold if next number will be a 1
			if (randNum === 1) {
				OnHold();
			}
			else {
				RollDice(randNum);
			}
		}
	}
}

// User interface logic

$(document).ready(function () {
	// Start game
	$("form#startGame").submit(function (e) { 
		e.preventDefault();
		StartGame();
	});

	// On click roll button
	$("#roll").click(function (e) { 
		e.preventDefault();
		RollDice();
	});

	// On click hold button
	$("#hold").click(function (e) { 
		e.preventDefault();
		OnHold();
	});
});