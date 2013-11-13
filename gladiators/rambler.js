rambler = {
	name: "Rambler",
	color: "#894BE6",
	startPositions: [{x:0,y:0},{x:1,y:0},{x:0,y:BOARD_HEIGHT-1},{x:1,y:BOARD_HEIGHT-1},{x:0,y:2}],
	getAction: function(status, area){
		var choice = Math.random();
		if (choice < 0.33)
			return WALK;
		if (choice < 0.66)
			return ROTATE_CCW;
		else
			return ROTATE_CW;
	}
}

window.gladiators.push(rambler);