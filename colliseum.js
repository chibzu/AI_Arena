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
EAST = 1;
SOUTH = 2;
WEST = 3;
COMPASS = ['north', 'east', 'south', 'west'];

//actions
ROTATE_CW = 10;
ROTATE_CCW = 11;
ATTACK = 12;
PASS = 13;
WALK = 14;

//arena state
WALL = 20;
EMPTY = 21;
ENEMY = 22;
FOOD = 23;
SELF = 24;
ALLY = 25;

//game tracking objects
var colliseum = [];
var gladiators = [];

var food = [];

var homeTeam = [];
var homeCount = TEAM_SIZE;
var homeScore = 0;
var awayTeam = [];
var awayCount = TEAM_SIZE;
var awayScore = 0;
var turnsLeft = 100;

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
	awaySelect.selectedIndex = 2;
	
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
	document.getElementById("home_count").innerHTML = homeCount;
	document.getElementById("away_count").innerHTML = awayCount;
	document.getElementById("turns_left").innerHTML = turnsLeft;
	
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
		var foodModel = {x:x, y:y, name:"food"};
		food.push(foodModel);
		var foodIcon = document.createElement("div");
		foodIcon.className = "food";
		foodIcon.model = foodModel;
		document.querySelector(".row"+y+".col"+x).appendChild(foodIcon);
	}	

	document.getElementById("start_button").addEventListener("click", startGame);
	loadTeam("home");
	loadTeam("away");
});

function loadTeam(team) {
	console.log("Loading " + team + " team");
	var roster = (team == "home" ? homeTeam : awayTeam);
	
	var army = gladiators[parseInt(document.getElementById(team+"_select").value)]
	console.log("Placing " + army.name + "s");
	
	for (i=0; i<TEAM_SIZE; i++){
		var fighter = {id: i};
		var fighterIcon = document.createElement("div");
		fighter["name"] = army["name"];
		fighter["team"] = team;
		fighter["getAction"] = army["getAction"];
		fighterIcon["model"] = fighter;
		if (team == "home") {
			fighter["x"] = army["startPositions"][i]["x"];
			fighter["y"] = army["startPositions"][i]["y"];
			fighter["bearing"] = EAST;
			fighterIcon.className = "fighter east";
		}
		else {
			fighter["x"] = (BOARD_WIDTH - 1 - parseInt(army["startPositions"][i]["x"]));
			fighter["y"] = army["startPositions"][i]["y"];
			fighter["bearing"] = WEST;
			fighterIcon.className = "fighter west";
		}
		
		if (army["image"])
			fighterIcon.style["background-image"] = "url("+army["image"]+")";
		else
			fighterIcon.style["background-color"] = army["color"];
		document.querySelector(".row"+fighter["y"]+".col"+fighter["x"]).appendChild(fighterIcon);
		
		fighter["icon"] = fighterIcon;
		
		roster.push(fighter);
	}
}

