<html>
    <head>
		<meta name="viewport" content="user-scalable=0">
		
		<link rel="stylesheet" type="text/css" href='css/tetris.css'>
		<link rel="icon" type="image/png" href="img/logo.png"/>
		
		<h1>Nikolaos Kyknas</h1>
    </head>

    <body style="text-align: center;">

        <canvas id="canvas" width="350" height="525" style="border:1px solid #000000;"></canvas>
        <canvas id="nextBlock" width="175" height="175" style="border:1px solid #000000;"></canvas>

        <div id="player">
			<h1>Score</h1>
			<h2 id="score">00000000</h2>
			<button id="restart" type="button" onclick="restart()">Restart</button>

			<h2 class="hidden">Player: </h2>
			<p id="playername" class="hidden"  type="text">name</p><br><br>
		</div>

        <div id="highscore">
			<h1><u>High Scores</u></h1>
			<p id="scores">Coming...</p>
		</div>

        <div id="keypad" style="display: none;">

			<button id="left" class="mobilekeys" type="button" onclick="keypad('left')" ><i class="arrow left"></i></button>
			<button id="right" class="mobilekeys" type="button" onclick="keypad('right')" ><i class="arrow right"></i></button><br><br>
			<button id="down" class="mobilekeys" type="button" onclick="keypad('down')"><i class="arrow down"></i></button>
			<button id="rotate" class="mobilekeys" type="button" onclick="keypad('rotate')">Rotate Brick</button>

		</div>

        <script src="js/tetris.js"></script>
    </body>
</html>
