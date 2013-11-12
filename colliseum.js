console.log("Setting up constants");
//game constants
BOARD_HEIGHT = 10;
BOARD_WIDTH = 15;
SPAWN_WIDTH = 2;
FOOD_COUNT = 5;
FOOD_BUFFER = 2;
TEAM_SIZE = 5;

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

//game tracking objects
var colliseum = [];
gladiators = [];

var food = [];

var homeTeam = [];
var awayTeam = [];

window.addEventListener("load", function(e){
	console.log("Setting up team areas");
	var homeSelect = document.getElementById("home_select");
	var awaySelect = document.getElementById("away_select");
	for (i=0; i<gladiators.length; i++){
		var opt = document.createElement("option");
		opt.innerHTML = gladiators[i]["name"];
		opt.value = i;
		homeSelect.appendChild(opt);
		
		opt = document.createElement("option");
		opt.value = i;
		opt.innerHTML = gladiators[i]["name"];
		awaySelect.appendChild(opt);
	}
	awaySelect.selectedIndex = 1;
	
	document.getElementById("home_load").addEventListener("click", 
		function(){loadTeam("home")}
	);
	document.getElementById("away_load").addEventListener("click", 
		function(){loadTeam("away")}
	);
	
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
	var spawnedFood = {};
	for (var i=0; i<FOOD_COUNT; i++){
		var x,y;
		do {
			x = Math.floor((Math.random() * (BOARD_WIDTH - (FOOD_BUFFER*2) - (SPAWN_WIDTH*2))) + SPAWN_WIDTH + FOOD_BUFFER);
			y = Math.floor(Math.random() * BOARD_HEIGHT);
		}
		while (spawnedFood[""+x+y] !== undefined);
		spawnedFood[""+x+y] = "spawned";
		food.push({x:x, y:y});
		var foodIcon = document.createElement("div");
		foodIcon.className = "food";
		document.querySelector(".row"+y+".col"+x).appendChild(foodIcon);
	}	
	
});

function loadTeam(team) {
	console.log("Loading " + team + " team");
	var roster = (team == "home" ? homeTeam : awayTeam);
	
	var army = gladiators[parseInt(document.getElementById(team+"_select").value)]
	console.log("Placing " + army.name + "s");
	
	for (i=0; i<TEAM_SIZE; i++){
		var fighter = {id: i};
		if (team == "home"){
			fighter["x"] = army["startPositions"][i]["x"];
			fighter["y"] = army["startPositions"][i]["y"];
		}
		else {
			fighter["x"] = (BOARD_WIDTH - 1 - parseInt(army["startPositions"][i]["x"]));
			fighter["y"] = army["startPositions"][i]["y"];
		}
		
		var fighterIcon = document.createElement("div");
		fighterIcon.className = "fighter";
		fighterIcon.style["background-color"] = army["color"];
		document.querySelector(".row"+fighter["y"]+".col"+fighter["x"]).appendChild(fighterIcon);
		
		fighter["icon"] = fighterIcon;
		
		roster.push(fighter);
	}
	console.log(roster);
}




