function startGame(){
	try{
	var turnOrder = homeTeam.concat(awayTeam);
	turnOrder = shuffleArray(shuffleArray(turnOrder));
	
	while(turnOrder.length > 0){
		var currentFighter = turnOrder.pop();
		if (currentFighter["dead"] || currentFighter["icon"].className.indexOf("dead") > -1){
			currentFighter["dead"] = true;
			continue;
		}
		
		//build the fighter's view
		var view = getView(currentFighter);
		console.log(currentFighter.name);
		console.log(view);
		
		var result = currentFighter["getAction"]({id: currentFighter["id"], x:currentFighter["x"], 
		y:currentFighter["y"], alliesAlive:(currentFighter["team"]=="home"?homeCount:awayCount)},view);
		console.log(result);
		switch(result) {
			case WALK:
				//console.log("moving fighter from " + currentFighter["x"] + "," + currentFighter["y"]);
				var newX = currentFighter["x"]; 
				var newY = currentFighter["y"];
				switch(currentFighter["bearing"]) {
					case NORTH:
						newY = Math.max(0, currentFighter["y"]-1);
						break;
					case EAST:
						newX = Math.min(BOARD_WIDTH-1, currentFighter["x"]+1);
						break;
					case SOUTH:
						newY = Math.min(BOARD_HEIGHT-1, currentFighter["y"]+1);
						break;
					case WEST:
						newX = Math.max(0, currentFighter["x"]-1);
						break;
				}
				//console.log("to " + currentFighter["x"] + "," + currentFighter["y"]);
				var destination = document.querySelector(".row"+newY+".col"+newX);
				if (destination && !destination.hasChildNodes()){
					currentFighter["icon"].parentNode.removeChild(currentFighter["icon"]);
					destination.appendChild(currentFighter["icon"]);
					currentFighter["x"] = newX;
					currentFighter["y"] = newY;
				}
				break;
			case ATTACK:
				var targetX = currentFighter["x"]; 
				var targetY = currentFighter["y"];
				switch(currentFighter["bearing"]) {
					case NORTH:
						targetY = Math.max(0, currentFighter["y"]-1);
						break;
					case EAST:
						targetX = Math.min(BOARD_WIDTH-1, currentFighter["x"]+1);
						break;
					case SOUTH:
						targetY = Math.min(BOARD_HEIGHT-1, currentFighter["y"]+1);
						break;
					case WEST:
						targetX = Math.max(0, currentFighter["x"]-1);
						break;
				}
				var target = document.querySelector(".row"+targetY+".col"+targetX);
				if (target.hasChildNodes() && target.firstChild.model != currentFighter){
					target.firstChild.className += " dead";
					reportDeath(target.firstChild.model.team == "home" ? "home" : "away");
					if (target.firstChild.model.team != currentFighter.team)
						scorePoint(currentFighter.team);
					target.removeChild(target.firstChild);
				}
				break;
			case ROTATE_CW:
				currentFighter["bearing"] = ((currentFighter["bearing"]+1)%4);
				currentFighter["icon"].className = currentFighter["icon"].className.replace(/(north|east|south|west)/, COMPASS[currentFighter["bearing"]]);
				break;
			case ROTATE_CCW:
				currentFighter["bearing"] = ((currentFighter["bearing"]+3)%4);
				currentFighter["icon"].className = currentFighter["icon"].className.replace(/(north|east|south|west)/, COMPASS[currentFighter["bearing"]]);
				break;
			default:
				break;
		}
	}
	decrementTurn();
	if (turnsLeft == 0)
		alert("game over!");	
	else
		setTimeout(startGame, 100);
	}
	catch(e){
		alert("error");
		console.log(e);
		console.log(e.stack);
	}
}

//Helper functions
//---------------------------------------------------------------------------------------------------
function getView(currentFighter) {
	var view = [];
	for (i=-1; i<2; i++){
		view.push([]);
			for (j=-1; j<2; j++){
				var targetX = (currentFighter["x"]+j);
				var targetY = (currentFighter["y"]+i);
				if (i == 0 && j == 0)
					view[view.length-1].push({type:SELF});
				else if (targetX < 0 || targetX >= BOARD_WIDTH ||
					targetY < 0 || targetY >= BOARD_HEIGHT) {
						view[view.length-1].push({type:WALL});
				}
				else {
					var targetSquare = document.querySelector(".row"+targetY+".col"+targetX);
					if (targetSquare.hasChildNodes()){
						if (targetSquare.firstChild.model.name == "food")
							view[view.length-1].push({type:FOOD})	
						else if (currentFighter.name == targetSquare.firstChild.model.name)
							view[view.length-1].push({type:ALLY, id:targetSquare.firstChild.model.id,
								bearing:targetSquare.firstChild.model.bearing});
						else {
							var enemy = targetSquare.firstChild.model;
							var enemyInfo = {type:ENEMY};
							view[view.length-1].push();			
							if ((i == -1 && j == 0 && enemy["bearing"] == SOUTH) ||
								(i == 1 && j == 0 && enemy["bearing"] == NORTH) ||
								(i == 0 && j == -1 && enemy["bearing"] == EAST) ||
								(i ==0 && j == 1 && enemy["bearing"] == WEST))
								enemyInfo["canAttackMe"] = true;
							else
								enemyInfo["canAttackMe"] = false;
							
							view[view.length-1].push(enemyInfo);
						}
					}
					else
						view[view.length-1].push({type:EMPTY});
				}
			}
	}
	return view;
}

function reportDeath(team){
	if (team == "home"){
		homeCount--;
		document.getElementById("home_count").innerHTML = homeCount;
	}
	else{
		awayCount--;
		document.getElementById("away_count").innerHTML = awayCount;
	}
}

function scorePoint(team){
	if (team == "home"){
		homeScore++;
		document.getElementById("home_score").innerHTML = homeScore;
	}
	else{
		awayScore++;
		document.getElementById("away_score").innerHTML = awayScore;
	}
}

function decrementTurn(){
	turnsLeft--;
	document.getElementById("turns_left").innerHTML = turnsLeft;
}

/**
 * Randomize array element order in-place.
 * Using Fisher-Yates shuffle algorithm.
 */
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}























