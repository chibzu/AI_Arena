no_op = {
	name: "No Op",
	image: "http://images1.wikia.nocookie.net/__cb20120627233815/pokemon/images/3/3c/Pikachu_BW.gif",
	color: "#000000",
	startPositions: [{x:0,y:0},{x:1,y:0},{x:0,y:BOARD_HEIGHT-1},{x:1,y:BOARD_HEIGHT-1},{x:0,y:2}],
	getAction: function(status, area){
		return PASS;
	}
}

window.gladiators.push(no_op);