console.log("Setting constants");
//game constants
BOARD_HEIGHT = 10;
BOARD_WIDTH = 15;
FOOD = 5;

//directions
NORTH = 0;
SOUTH = 1;
EAST = 2;
WEST = 3;

//actions
ROTATE_CW = 10;
ROTATE_CCW =11;
ATTACK = 12;
PASS = 13;
WALK = 14;

//arena state
WALL = 20;
EMPTY = 21;
ENEMY = 22;
FOOD = 23;

var colliseum = [];

var food = [];

var homeTeam = [];
var awayTeam = [];

window.addEventListener("load", function(e){
	console.log("Building battlefield UI");
	var field = document.getElementById("battlefield");
	
	for (i=0; i<BOARD_HEIGHT; i++){
		for (j=0; j<BOARD_WIDTH; j++){
			var cell = document.createElement("div");
			cell.className = "battlefield_cell row" + i + " col" + j;
			field.appendChild(cell);
		}
		field.appendChild(document.createElement("br"));
	}
	
	console.log("Setting up game logic");
	for (i=0; i<BOARD_HEIGHT; i++){
		colliseum.push([]);
		for (j=0; j<BOARD_WIDTH; j++){
				colliseum[i].push({});
		}		
	}
	
	console.log("Spawning food");
	
});