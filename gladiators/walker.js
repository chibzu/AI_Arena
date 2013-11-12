walker = {
	name: "Walker",
	color: "#A56F04",
	startPositions: [{x:0,y:0},{x:1,y:0},{x:0,y:BOARD_HEIGHT-1},{x:1,y:BOARD_HEIGHT-1},{x:0,y:2}],
	getAction: function(area){
		return PASS;
	}
}

window.gladiators.push(walker);