//
//		Name:   Horse Jumping
//		Author: Ryan Stroebel
//		Date: June 12, 2018
//		Purpose: A game where a horse avoids obstacles
//

  var horseTop = 280; // horse top location
  var distance = 0; // distance the horse is in the air
  var direction = 2; // direction the horse is jumping
  var jump = true; // check if the horse is jumping
  var start = true; // check if the game has started
  var obstacle = 0; // which obstacle is active
  var oImg; // obstacle image
  var obstacleDistance = 780; // distance the obstacle is from the left side of the screen
  var horseRight = 120; // horse right location
  var obstacleHeight = 0; // height of obstacle
  var horseBottom = 380; // bottom of horse
  var obstacleSpeed = 0; // extra speed of obstacle
  var duck = false; // check if the horse is ducking
  var horseHeight = 0; // height of the horse
  var obstacleBottom = 125; // bottom of the obstacle
  var count = 0; // times the program has updated
  var speed = 10; // speed of updates
  var updateTimer = 0; // ID to stop and start updates
  var flash = false; // if the score is flashing
  var victory = false; // if the user has won
  var cloudDistance = 0; // distance the clouds are from the left of the screen
  var groundDistance = 0; // distance the ground is from the left of the screen
  var continueCount = 0; // times continue has been run

// load the game
function contentLoaded () {
	gamebackground = document.getElementById("gamebackground"); // background of the game
	horse = document.getElementById("horse"); // the horse
	score = document.getElementById("score"); // the score
	wStart = document.getElementById("instructions"); // the black text at the top of the screen
	restart = document.getElementById("gamestart"); // the restart, start, and keep going button
	clouds = document.getElementById("clouds"); // the clouds
	ground = document.getElementById("ground"); // the ground
	
	// hide the start button
	restart.style.visibility = "hidden";
	
	// start listening for key presses
	var chars = new Array();
    var container = document.getElementById('container');
	
	// if a key is pressed
    window.addEventListener('keypress', function (e) {
		
		// if W or w is pressed
		if ((e.keyCode === 119 || e.keyCode === 87) && duck === false) {	
		
			// start the game if it hasn't started
			if (start === true) {
				updateTimer = setInterval(update, 10); // this updates the game
				start = false;
				wStart.innerHTML = "";
				horse.setAttribute('src', 'horse.gif');
				
			// jump if the user is not already jumping
			} else if (jump === true) {
				direction = 0;
				jump = false;
			}
        }
		
		// if S or s is pressed
		if (e.keyCode === 83 || e.keyCode === 115) {
			
			// duck if the user is not jumping
			if (jump === true) {
				duck = true;
				horseTop = 330;
			}
		}
    }, false);
	
	// if a key is released
	window.addEventListener('keyup', function (e) {
		
		// if the key is S or s, stop ducking
		if (e.keyCode === 83 || e.keyCode === 115) {
			duck = false;
			horseTop = 280;
		}
	}, false);
} // end of contentLoaded

// update the game
function update() {
	
	// speed up on certain intervals if the player hasn't won yet
	if(count%2000 === 0 && count > 1 && victory === false) {
		speed--
		clearInterval(updateTimer);
		updateTimer = setInterval(update, (speed));
		flash = true;	
	}
	
	// flash the score after an interval
	if(count%400 === 0 && count%2000 !== 0) {
		flash = false;
	}
	
	// update the horse ducking
	horseDuck();
	
	// if the horse is jumping, update the jump
	if(direction !== 2) {
		horseJump();
	}
	
	// if the player reaches over a score and there is no obstacle, they win.
	if (count > 10000 && obstacle === 0 && victory === false) {
		clearInterval(updateTimer);
		updateTimer = setInterval(winUpdate, 10);
		return;
	}
	
	// move the background
	moveBackground();
	
	// create an obstacle if there is none
	if(obstacle === 0) {
		obstacle = parseInt(1 + Math.random() * 7);
		oImg = document.createElement("img");
		oImg.setAttribute('src', 'obstacle' + obstacle + '.png'); 
		oImg.setAttribute('alt', 'na');
		oImg.style.position = 'absolute';
		oImg.style.left = '780px';
		
		// set properties of the obstacle
		switch(obstacle) {
			case 1: 
			obstacleHeight = 336;
			obstacleBottom = 375;
			break;
			case 2:
			obstacleHeight = 295;
			obstacleBottom = 375;
			break;
			case 3:
			obstacleHeight = 270;
			obstacleBottom = 375;
			oImg.setAttribute('height', '105px');
			break;
			case 4:
			obstacleHeight = 230;
			obstacleBottom = 259;
			obstacleSpeed = 2;
			break;
			case 5:
			obstacleHeight = 280;
			obstacleSpeed = 1;
			obstacleBottom = 320;
			break;
			case 6:
			obstacleHeight = 295;
			obstacleBottom = 375;
			break;
			case 7:
			obstacleHeight = 230;
			obstacleSpeed = 1;
			obstacleBottom = 320;
			break;
	}
		oImg.style.top =  obstacleHeight + 'px'; // '125px';
		gamebackground.appendChild(oImg);
		
	// if there is an obstacle, update its position
	} else {
		obstacleDistance = obstacleDistance - 5 - obstacleSpeed;
		oImg.style.left = obstacleDistance + "px";
		
		// if the obstacle goes past the player, delete it
		if(obstacleDistance < 0) {
			obstacle = 0;
			obstacleDistance = 780;
			obstacleSpeed = 0;
			oImg.parentNode.removeChild(oImg);
		}
	}
	
	// make sure the horse is not hitting an obstacle
	if(obstacleDistance + 10 > horseRight || 
	(horseBottom - 100 + horseHeight > obstacleBottom || 
	horseBottom < obstacleHeight)) {
		
	// if the horse is hitting an obstacle, the player loses
	} else {
		horse.setAttribute('src', 'horseded.png');
		horse.setAttribute('height', '100px');
		horse.style.top = '340px';
		clearInterval(updateTimer);
		score.innerHTML = "Your final score was: " + parseInt(count/5);
		restart.innerHTML = "Restart?";
		restart.onclick = function () {location.reload();};
		restart.style.visibility = "visible";
		return;
	}
	count++;
	
	// update the score text
	if(flash === false) {
		score.innerHTML = parseInt(count/5) ;
		
	// flash the score text if needed
	} else if(count % 20 > -1 && count % 20 < 10) {
		score.innerHTML = parseInt(count/5);
	} else {
		score.innerHTML = "";
	}
} // end of update

