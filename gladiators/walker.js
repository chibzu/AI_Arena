walker = {
	name: "Walker",
	color: "#A56F04",
	startPositions: [{x:0,y:1},{x:1,y:0},{x:0,y:BOARD_HEIGHT-1},{x:1,y:BOARD_HEIGHT-2},{x:0,y:2}],
	getAction: function(status, area){
		walker.toggle = !walker.toggle;
		return (walker.toggle ? WALK : ATTACK);
	},
	toggle: true
}

window.gladiators.push(walker);