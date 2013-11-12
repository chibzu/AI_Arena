<html>
	<head>
		<script type='text/javascript' src='/colliseum.js'></script>
		<link rel='stylesheet' type='text/css' href='/colliseum.css'/>
		
<?php 
	$gladiator_files = scandir(getcwd() . DIRECTORY_SEPARATOR . "gladiators");
	for ($i=0; $i<count($gladiator_files); $i++){
		if (strpos($gladiator_files[$i], ".js") !== false) {
			echo("\t\t<script type='text/javascript' src='/gladiators/" . $gladiator_files[$i] . 	"'></script>\n");
		}
	}
	echo("\n");
?>
	</head>
	<body>	
		<div id='home_team' class='roster'>
			Home Team<br/>
			<select id='home_select'></select><br/>
			<button id='home_load'>Load</button>
		</div>
		
		<div id='away_team' class='roster'>
			Away Team<br/>
			<select id='away_select'></select><br/>
			<button id='away_load'>Load</button>
		</div>
		
		<div id='battlefield'>	
		</div>
		
		

	</body>
</html>
	