// if the player is about to win, update for that
function winUpdate() {
	
	// if there is no flag (finish line), create one
	if(obstacle === 0) {
		victory = false;
		oImg.setAttribute('src', 'finish.png'); 
		oImg.setAttribute('alt', 'na');
		oImg.style.position = 'absolute';
		oImg.style.left = '700px';
		oImg.style.top = '280px';
		gamebackground.appendChild(oImg);
		obstacle = -1;
		obstacleDistance = 700;
		
	// if there is a flag (finish line), move it closer
	} else {
		obstacleDistance = obstacleDistance - 5;
		oImg.style.left = obstacleDistance + "px";
		
		// if the horse is close enough to the flag, the player wins
		if(obstacleDistance + 10 < horseRight) {
			clearInterval(updateTimer);
			wStart.innerHTML = "Congratulations! You Win!";
			restart.innerHTML = "Keep Going?";
			restart.onclick = function () {continueGame();};
			restart.style.visibility = "visible";
		} 
	}
	
	// continue basic functions of jumping, background moving, and ducking
	moveBackground();
	horseDuck();
	if(direction !== 2) {
		horseJump();
	}
} // end of winUpdate

// move the horse up or down
function horseJump() {
	
	// if the horse should go up
	if(direction === 0) {
		
		// the next 3 if statements move the horse up a certain amount based on where it is
		if(distance < 56) {
			distance = distance + 7;
		}
		if(distance < 112 && distance >= 56) {
			distance = distance + 4;
		}
		if(distance >= 112) {
			distance = distance + 2;	
		}
		
		// if the horse is at the top if its arc, change the direction
		if (distance === 156) {
			direction = 1;
		}
		
	// if the horse should go down
	} else {
		
		// the next 3 if statements move the horse down a certain amount based on where it is
		if(distance > 112) {
			distance = distance -2 ;
		}
		if(distance <= 112 && distance > 56) {
			distance = distance - 4;
		}
		if(distance <=56) {
			distance = distance - 7;
		}
		
		// if the horse is at the ground again
		if (distance === 0) {
			direction = 2;
			jump = true;
		}
	}
	horseBottom = 380 - distance - horseHeight;
	horse.style.top = (horseTop - distance) + "px";
} // end of horseJump


// duck the horse
function horseDuck () {
	
	// if the horse is ducking, change its size
	if(duck === true) {
		horse.setAttribute('height', '50px');
		horseHeight = 50;
		horse.style.top = horseTop + "px";
		
	// if the horse is not ducking, change its size back to normal
	} else {
		horse.setAttribute('height', '100px');
		horseHeight = 0;
		horse.style.top = horseTop + "px";
	}
} // end of horseDuck

// start the game again if the user keeps going after winning
function continueGame () {
	victory = true;
	speed--;
	clearInterval(updateTimer);
	updateTimer = setInterval(slowStart, 5);
	flash = true;
	oImg.parentNode.removeChild(oImg);
	obstacleDistance = 780;
	obstacle = 0;
	wStart.innerHTML = "";
	restart.innerHTML = "";
	restart.style.visibility = "hidden";
	horse.setAttribute('src', 'horsewin.gif');
}// end of continueGame

// give the player time to react
function slowStart () {
	
	//keep basic functions like controls and background movement
	moveBackground();
	horseDuck();
	if(direction !== 2) {
		horseJump();
	}
	
	// if slowstart has run 150 times
	if(continueCount === 150) {
		clearInterval(updateTimer);
		updateTimer = setInterval(update, (5));
	}
	continueCount++;
} // end of slowStart



// move the background image
function moveBackground () {
	cloudDistance = cloudDistance - 2;
	clouds.style.left = cloudDistance + "px";
	
	// if the clouds are at a certain place, return them to their starting location
	if(cloudDistance === -800) {
		cloudDistance = 0;
	}
	groundDistance = groundDistance - 5;
	ground.style.left = groundDistance + "px";
	
	// if the ground is at a certain place, return them to their starting location
	if(groundDistance === -800) {
		groundDistance = 0;
	}
} // end of moveBackground