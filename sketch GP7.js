// DECLARE VARIABLES
// Character & Character Movement
let gameChar = {};
let lives_count;

// Shared canvas size and ground level
const shared = {
	width: 1200,
	height: 720,
};
const ground_level = shared.height*0.82;
const surfaceDept = (shared.height - ground_level)/3;

// Space and Time related variables
const dayCircle = 10; // -> How many seconds sun and moon complete its circle
let risetime;
let scrollPos;
let dayTime; // night or day.
let death_reset;
let fps = 60;

// Objects & Graphics
// Clouds
let clouds = {
	cloudsXpos: [100, 420, 510, 800, 1020, 1200, 1450, 1600, 1800, 2000, 2100, 2320, 2510, 2900, 3100, 3250, 3500],
	properties: [],
};

// Moutains
let mountains = {
	xPos: [500, 1300, 1600],
	properties: []
};

// Waterfall
let waterfalls = {
	xPos: [2400],
	size: [408],
	properties: [],
	effect: false,
}

// Canyons
let canyons = {
	xPos: [550, 1500, 1700],
	size: 120,
	properties: [],
	dept: 0,
}

let canyonFire = {
    size: 100,
	burningParticle: [],
}

let deathBy_falling; // To fix a bug where gameChar can still move underground after falling into the Canyon
let deathBy_enemy;

// River
let lakes = {
	xPos: [2200],
	size: 900,
	properties: [],
	dept: 0,
}
let img_rockborder;

// Trees and bushes
let bushes = {
	xPos: [200, 400, 800, 1300, 1600, 1800],
	properties: [],
	size: 80,
}

let trees = [];
let red_trees = {
	xPos: [650, 920, 1050, 1180, 1530, 1680, 3150, 3350],
	properties: {
		trunkWidth: 65,
		trunkHeight: 140,
	}
}

let green_trees = {
	xPos: [200, 450, 820, 1250, 1400, 1600, 1800, 2000, 3250, 3300],
	properties: {
		trunkWidth: 60,
		trunkHeight: 120,
	}
}

// Collectibles
let collectible = {
	xPos: [500, 1200, 800, 1650, 1000],
	yPos: [150, 300, 50, 50, 500], // ingame height = ground level minus yPos. so yPos = 0 is at ground level
	properties: [],
	reset:[], // stored for game reset
	size: 60,
	allFound: false,
}

// Platform
let platforms = {
	xPos: [400, 1150, 1300, 2000],
	yPos: [100, 200, 100, 120], //ingame height = ground level minus yPos. so yPos = 0 is at ground level
	size: 140,
	thickness: 30,
	properties: []
}

let vertical_platforms = {
	xPos: [2200, 2500, 2800, 940],
	yPos: [150, 150, 150, 150], //ingame height = ground level minus yPos. so yPos = 0 is at ground level
	range: [[500, 200], [550, 150], [500, 200], [300, 200]], //vertical range from the top of the screen
	size: 140,
	thickness: 30,
	properties: []
}

// Enemies
let enemies = {
	xPos: [450, 850, 1370, 2000, 2400, 2700],
	yPos: [0, 0, -100, 0, -200, -200],
	yRange: [30, 50, 30, 50, 150, 150], // The entire range of Vertical movement.
	xRange: [50, 150, 70, 60, 30, 30], //Horizontal displacement range
	duration:[[4],[3],[3],[2],[3],[3]], // time to complete 1 range of movement determine the speed of each enemies
	properties: [],
	reset: [],
}
let img_enemyWing;

// Fire spirit
let fireSpirit = {
	x: undefined, 
	y: undefined,
	size: 50,
}

// Explosions
let explosions = {
	properties: [],
	xPos: undefined,
	yPos: undefined,
	start: undefined,
	stop: undefined,
	set: undefined,
};

let water_bubbles = {
	properties: [],
	size: 10,
	yPos: undefined,
}

let water_ripple = {
	properties: [],
	size: 10,
	xStart: undefined,
	yStart: undefined,
}

// surface - platform
let on_platform = false;

// StarrySky
let starrySky;

// Fonts and Music
let manaSpace;
let sound_Maintheme;

// Game states
let gameStage;
let newStage;

// Each collectibles equal 50 points; each enemy equal 100 points; 
let gameScore = 0;

// Flagpole
let flag_pole ={};
let img_collectible;

function preload()
{
	// fonts
	manaSpace = loadFont('../assets/manaspc.ttf');

	// music
	soundFormats('mp3', 'wav');
	sound_Maintheme = loadSound('../assets/Enchanted Festival');
	sound_Maintheme.setVolume(0.18);

	sound_Jump = loadSound('../assets/Jump');
	sound_Jump.setVolume(0.2);

	sound_enemyExplode = loadSound('../assets/EnemyExplode');
	sound_enemyExplode.setVolume(0.2);

	sound_collectArtifact = loadSound('../assets/ArtifactCollect');
	sound_collectArtifact.setVolume(0.3);

	sound_charKilled = loadSound('../assets/charKilled');
	sound_charKilled.setVolume(0.2);

	sound_fallingDeath = loadSound('../assets/fallingDeath');
	sound_fallingDeath.setVolume(0.15);

	sound_finishLevel = loadSound('../assets/finishStage');
	sound_finishLevel.setVolume(0.12);

	// images
	img_collectible = loadImage('../assets/collectible.png');
	img_enemyWing = loadImage('../assets/enemyWing.png');
	img_rockborder = loadImage('../assets/rockborder.png');

	// Credits
	// Text Font: manaspace by codeman38
	// Background music: Enchanted Festival by Matthew Pablo"
}

function setup() 
{	
	// Canvas, frameRate and the graphics
	frameRate(fps);
	createCanvas(shared.width, shared.height);
	core_prep_graphics();

	// Start game properties
	death_reset = false;
	lives_count = 3;
	start_game("intro");
}

function draw() 
{	
	// Game State	
	gameStage = newStage;

	// Introduction state (gameState: "intro")
	if (gameStage == "intro") 
	{
		background(0, 0, 0);
		fill(255, 255, 255);
		textSize(32 * (shared.width/ 1600)); // Original text size was set on a 1600 width canvas.
		text("Game Project by Mike Ngo. Student ID: 210545366", width*0.2, height*0.25);
		text("Press W A S D or ARROW KEYS to move", width*0.2, height*0.45);
		text("Press Spacebar to jump", width*0.2, height*0.55);
		text("Press J and K to attack after collecting all artifacts", width*0.2, height*0.65);
		text("Click on the screen to continue", width*0.2, height*0.85);
	}
	
	// Play State (gameState: stage1)
	if (gameStage == "stage1")
	{	
		if (lives_count < 1)
		{	
			fill(255);
			textSize(20 * (shared.width/ 1600));
			rect(width * 0.3, height * 0.46, width * 0.35, height * 0.0625);
			fill(80, 80, 80);
			text("Game Over. Press space to continue", width * 0.32, height * 0.5);
			death_reset = true;
			return;
		}

		if (flag_pole.isReached == true)
		{	
			fill(255);
			textSize(20 * (shared.width/ 1600));
			rect(width * 0.3, height * 0.46, width * 0.32, height * 0.1);

			fill(80, 80, 80);
			text("Congratulations! Level completed !", width * 0.32, height * 0.5);
			text("Game score: " + gameScore, width * 0.32, height * 0.55);
			return;
		}

		// Timing and Backdrop drawing - The sky, the sun, the moon and the ground.
		core_calculate_Time();
		core_draw_backdrop();

		// Things rendered after this will have their coordinates translated. and will "not" move visually from the Char viewpoint.
		push(); 
		// Prevent character from going out of bounds on the left side. You have to keep going ahead in life baby!
		scrollPos = min(50, scrollPos); 
		translate(scrollPos, 0);
		
		core_renderWorld();
		
		core_check_collision();
		pop();
		// End translate
	
		// Check achievements 
		core_check_achievement();
		
		// Check and Execute Movement
		core_move_gameChar();
		module_check_death();
	}
}

function start_game(stage)
{
	risetime = 0.5;
	scrollPos = 0;
	deathBy_enemy = false;
	deathBy_falling = false;
	gameChar.ability_fire = false;
	artifacts_collected = 0;

	// Reset collectibles
	for (let i = 0; i < collectible.reset.length; i++)
	{
		collectible.properties[i] = collectible.reset[i];
	}

	// Reset enemies
	for (let i = 0; i < enemies.reset.length; i++)
	{
		enemies.properties[i] = enemies.reset[i];
	}

	// Reset flag point
	flag_pole.flagY = flag_pole.flagYreset;

	// Game States and prep 
	newStage = stage;
	textFont(manaSpace);
	getAudioContext().resume();

	// flag pole
	flag_pole = {
		xPos: 3400,
		yPos: 300,
		isReached: false,
		flagY: 300,
		flagYreset: 300,
		flagSize: 45
	}

	/* ***** RENDER GAME CHARACTER ***** */
	gameChar = {
		xPos: width/4,
		yPos: ground_level,
		isFalling: false,
		isPlummeting: false,
		isLeft: false,
		isRight: false,
		ability_fire: false,
		attack_range: 100,
		moveSpeed: 3,
		width: 40,
		height: 50,
		eyeMoveAmt: undefined,

		/* ***** STANDING ***** */
		render_standing: function()
		{	
			push();
			noStroke();
			this.eyeMoveAmt = 0;
			checkDirectionX = (x) => ((x >= 0) ? '1' : '-1'); // checkDirection to set the tail coordinate accordingly;
			let k = checkDirectionX(this.eyeMoveAmt);
			let j = 1;

			// The tail
			// tail point [this.xPos - this.width * k, this.yPos - this.height * 0.5] // k is either 1 or -1
			fill(255, 140, 0);
			beginShape();
			vertex(this.xPos, this.yPos - this.height * 0.1); // tail bone
			bezierVertex(this.xPos - this.width * k * 0.7, this.yPos, this.xPos - this.width * k * 0.8, this.yPos - this.height * 0.1, this.xPos - this.width * k, this.yPos - this.height * 0.5);
			endShape(CLOSE);

			// The ears
			let right_ear_x = this.xPos - this.width * 0.45 - this.eyeMoveAmt;
			let right_ear_y = this.yPos - this.height * 0.9;
			let left_ear_x = this.xPos + this.width * 0.45 - this.eyeMoveAmt;
			let left_ear_y = this.yPos - this.height * 0.9;

			push();
			translate(right_ear_x, right_ear_y);
			rotate(PI/ j)
			fill(255, 165, 0);
			ellipse(0, 0, this.width * 0.33, this.width * 0.66);
			fill(255, 250, 205);
			ellipse(0, 0, this.width * 0.25, this.width * 0.5);
			pop();
			
			push();
			translate(left_ear_x, left_ear_y);
			rotate(PI/ j * -1)
			fill(255, 165, 0);
			ellipse(0, 0, this.width * 0.33, this.width * 0.66);
			fill(255, 250, 205);
			ellipse(0, 0, this.width * 0.25, this.width * 0.5);
			pop();

			// Body form
			fill(255, 165, 0);
			beginShape();
			vertex(this.xPos - this.width * 0.35, this.yPos); // Right leg Point
			bezierVertex(this.xPos - this.width * 0.8, this.yPos - this.height * 0.1, this.xPos - this.width * 0.6, this.yPos - this.height * 0.5, this.xPos - this.width * 0.6, this.yPos - this.height * 0.8);
			vertex(this.xPos - this.width * 0.6, this.yPos - this.height * 0.8);
			bezierVertex(this.xPos - this.width* 0.5, this.yPos - this.height * 0.9, this.xPos - this.width * 0.3, this.yPos - this.height * 0.99, this.xPos, this.yPos - this.height);
			vertex(this.xPos, this.yPos - this.height); 
			bezierVertex(this.xPos + this.width * 0.3, this.yPos - this.height * 0.99, this.xPos + this.width * 0.5, this.yPos - this.height * 0.9, this.xPos + this.width * 0.6, this.yPos - this.height * 0.8);
			vertex(this.xPos + this.width * 0.6, this.yPos - this.height * 0.8);
			bezierVertex(this.xPos + this.width * 0.6, this.yPos - this.height * 0.5, this.xPos + this.width * 0.8, this.yPos - this.height * 0.1, this.xPos + this.width * 0.35, this.yPos)
			vertex(this.xPos + this.width * 0.35, this.yPos) // Left lef point
			bezierVertex(this.xPos + this.width * 0.17, this.yPos - this.height*0.1, this.xPos - this.width * 0.17, this.yPos - this.height*0.1, this.xPos - this.width * 0.35, this.yPos)
			endShape();

			// Stomach
			fill(255, 250, 205)
			beginShape();
			vertex(this.xPos - this.width * 0.35, this.yPos);
			bezierVertex(this.xPos - this.width * 0.35, this.yPos - this.height * 0.6, this.xPos + this.width * 0.35, this.yPos - this.height * 0.6, this.xPos + this.width * 0.35, this.yPos)
			vertex(this.xPos + this.width * 0.35, this.yPos);
			bezierVertex(this.xPos + this.width * 0.17, this.yPos - this.height * 0.1, this.xPos - this.width * 0.17, this.yPos - this.height*0.1, this.xPos - this.width * 0.35, this.yPos)
			endShape();
			
			// Cheeks
			fill(255, 182, 193);
			ellipse(this.xPos - this.width * 0.35 + this.eyeMoveAmt, this.yPos - this.height * 0.5, this.width * 0.2, this.width * 0.13);
			ellipse(this.xPos + this.width * 0.35 + this.eyeMoveAmt, this.yPos - this.height * 0.5, this.width * 0.2, this.width * 0.13);
			
			// Nose
			strokeWeight(6)
			stroke(255, 120, 130);
			point(this.xPos, this.yPos - this.width * 0.75);
			
			// Eyes
			let right_eye_x = this.xPos - this.width * 0.3 + this.eyeMoveAmt;
			let right_eye_y = this.yPos - this.height * 0.7;
			let left_eye_x = this.xPos + this.width * 0.3 + this.eyeMoveAmt;
			let left_eye_y = this.yPos - this.height * 0.7;
			fill(0, 0, 0);
			noStroke();
			ellipse(right_eye_x, right_eye_y, this.width * 0.17, this.width * 0.25);
			ellipse(left_eye_x, left_eye_y, this.width * 0.17, this.width * 0.25);

			pop();
		},

		/* ***** WALKING LEFT ***** */
		render_walkLeft: function()
		{
			push();
			noStroke();
			this.eyeMoveAmt = -5;
			checkDirectionX = (x) => ((x >= 0) ? '1' : '-1'); // checkDirection to set the tail coordinate accordingly;
			let k = checkDirectionX(this.eyeMoveAmt);
			let j = 1.2;

			// The tail
			// tail point [this.xPos - this.width * k, this.yPos - this.height * 0.5] // k is either 1 or -1
			fill(255, 140, 0);
			beginShape();
			vertex(this.xPos, this.yPos - this.height * 0.1); // tail bone
			bezierVertex(this.xPos - this.width * k * 0.7, this.yPos, this.xPos - this.width * k * 0.8, this.yPos - this.height * 0.1, this.xPos - this.width * k, this.yPos - this.height * 0.5);
			endShape(CLOSE);

			// The ears
			let right_ear_x = this.xPos - this.width * 0.45 - this.eyeMoveAmt;
			let right_ear_y = this.yPos - this.height * 0.9;
			let left_ear_x = this.xPos + this.width * 0.45 - this.eyeMoveAmt;
			let left_ear_y = this.yPos - this.height * 0.9;

			push();
			translate(right_ear_x, right_ear_y);
			rotate(PI/ j)
			fill(255, 165, 0);
			ellipse(0, 0, this.width * 0.33, this.width * 0.66);
			fill(255, 250, 205);
			ellipse(0, 0, this.width * 0.25, this.width * 0.5);
			pop();
			
			push();
			translate(left_ear_x, left_ear_y);
			rotate(PI/ j * -1)
			fill(255, 165, 0);
			ellipse(0, 0, this.width * 0.33, this.width * 0.66);
			fill(255, 250, 205);
			ellipse(0, 0, this.width * 0.25, this.width * 0.5);
			pop();

			// Body form
			fill(255, 165, 0);
			beginShape();
			vertex(this.xPos - this.width * 0.35, this.yPos); // Right leg Point
			bezierVertex(this.xPos - this.width * 0.8, this.yPos - this.height * 0.1, this.xPos - this.width * 0.6, this.yPos - this.height * 0.5, this.xPos - this.width * 0.6, this.yPos - this.height * 0.8);
			vertex(this.xPos - this.width * 0.6, this.yPos - this.height * 0.8);
			bezierVertex(this.xPos - this.width* 0.5, this.yPos - this.height * 0.9, this.xPos - this.width * 0.3, this.yPos - this.height * 0.99, this.xPos, this.yPos - this.height);
			vertex(this.xPos, this.yPos - this.height); 
			bezierVertex(this.xPos + this.width * 0.3, this.yPos - this.height * 0.99, this.xPos + this.width * 0.5, this.yPos - this.height * 0.9, this.xPos + this.width * 0.6, this.yPos - this.height * 0.8);
			vertex(this.xPos + this.width * 0.6, this.yPos - this.height * 0.8);
			bezierVertex(this.xPos + this.width * 0.6, this.yPos - this.height * 0.5, this.xPos + this.width * 0.8, this.yPos - this.height * 0.1, this.xPos + this.width * 0.35, this.yPos)
			vertex(this.xPos + this.width * 0.35, this.yPos) // Left lef point
			bezierVertex(this.xPos + this.width * 0.17, this.yPos - this.height*0.1, this.xPos - this.width * 0.17, this.yPos - this.height*0.1, this.xPos - this.width * 0.35, this.yPos)
			endShape();

			// Stomach
			fill(255, 250, 205)
			beginShape();
			vertex(this.xPos - this.width * 0.35, this.yPos);
			bezierVertex(this.xPos - this.width * 0.35, this.yPos - this.height * 0.6, this.xPos + this.width * 0.35, this.yPos - this.height * 0.6, this.xPos + this.width * 0.35, this.yPos)
			vertex(this.xPos + this.width * 0.35, this.yPos);
			bezierVertex(this.xPos + this.width * 0.17, this.yPos - this.height * 0.1, this.xPos - this.width * 0.17, this.yPos - this.height*0.1, this.xPos - this.width * 0.35, this.yPos)
			endShape();
			
			// Cheeks
			fill(255, 182, 193);
			ellipse(this.xPos - this.width * 0.35 + this.eyeMoveAmt, this.yPos - this.height * 0.5, this.width * 0.2, this.width * 0.13);
			ellipse(this.xPos + this.width * 0.35 + this.eyeMoveAmt, this.yPos - this.height * 0.5, this.width * 0.2, this.width * 0.13);

			// Nose
			strokeWeight(6)
			stroke(255, 120, 130);
			point(this.xPos - this.width *0.15, this.yPos - this.width * 0.75);

			// Eyes
			let right_eye_x = this.xPos - this.width * 0.3 + this.eyeMoveAmt;
			let right_eye_y = this.yPos - this.height * 0.7;
			let left_eye_x = this.xPos + this.width * 0.3 + this.eyeMoveAmt;
			let left_eye_y = this.yPos - this.height * 0.7;
			fill(0, 0, 0);
			noStroke();
			ellipse(right_eye_x, right_eye_y, this.width * 0.17, this.width * 0.25);
			ellipse(left_eye_x, left_eye_y, this.width * 0.17, this.width * 0.25);

			pop();
		}, 

		/* ***** WALKING RIGHT ***** */
		render_walkRight: function()
		{
			push();
			noStroke();
			this.eyeMoveAmt = 5;
			checkDirectionX = (x) => ((x >= 0) ? '1' : '-1'); // checkDirection to set the tail coordinate accordingly;
			let k = checkDirectionX(this.eyeMoveAmt);
			let j = 1.2;

			// The tail
			// tail point [this.xPos - this.width * k, this.yPos - this.height * 0.5] // k is either 1 or -1
			fill(255, 140, 0);
			beginShape();
			vertex(this.xPos, this.yPos - this.height * 0.1); // tail bone
			bezierVertex(this.xPos - this.width * k * 0.7, this.yPos, this.xPos - this.width * k * 0.8, this.yPos - this.height * 0.1, this.xPos - this.width * k, this.yPos - this.height * 0.5);
			endShape(CLOSE);

			// The ears
			let right_ear_x = this.xPos - this.width * 0.45 - this.eyeMoveAmt;
			let right_ear_y = this.yPos - this.height * 0.9;
			let left_ear_x = this.xPos + this.width * 0.45 - this.eyeMoveAmt;
			let left_ear_y = this.yPos - this.height * 0.9;

			push();
			translate(right_ear_x, right_ear_y);
			rotate(PI/ j)
			fill(255, 165, 0);
			ellipse(0, 0, this.width * 0.33, this.width * 0.66);
			fill(255, 250, 205);
			ellipse(0, 0, this.width * 0.25, this.width * 0.5);
			pop();
			
			push();
			translate(left_ear_x, left_ear_y);
			rotate(PI/ j * -1)
			fill(255, 165, 0);
			ellipse(0, 0, this.width * 0.33, this.width * 0.66);
			fill(255, 250, 205);
			ellipse(0, 0, this.width * 0.25, this.width * 0.5);
			pop();

			// Body form
			fill(255, 165, 0);
			beginShape();
			vertex(this.xPos - this.width * 0.35, this.yPos); // Right leg Point
			bezierVertex(this.xPos - this.width * 0.8, this.yPos - this.height * 0.1, this.xPos - this.width * 0.6, this.yPos - this.height * 0.5, this.xPos - this.width * 0.6, this.yPos - this.height * 0.8);
			vertex(this.xPos - this.width * 0.6, this.yPos - this.height * 0.8);
			bezierVertex(this.xPos - this.width* 0.5, this.yPos - this.height * 0.9, this.xPos - this.width * 0.3, this.yPos - this.height * 0.99, this.xPos, this.yPos - this.height);
			vertex(this.xPos, this.yPos - this.height); 
			bezierVertex(this.xPos + this.width * 0.3, this.yPos - this.height * 0.99, this.xPos + this.width * 0.5, this.yPos - this.height * 0.9, this.xPos + this.width * 0.6, this.yPos - this.height * 0.8);
			vertex(this.xPos + this.width * 0.6, this.yPos - this.height * 0.8);
			bezierVertex(this.xPos + this.width * 0.6, this.yPos - this.height * 0.5, this.xPos + this.width * 0.8, this.yPos - this.height * 0.1, this.xPos + this.width * 0.35, this.yPos)
			vertex(this.xPos + this.width * 0.35, this.yPos) // Left lef point
			bezierVertex(this.xPos + this.width * 0.17, this.yPos - this.height*0.1, this.xPos - this.width * 0.17, this.yPos - this.height*0.1, this.xPos - this.width * 0.35, this.yPos)
			endShape();

			// Stomach
			fill(255, 250, 205)
			beginShape();
			vertex(this.xPos - this.width * 0.35, this.yPos);
			bezierVertex(this.xPos - this.width * 0.35, this.yPos - this.height * 0.6, this.xPos + this.width * 0.35, this.yPos - this.height * 0.6, this.xPos + this.width * 0.35, this.yPos)
			vertex(this.xPos + this.width * 0.35, this.yPos);
			bezierVertex(this.xPos + this.width * 0.17, this.yPos - this.height * 0.1, this.xPos - this.width * 0.17, this.yPos - this.height*0.1, this.xPos - this.width * 0.35, this.yPos)
			endShape();
			
			// Cheeks
			fill(255, 182, 193);
			ellipse(this.xPos - this.width * 0.35 + this.eyeMoveAmt, this.yPos - this.height * 0.5, this.width * 0.2, this.width * 0.13);
			ellipse(this.xPos + this.width * 0.35 + this.eyeMoveAmt, this.yPos - this.height * 0.5, this.width * 0.2, this.width * 0.13);

			// Nose
			strokeWeight(6)
			stroke(255, 120, 130);
			point(this.xPos + this.width *0.15, this.yPos - this.width * 0.75);	

			// Eyes
			let right_eye_x = this.xPos - this.width * 0.3 + this.eyeMoveAmt;
			let right_eye_y = this.yPos - this.height * 0.7;
			let left_eye_x = this.xPos + this.width * 0.3 + this.eyeMoveAmt;
			let left_eye_y = this.yPos - this.height * 0.7;
			fill(0, 0, 0);
			noStroke();
			ellipse(right_eye_x, right_eye_y, this.width * 0.17, this.width * 0.25);
			ellipse(left_eye_x, left_eye_y, this.width * 0.17, this.width * 0.25);

			pop();
		},

		/* ***** JUMP ***** */
		render_jump: function()
		{	
			push();
			noStroke();
			this.eyeMoveAmt = 0;
			checkDirectionX = (x) => ((x >= 0) ? '1' : '-1'); // checkDirection to set the tail coordinate accordingly;
			let k = checkDirectionX(this.eyeMoveAmt);
			let j = 1.7;

			// The tail
			// tail point [this.xPos - this.width * k, this.yPos - this.height * 0.5] // k is either 1 or -1
			fill(255, 140, 0);
			beginShape();
			vertex(this.xPos, this.yPos - this.height * 0.1); // tail bone
			bezierVertex(this.xPos - this.width * k * 0.7, this.yPos, this.xPos - this.width * k * 0.8, this.yPos - this.height * 0.1, this.xPos - this.width * k, this.yPos - this.height * 0.5);
			endShape(CLOSE);

			// The ears
			let right_ear_x = this.xPos - this.width * 0.45 - this.eyeMoveAmt;
			let right_ear_y = this.yPos - this.height * 0.9;
			let left_ear_x = this.xPos + this.width * 0.45 - this.eyeMoveAmt;
			let left_ear_y = this.yPos - this.height * 0.9;

			push();
			translate(right_ear_x, right_ear_y);
			rotate(PI/ j)
			fill(255, 165, 0);
			ellipse(0, 0, this.width * 0.33, this.width * 0.66);
			fill(255, 250, 205);
			ellipse(0, 0, this.width * 0.25, this.width * 0.5);
			pop();
			
			push();
			translate(left_ear_x, left_ear_y);
			rotate(PI/ j * -1)
			fill(255, 165, 0);
			ellipse(0, 0, this.width * 0.33, this.width * 0.66);
			fill(255, 250, 205);
			ellipse(0, 0, this.width * 0.25, this.width * 0.5);
			pop();

			// Body form
			fill(255, 165, 0);
			beginShape();
			vertex(this.xPos - this.width * 0.35, this.yPos); // Right leg Point
			bezierVertex(this.xPos - this.width * 0.8, this.yPos - this.height * 0.1, this.xPos - this.width * 0.6, this.yPos - this.height * 0.5, this.xPos - this.width * 0.6, this.yPos - this.height * 0.8);
			vertex(this.xPos - this.width * 0.6, this.yPos - this.height * 0.8);
			bezierVertex(this.xPos - this.width* 0.5, this.yPos - this.height * 0.9, this.xPos - this.width * 0.3, this.yPos - this.height * 0.99, this.xPos, this.yPos - this.height);
			vertex(this.xPos, this.yPos - this.height); 
			bezierVertex(this.xPos + this.width * 0.3, this.yPos - this.height * 0.99, this.xPos + this.width * 0.5, this.yPos - this.height * 0.9, this.xPos + this.width * 0.6, this.yPos - this.height * 0.8);
			vertex(this.xPos + this.width * 0.6, this.yPos - this.height * 0.8);
			bezierVertex(this.xPos + this.width * 0.6, this.yPos - this.height * 0.5, this.xPos + this.width * 0.8, this.yPos - this.height * 0.1, this.xPos + this.width * 0.35, this.yPos)
			vertex(this.xPos + this.width * 0.35, this.yPos) // Left lef point
			bezierVertex(this.xPos + this.width * 0.17, this.yPos - this.height*0.1, this.xPos - this.width * 0.17, this.yPos - this.height*0.1, this.xPos - this.width * 0.35, this.yPos)
			endShape();

			// Stomach
			fill(255, 250, 205)
			beginShape();
			vertex(this.xPos - this.width * 0.35, this.yPos);
			bezierVertex(this.xPos - this.width * 0.35, this.yPos - this.height * 0.6, this.xPos + this.width * 0.35, this.yPos - this.height * 0.6, this.xPos + this.width * 0.35, this.yPos)
			vertex(this.xPos + this.width * 0.35, this.yPos);
			bezierVertex(this.xPos + this.width * 0.17, this.yPos - this.height * 0.1, this.xPos - this.width * 0.17, this.yPos - this.height*0.1, this.xPos - this.width * 0.35, this.yPos)
			endShape();
			
			// Cheeks
			fill(255, 182, 193);
			ellipse(this.xPos - this.width * 0.35 + this.eyeMoveAmt, this.yPos - this.height * 0.5, this.width * 0.2, this.width * 0.13);
			ellipse(this.xPos + this.width * 0.35 + this.eyeMoveAmt, this.yPos - this.height * 0.5, this.width * 0.2, this.width * 0.13);
			
			// Nose
			strokeWeight(6)
			stroke(255, 120, 130);
			point(this.xPos, this.yPos - this.width * 0.75);		

			// Eyes
			let right_eye_x = this.xPos - this.width * 0.3 + this.eyeMoveAmt;
			let right_eye_y = this.yPos - this.height * 0.7;
			let left_eye_x = this.xPos + this.width * 0.3 + this.eyeMoveAmt;
			let left_eye_y = this.yPos - this.height * 0.7;
			fill(0, 0, 0);
			noStroke();
			ellipse(right_eye_x, right_eye_y, this.width * 0.17, this.width * 0.25);
			ellipse(left_eye_x, left_eye_y, this.width * 0.17, this.width * 0.25);

			pop();
		},

		/* ***** JUMP RIGHT ***** */
		render_jumpRight: function()
		{
			push();
			noStroke();
			this.eyeMoveAmt = 5;
			checkDirectionX = (x) => ((x >= 0) ? '1' : '-1'); // checkDirection to set the tail coordinate accordingly;
			let k = checkDirectionX(this.eyeMoveAmt);
			let j = 1.7;

			// The tail
			// tail point [this.xPos - this.width * k, this.yPos - this.height * 0.5] // k is either 1 or -1
			fill(255, 140, 0);
			beginShape();
			vertex(this.xPos, this.yPos - this.height * 0.1); // tail bone
			bezierVertex(this.xPos - this.width * k * 0.7, this.yPos, this.xPos - this.width * k * 0.8, this.yPos - this.height * 0.1, this.xPos - this.width * k, this.yPos - this.height * 0.5);
			endShape(CLOSE);

			// The ears
			let right_ear_x = this.xPos - this.width * 0.45 - this.eyeMoveAmt;
			let right_ear_y = this.yPos - this.height * 0.9;
			let left_ear_x = this.xPos + this.width * 0.45 - this.eyeMoveAmt;
			let left_ear_y = this.yPos - this.height * 0.9;

			push();
			translate(right_ear_x, right_ear_y);
			rotate(PI/ j)
			fill(255, 165, 0);
			ellipse(0, 0, this.width * 0.33, this.width * 0.66);
			fill(255, 250, 205);
			ellipse(0, 0, this.width * 0.25, this.width * 0.5);
			pop();
			
			push();
			translate(left_ear_x, left_ear_y);
			rotate(PI/ j * -1)
			fill(255, 165, 0);
			ellipse(0, 0, this.width * 0.33, this.width * 0.66);
			fill(255, 250, 205);
			ellipse(0, 0, this.width * 0.25, this.width * 0.5);
			pop();

			// Body form
			fill(255, 165, 0);
			beginShape();
			vertex(this.xPos - this.width * 0.35, this.yPos); // Right leg Point
			bezierVertex(this.xPos - this.width * 0.8, this.yPos - this.height * 0.1, this.xPos - this.width * 0.6, this.yPos - this.height * 0.5, this.xPos - this.width * 0.6, this.yPos - this.height * 0.8);
			vertex(this.xPos - this.width * 0.6, this.yPos - this.height * 0.8);
			bezierVertex(this.xPos - this.width* 0.5, this.yPos - this.height * 0.9, this.xPos - this.width * 0.3, this.yPos - this.height * 0.99, this.xPos, this.yPos - this.height);
			vertex(this.xPos, this.yPos - this.height); 
			bezierVertex(this.xPos + this.width * 0.3, this.yPos - this.height * 0.99, this.xPos + this.width * 0.5, this.yPos - this.height * 0.9, this.xPos + this.width * 0.6, this.yPos - this.height * 0.8);
			vertex(this.xPos + this.width * 0.6, this.yPos - this.height * 0.8);
			bezierVertex(this.xPos + this.width * 0.6, this.yPos - this.height * 0.5, this.xPos + this.width * 0.8, this.yPos - this.height * 0.1, this.xPos + this.width * 0.35, this.yPos)
			vertex(this.xPos + this.width * 0.35, this.yPos) // Left lef point
			bezierVertex(this.xPos + this.width * 0.17, this.yPos - this.height*0.1, this.xPos - this.width * 0.17, this.yPos - this.height*0.1, this.xPos - this.width * 0.35, this.yPos)
			endShape();

			// Stomach
			fill(255, 250, 205)
			beginShape();
			vertex(this.xPos - this.width * 0.35, this.yPos);
			bezierVertex(this.xPos - this.width * 0.35, this.yPos - this.height * 0.6, this.xPos + this.width * 0.35, this.yPos - this.height * 0.6, this.xPos + this.width * 0.35, this.yPos)
			vertex(this.xPos + this.width * 0.35, this.yPos);
			bezierVertex(this.xPos + this.width * 0.17, this.yPos - this.height * 0.1, this.xPos - this.width * 0.17, this.yPos - this.height*0.1, this.xPos - this.width * 0.35, this.yPos)
			endShape();
			
			// Cheeks
			fill(255, 182, 193);
			ellipse(this.xPos - this.width * 0.35 + this.eyeMoveAmt, this.yPos - this.height * 0.5, this.width * 0.2, this.width * 0.13);
			ellipse(this.xPos + this.width * 0.35 + this.eyeMoveAmt, this.yPos - this.height * 0.5, this.width * 0.2, this.width * 0.13);
			
			// Nose
			strokeWeight(6)
			stroke(255, 120, 130);
			point(this.xPos + this.width * 0.15, this.yPos - this.width * 0.75);		

			// Eyes
			let right_eye_x = this.xPos - this.width * 0.3 + this.eyeMoveAmt;
			let right_eye_y = this.yPos - this.height * 0.7;
			let left_eye_x = this.xPos + this.width * 0.3 + this.eyeMoveAmt;
			let left_eye_y = this.yPos - this.height * 0.7;
			fill(0, 0, 0);
			noStroke();
			ellipse(right_eye_x, right_eye_y, this.width * 0.17, this.width * 0.25);
			ellipse(left_eye_x, left_eye_y, this.width * 0.17, this.width * 0.25);

			pop();
		},

		/* ***** JUMP LEFT ***** */
		render_jumpLeft: function()
		{
			push();
			noStroke();
			this.eyeMoveAmt = -5;
			checkDirectionX = (x) => ((x >= 0) ? '1' : '-1'); // checkDirection to set the tail coordinate accordingly;
			let k = checkDirectionX(this.eyeMoveAmt);
			let j = 1.7;

			// The tail
			// tail point [this.xPos - this.width * k, this.yPos - this.height * 0.5] // k is either 1 or -1
			fill(255, 140, 0);
			beginShape();
			vertex(this.xPos, this.yPos - this.height * 0.1); // tail bone
			bezierVertex(this.xPos - this.width * k * 0.7, this.yPos, this.xPos - this.width * k * 0.8, this.yPos - this.height * 0.1, this.xPos - this.width * k, this.yPos - this.height * 0.5);
			endShape(CLOSE);

			// The ears
			let right_ear_x = this.xPos - this.width * 0.45 - this.eyeMoveAmt;
			let right_ear_y = this.yPos - this.height * 0.9;
			let left_ear_x = this.xPos + this.width * 0.45 - this.eyeMoveAmt;
			let left_ear_y = this.yPos - this.height * 0.9;

			push();
			translate(right_ear_x, right_ear_y);
			rotate(PI/ j)
			fill(255, 165, 0);
			ellipse(0, 0, this.width * 0.33, this.width * 0.66);
			fill(255, 250, 205);
			ellipse(0, 0, this.width * 0.25, this.width * 0.5);
			pop();
			
			push();
			translate(left_ear_x, left_ear_y);
			rotate(PI/ j * -1)
			fill(255, 165, 0);
			ellipse(0, 0, this.width * 0.33, this.width * 0.66);
			fill(255, 250, 205);
			ellipse(0, 0, this.width * 0.25, this.width * 0.5);
			pop();

			// Body form
			fill(255, 165, 0);
			beginShape();
			vertex(this.xPos - this.width * 0.35, this.yPos); // Right leg Point
			bezierVertex(this.xPos - this.width * 0.8, this.yPos - this.height * 0.1, this.xPos - this.width * 0.6, this.yPos - this.height * 0.5, this.xPos - this.width * 0.6, this.yPos - this.height * 0.8);
			vertex(this.xPos - this.width * 0.6, this.yPos - this.height * 0.8);
			bezierVertex(this.xPos - this.width* 0.5, this.yPos - this.height * 0.9, this.xPos - this.width * 0.3, this.yPos - this.height * 0.99, this.xPos, this.yPos - this.height);
			vertex(this.xPos, this.yPos - this.height); 
			bezierVertex(this.xPos + this.width * 0.3, this.yPos - this.height * 0.99, this.xPos + this.width * 0.5, this.yPos - this.height * 0.9, this.xPos + this.width * 0.6, this.yPos - this.height * 0.8);
			vertex(this.xPos + this.width * 0.6, this.yPos - this.height * 0.8);
			bezierVertex(this.xPos + this.width * 0.6, this.yPos - this.height * 0.5, this.xPos + this.width * 0.8, this.yPos - this.height * 0.1, this.xPos + this.width * 0.35, this.yPos)
			vertex(this.xPos + this.width * 0.35, this.yPos) // Left lef point
			bezierVertex(this.xPos + this.width * 0.17, this.yPos - this.height*0.1, this.xPos - this.width * 0.17, this.yPos - this.height*0.1, this.xPos - this.width * 0.35, this.yPos)
			endShape();

			// Stomach
			fill(255, 250, 205)
			beginShape();
			vertex(this.xPos - this.width * 0.35, this.yPos);
			bezierVertex(this.xPos - this.width * 0.35, this.yPos - this.height * 0.6, this.xPos + this.width * 0.35, this.yPos - this.height * 0.6, this.xPos + this.width * 0.35, this.yPos)
			vertex(this.xPos + this.width * 0.35, this.yPos);
			bezierVertex(this.xPos + this.width * 0.17, this.yPos - this.height * 0.1, this.xPos - this.width * 0.17, this.yPos - this.height*0.1, this.xPos - this.width * 0.35, this.yPos)
			endShape();
			
			// Cheeks
			fill(255, 182, 193);
			ellipse(this.xPos - this.width * 0.35 + this.eyeMoveAmt, this.yPos - this.height * 0.5, this.width * 0.2, this.width * 0.13);
			ellipse(this.xPos + this.width * 0.35 + this.eyeMoveAmt, this.yPos - this.height * 0.5, this.width * 0.2, this.width * 0.13);

			// Nose
			strokeWeight(6)
			stroke(255, 120, 130);
			point(this.xPos - this.width * 0.15, this.yPos - this.width * 0.75);

			// Eyes
			let right_eye_x = this.xPos - this.width * 0.3 + this.eyeMoveAmt;
			let right_eye_y = this.yPos - this.height * 0.7;
			let left_eye_x = this.xPos + this.width * 0.3 + this.eyeMoveAmt;
			let left_eye_y = this.yPos - this.height * 0.7;
			fill(0, 0, 0);
			noStroke();
			ellipse(right_eye_x, right_eye_y, this.width * 0.17, this.width * 0.25);
			ellipse(left_eye_x, left_eye_y, this.width * 0.17, this.width * 0.25);

			pop();
		}
	}
}

function core_renderWorld()
{
	// Render Mountains
	for (let i = 0; i < mountains.properties.length; i++)
	{	
		mountains.properties[i].renderMountain();
	}

	// Render Waterfall
	for (let i = 0; i < waterfalls.properties.length; i++)
	{
		waterfalls.properties[i].renderWaterFall();
		renderBubbles(waterfalls.properties[i].xPos + water_bubbles.size * 10, ground_level - waterfalls.properties[i].size * 0.40, water_bubbles.size);
		renderBubbles(waterfalls.properties[i].xPos + water_bubbles.size * 20, ground_level - waterfalls.properties[i].size * 0.30, water_bubbles.size);
	}

	// The Clouds
	for (let i = 0; i < clouds.properties.length; i++)
	{	
		clouds.properties[i].renderCloud();
	}

	// The Tree and bushes

	for (let i = 0; i < trees.length; i++)
	{
		trees[i].renderTree();
	}

	for (let i = 0; i < bushes.properties.length; i++)
	{
		bushes.properties[i].renderBush();
	}
	
	// Canyons
	canyons.dept = surfaceDept * 1.5;
	for (let i = 0; i < canyons.properties.length; i++)
	{	
		canyons.properties[i].renderCanyon();
		canyons.properties[i].renderCanyonFire();
	}

	for (let i = 0; i < canyons.properties.length; i++)
	{	
		renderBurnParticles(canyons.properties[i].xPos + canyonFire.size * 0.3, height - canyonFire.size * 0.1, canyonFire.size * 0.2); // fire spot
	}

	// Rivers
	for (let i = 0; i < lakes.properties.length; i++)
	{
		lakes.properties[i].renderRiver();
	}

	for (let i = 0; i < waterfalls.properties.length; i++)
	{
		renderRipple(waterfalls.properties[i].xPos + water_ripple.size * 10, ground_level, water_ripple.size)	
	}

	// Colectibles		
	for (let i = 0; i < collectible.properties.length; i++)
	{
		collectible.properties[i].renderCollectible();
	}

	// Platforms
	for (let i = 0; i < platforms.properties.length; i++)
	{
		platforms.properties[i].renderPlatform();
		platforms.properties[i].renderPlatformGrass();
	}

	// Set the moving platforms.

	for (let i = 0; i < vertical_platforms.properties.length; i++)
	{
		vertical_platforms.properties[i].renderPlatform();
		vertical_platforms.properties[i].moveVertical(vertical_platforms.range[i][0], vertical_platforms.range[i][1]);
	}

	// Flag Pole 
	render_flag_pole();

	// Enemies
	for (let i = 0; i < enemies.properties.length; i++)
	{
		enemies.properties[i].render();
	}

	// Fire spirit
	if (gameChar.ability_fire == true)
	{	
		render_fire_spirit();
	}

	// Enemy explosion - Timer is set to 1.5 seconds
	if (explosions.set = true)
	{
		explosions.stop = Date.now()/ 1000;
	}

	if (explosions.stop - explosions.start <= 1.5)
	{
		renderExplosion(explosions.xPos, explosions.yPos, fireSpirit.size * 0.4);
	} else 
	{
		explosions.set = false;
		explosions.properties.splice(0, explosions.properties.length); // Empty the explosions array of leftover particles
	}

}

function core_prep_graphics()
{	
	// Create clouds with unique attributes
	for (let i = 0; i < clouds.cloudsXpos.length; i++)
	{	
		clouds.properties.push(new Cloud(clouds.cloudsXpos[i]));
	}

	// Create Moutains
	for (let i = 0; i < mountains.xPos.length; i++)
	{	
		mountains.properties.push(new Mountain(mountains.xPos[i], 400 + random(250)));
	}

	// Create Waterfall
	for (let i = 0; i < waterfalls.xPos.length; i++)
	{
		waterfalls.properties.push(new WaterFall(waterfalls.xPos[i], waterfalls.size[i]));
	}

	// Create the canyon
	for (let i =0; i < canyons.xPos.length; i++)
	{
		canyons.properties.push(new Canyon(canyons.xPos[i], canyons.size))
	}
	
	// Draw the bushes
	for (let i = 0; i < bushes.xPos.length; i++)
	{
		bushes.properties.push(new Bush(bushes.xPos[i]));
	}

	// Let the river flows
	for (let i = 0; i < lakes.xPos.length; i++)
	{
		lakes.properties.push(new Lake(lakes.xPos[i], lakes.size))
	}
		
	// Red trees color RGB
	red_trees.properties.clr1 = color(222, 184, 135);
	red_trees.properties.clr2 = color(123,29,0);
	red_trees.properties.clr3 = color(213,71,0,100);
	red_trees.properties.clr4 = color(200,120,40,150);

	// Green trees color RGB 
	green_trees.properties.clr1 = color(150, 184, 85);
	green_trees.properties.clr2 = color(50,131,0);
	green_trees.properties.clr3 = color(113,221,0,100);
	green_trees.properties.clr4 = color(63,200,0,150);

	// Prepare trees array
	for (let i = 0; i < red_trees.xPos.length; i ++)
	{
		trees.push(new Tree(red_trees.xPos[i], red_trees.properties))
	};

	for (let i = 0; i < green_trees.xPos.length; i ++)
	{
		trees.push(new Tree(green_trees.xPos[i], green_trees.properties))
	};

	// Prepare Collectible
	for (let i = 0; i < collectible.xPos.length; i++)
	{
		collectible.properties.push(new Collectible(collectible.xPos[i], ground_level - collectible.yPos[i], collectible.size));
	}
	for (let i = 0; i < collectible.xPos.length; i++)
	{
		collectible.reset.push(new Collectible(collectible.xPos[i], ground_level - collectible.yPos[i], collectible.size));
	}

	// Setting up the platforms
	for (let i = 0; i < platforms.xPos.length; i++)
	{
		platforms.properties.push(new Platform(platforms.xPos[i], ground_level - platforms.yPos[i], platforms.size, platforms.thickness));
	}

	// The moving platforms
	for (let i = 0; i < vertical_platforms.xPos.length; i++)
	{
		vertical_platforms.properties.push(new VerticalPlatform(vertical_platforms.xPos[i], ground_level - vertical_platforms.yPos[i], vertical_platforms.size, vertical_platforms.thickness));
	}

	// Create enemies
	for (let i = 0; i < enemies.xPos.length; i++)
	{
		enemies.properties.push(new Enemy(enemies.xPos[i], enemies.xRange[i], ground_level + enemies.yPos[i], enemies.yRange[i], enemies.duration[i]))
	}

	for (let i = 0; i < enemies.properties.length; i++)
	{
		enemies.reset.push(enemies.properties[i]);
	}

	// Prepare the starry sky
	module_prep_starrySky();

	// Setup the fire spirit
	fireSpirit.x = 0;
	fireSpirit.y = 0;
}

function core_calculate_Time()
{
	let time = Date.now()/1000
	risetime  = map(sin(time/dayCircle * PI), -1, 1, 0, 1);
	// risetime > 0.5: night. risetime < 0.5: day
	if (risetime > 0.5) 
	{
		dayTime = 'night';
	} 
		else 
	{
		dayTime = 'day'
	}
}

function core_draw_backdrop()
{		
	// Draw the Sky();
	let skyRed = map(risetime, 0, 1, 100, 0);
	let skyGreen = map(risetime, 0, 1, 155, 0);
	let skyBlue = map(risetime, 0, 1, 255, 0);
	background(skyRed, skyGreen, skyBlue);
	module_draw_starrySky();

	// The Sun and The Moon
	module_draw_Sun(theSun = {xPos: 400, yPos: height/6, size: width * 0.1, ray_Angle: 0}); 
	module_draw_moon(theMoon = {xPos: 800, maxHeight: height/4.5});
			
	// Draw The ground
	module_draw_ground();
}

function core_move_gameChar()
{	
	// Check direction to move scrollPos
	if (gameChar.isRight)
	{
		if(gameChar.xPos < width * 0.8)
		{	
			gameChar.xPos  += gameChar.moveSpeed;	
		}
		else
		{	
			scrollPos -= gameChar.moveSpeed; 
		}

		if (gameChar.isFalling) 
		{	
			gameChar.xPos -= 1 //Set gameChar_x back by the amount of jump acceleration, if not, game char will move further than expected when jumping
		}
	}

	if (gameChar.isLeft)
	{	
		if(gameChar.xPos > width * 0.2)
		{	
			gameChar.xPos -= gameChar.moveSpeed;
		}
		else
		{	
			scrollPos += gameChar.moveSpeed;
		}

		if (gameChar.isFalling) 
		{	
			gameChar.xPos += 1 //Set gameChar_x back by the amount of jump acceleration, if not, game char will move further than expected when jumping
		}
	}

	// Check Falling && on Platform
	module_check_platform();
	module_check_Vplatform();

	if (gameChar.yPos < ground_level)  
	{	
		if (on_platform == true)
		{
			gameChar.isFalling = false;
		} 
		if (on_platform == false) 
		{
			gameChar.isFalling = true;
		}
	} 
	else 
	{
		gameChar.isFalling = false;
	}

	if (gameChar.isPlummeting == true) 
	{
		gameChar.yPos += 10;
	}

	if (deathBy_falling == true)
	{	
		gameChar.yPos += 10;
	}

	if (deathBy_enemy == true)
	{	
		gameChar.yPos -= 20;
	}
		
	// Execute Movement
	if (gameChar.isLeft && gameChar.isFalling) 
	{
		gameChar.xPos -= 1; //Jumping accelleration amount
		gameChar.yPos += 2;
		gameChar.render_jumpLeft();
	} 
	else if (gameChar.isRight && gameChar.isFalling) 
	{
		gameChar.xPos += 1;	
		gameChar.yPos += 2;
		gameChar.render_jumpRight();
	} 
	else if (gameChar.isLeft) 
	{
		gameChar.render_walkLeft();
	} 
	else if (gameChar.isRight) 
	{
		gameChar.render_walkRight();
	} 
	else if (gameChar.isFalling || gameChar.isPlummeting) 
	{
		gameChar.yPos += 2;
		gameChar.render_jump(); 
	} 
	else
	{	
		// Standing still
		gameChar.render_standing();
	}
}

function core_check_collision()
{
	module_collision_canyon();
	module_collision_lake();
	module_collision_collectibles();
	module_collision_enemies();
	module_reach_flagpole();
	module_collision_FireSpirit();
}

function core_check_achievement()
{	
	let artifacts_collected = collectible.reset.length - collectible.properties.length;
	let enemies_elliminated = enemies.reset.length - enemies.properties.length;

	if (artifacts_collected == collectible.reset.length) 
	{	
		collectible.isFound = true;
		stroke(255, 165, 0, 100);
		strokeWeight(10);
		fill(255, 255, 255);
		rect(width * 0.083, height * 0.025, width * 0.2 , height * 0.0625, 24, 24);
		
		// Text
		noStroke();
		fill(80, 80, 80);
		textSize(18 * (shared.width/ 1600)); // original textSize was set on a 1600 width canvas
		text("All artifacts collected", width * 0.1, height * 0.0625);

		// Fire spirit unlock
		stroke(255, 69, 0, 100);
		strokeWeight(10);
		fill(255, 255, 255);
		rect(width * 0.483, height * 0.025, width * 0.5, height * 0.0625, 24, 24);
		rect(width * 0.483, height * 0.025, width * 0.5, height * 0.0925, 24, 24);

		noStroke();
		fill(80, 80, 80);
		textSize(18 * (shared.width/ 1600)); // original textSize was set on a 1600 width canvas
		text("May the Fire Spirit blesses you!", width * 0.5, height * 0.0625);
		text("Press J to whip left, press K to whip right", width * 0.5, height * 0.0925);
		gameChar.ability_fire = true;
	}

	else 
	{	
		// Banner
		stroke(255, 165, 0, 100);
		strokeWeight(10);
		fill(255, 255, 255);
		rect(width * 0.083, height * 0.025, width * 0.2 , height * 0.0625, 24, 24);

		// Text
		noStroke();
		fill(80, 80, 80);
		textSize(18 * (shared.width/ 1600));
		text("Artifacts collected: " + artifacts_collected, width * 0.1, height * 0.0625);
	}
	gameScore = artifacts_collected * 50 + enemies_elliminated * 100;
}

function Platform(x, y, w, t)
{	
	// A stand-still platform
	this.xPos = x;
	this.yPos = y;
	this.size = w;
	this.thickness = t;

	this.renderPlatform = function()
		{	
			push();
			fill(200, 100, 50);
			// rect(this.xPos, this.yPos, this.size, this.thickness);
			beginShape();
			vertex(this.xPos, this.yPos);
			vertex(this.xPos + this.size, this.yPos);
			vertex(this.xPos + this.size*0.8, this.yPos + this.thickness);
			vertex(this.xPos + this.size*0.2, this.yPos + this.thickness);
			endShape(CLOSE);
			pop();
		}

	this.renderPlatformGrass = function()
		{	
			// This function will add grass on the platforms
			// Learned this technique from a good friend, adapted to my own code. I still yet to master it. 

			push();
			let yPosition = this.yPos;
			let xPosition = this.xPos - this.size * 0.015; // Let grass "grow out" of the platform a bit for a realistic look
			let height = 0.175;
			let grass = {
				Density: 30, 
				Variation: 0.5, 
				borderHeight: 0.12, 
				sections: [[0, 1]]
				};
			let platformGrass = 
				{
				width: platforms.size,
				height: yPosition + 30
				}; 
			let startPoint = createVector(0, yPosition);
			let borderHeight = platformGrass.height * grass.borderHeight * height; 
			let heightVariation = platformGrass.height * grass.Variation * height; //Height variation of grass, the bigger it is the "spiky-er" the grass looks.
			let borderSections = [];

			noStroke();
			for (section of grass.sections) 
			{	
				let start = section[0];
				let span = section[1] - section[0];
				let gapCount = Math.floor(span * grass.Density); 
				let gapSize = span / gapCount;
				let displacement = Math.floor(start * grass.Density);
						
				let points = [];
				for (let i = 0; i <= gapCount; ++i) //Make an array of points
				{
					let yOffset = noise(displacement+i, platformGrass.height) - .5;
					points.push(createVector( xPosition+ (start + i * gapSize) * (platformGrass.width * 1.03), platformGrass.height + yOffset * heightVariation));
				}
				borderSections.push(points);
				my_grassBorder = borderSections;
			}
				
			let grassBorder = my_grassBorder;
			drawVertex = (point, move = 0) => curveVertex(point.x - (move.x || 0), point.y - (move.y || move)); //Draw vertexes from the array of points

			let red = map(risetime, 0, 1, 30, 0);	
			let green = map(risetime, 0, 1, 120, 40);
			let blue = map(risetime, 0, 1, 30, 0);
			
			for (grassPoints of grassBorder) 
			{
				fill(red, green, blue);
				beginShape();
				drawVertex(createVector(grassPoints[0].x, startPoint.y));
				drawVertex(createVector(grassPoints[0].x, startPoint.y));
				grassPoints.forEach(p => drawVertex(p, borderHeight - 1));
				drawVertex(createVector(grassPoints[grassPoints.length-1].x, startPoint.y));
				drawVertex(createVector(grassPoints[grassPoints.length-1].x, startPoint.y));
				endShape();
			}
			pop();
		}
}

function VerticalPlatform(x, y, w, t)
{	
	// A platform that moves vertically
	this.xPos = x;
	this.yPos = y;
	this.size = w;
	this.thickness = t;

	this.renderPlatform = function()
		{	
			push();
			noStroke();
			fill(173, 216, 230);
			rect(this.xPos, this.yPos, this.size, this.thickness * 0.5, 20, 20);
			fill(244, 255, 255);
			arc((this.xPos + this.size/2), this.yPos + this.thickness*0.4, this.size * 0.7, this.thickness*1.5, 0, PI);
			pop();
		}

	this.moveVertical = function(minHeight, maxHeight)
	{	
		let timeP = Date.now()/1000
		let risetimeP  = map(sin(timeP/(dayCircle/2) * PI), -1, 1, 0, 1);
		this.yPos = lerp(minHeight, maxHeight, risetimeP);
	}
}

function Collectible(x, y, s)
{	
	// Core idea: A Mayan styled artifact that shines and rumbles when Char got close.
	this.xPos = x;
	this.yPos = y;
	this.size = s,
	this.rumbleAmt = 0, // Collectible will not move unless Character gets close
		
	this.renderCollectible = function()
		{	
			push();
			fill(255,255,255);
			ellipse(this.xPos + this.rumbleAmt, this.yPos - this.rumbleAmt, this.size/6, this.size*0.8);
			ellipse(this.xPos + this.rumbleAmt, this.yPos - this.rumbleAmt, this.size*0.8, this.size/6);
					
			// Make it shines
			fill(255, 255, 255, 120);
			let circleSize = random(this.size*0.75, this.size*0.25);
			ellipse(this.xPos + this.rumbleAmt, this.yPos - this.rumbleAmt, circleSize);

			imageMode(CENTER);
			image(img_collectible, this.xPos + this.rumbleAmt, this.yPos - this.rumbleAmt, this.size*0.6, this.size*0.6);
			pop();
		};
}

function Enemy(x, xRange, y, yRange, duration)
{	
	// Core idea: a ball-shaped bat-like creature.
    this.xPos = x,
	this.yRange = y - yRange/2,
	this.yPos = y - yRange/2,
	this.size = 50,
    this.duration = duration,
    this.leftSide = x - xRange;
	this.rightSide = x + xRange;
	this.directionX = undefined,
	this.directionY = -1,

    this.render = function()
        {   
			// The wings
			imageMode(CENTER);
			image(img_enemyWing, this.xPos, this.yPos - this.size * 0.7 + random(-10, 10), this.size * 3, this.size);
            if (this.update(this.leftSide, this.rightSide) == 'left')
                {
                     // body
                    push();
                    translate(this.xPos, this.yPos - this.size*0.5);
                    noStroke();
                 	fill(32, 178, 170);	
                    ellipse(0, 0, this.size);

                    // eyes
					strokeWeight(1);
                    stroke(255, 165, 0);
                    fill(175, 238, 238);
                    ellipse(- this.size * 0.33, this.size * 0.07, this.size * 0.15, this.size * 0.26);
                    ellipse(this.size * 0.16, this.size * 0.07, this.size * 0.15, this.size * 0.26);

                    // mouth
                    stroke(0);
                    noFill();
                    strokeWeight(1);
                    beginShape();
                    vertex(- this.size * 0.27, this.size * 0.27);
                    vertex(- this.size * 0.2, this.size * 0.33);
                    vertex(- this.size * 0.13, this.size * 0.27);
                    vertex(- this.size * 0.07, this.size * 0.33);
                    vertex(0, this.size * 0.27);
                    endShape();

					// forehead
					fill(255, 165, 0);
					beginShape();
					noStroke()
					vertex(- this.size * 0.183, - this.size * 0.33);
					vertex(- this.size * 0.1, - this.size * 0.45);
					vertex(this.size * 0.083 - this.size * 0.1, - this.size * 0.33);
					vertex(- this.size * 0.1, - this.size * 0.22);
					endShape(CLOSE);
	                pop();

                } else 
                {
                    push();
                    translate(this.xPos, this.yPos - this.size * 0.5);
                    noStroke();
					fill(32, 178, 170);	
                    ellipse(0, 0, this.size);

                    // eyes
					strokeWeight(1);
                    stroke(255, 165, 0);
                    fill(175, 238, 238);
                    ellipse(this.size * 0.33, this.size * 0.07, this.size * 0.15, this.size * 0.26);
                    ellipse(- this.size * 0.16, this.size * 0.07, this.size * 0.15, this.size * 0.26);

                    // mouth
                    stroke(0);
                    noFill();
                    strokeWeight(1);
                    beginShape();
                    vertex(this.size * 0.27, this.size * 0.27);
                    vertex(this.size * 0.2, this.size * 0.33);
                    vertex(this.size * 0.13, this.size * 0.27);
                    vertex(this.size * 0.07, this.size * 0.33);
                    vertex(0, this.size * 0.27);
                    endShape();

					// forehead
					fill(255, 165, 0);
					beginShape();
					noStroke()
					vertex(this.size * 0.183, - this.size * 0.33);
					vertex(this.size * 0.1, - this.size * 0.45);
					vertex(this.size * 0.1- this.size * 0.083, - this.size * 0.33);
					vertex(this.size * 0.1, - this.size * 0.22);
					endShape(CLOSE);
					pop();
                }
		},

    this.update = function(leftside, rightside)
        {   
            let timeX = Date.now()/ 1000 // time in seconds;
            let t1 = map(sin(timeX/this.duration * PI), -1, 1, 0, 1);
            this.xPos = lerp(leftside, rightside, t1);
			let lasttouch;
			
			if (abs(this.yPos - this.yRange) >= yRange)
			{
				this.directionY *= -1;
			}
			this.yPos += this.directionY;

			// control the face movement when changing direction
            if (this.xPos - leftside <= 10)
            {
                lasttouch = 'leftside';
                this.directionX = 'right';
            }
            if (rightside - this.xPos <= 10)
            {
                lasttouch = 'rightside';
                this.directionX = 'left';
            }

            if (lasttouch == 'rightside' || this.directionX == 'left')
            {   
                return this.directionX;
            }
            
            if (lasttouch == 'leftside' || this.directionX == 'right')
            {   
                return this.directionX;
            }
        }
}

function Cloud(x)
{	
	// Core idea: A set of ellipse moving along the Sin curve
	this.xPos = x,
	this.yPos = Math.floor(random(height * 0.28, height * 0.42));
	this.duration = 10;
	this.size = Math.floor(random(width * 0.045, width * 0.065));
	this.xRange = this.xPos + random(width/9, width/3);
	this.yRange = this.yPos + random(height * 0.042, height * 0.083);
	this.windSpeed = random(1, 1.3);

	this.renderCloud = function()
		{
			push();
			noStroke();
			
			let timeX = Date.now()/ 1000 //time in seconds
			let t1 = map(sin(timeX/this.duration * PI), -1, 1, 0, 1) //map t so that t in range of 0 and 1. because if t = sin(time/duration * PI) t is in the range of [-1,1]
			let x = lerp(this.xPos, this.xRange, t1 * this.windSpeed);

			let timeY = Date.now()/ 1000 //time in seconds
			let t2 = sin(timeY/this.duration * 3.5); //Higher the number means each clouds moving up and down more because the sin curve is steeper
			let y = lerp(this.yPos, this.yRange, t2);

			fill(173, 216, 230, 180); // Light Blue
			ellipse(x + this.size*0.56, y - this.size*0.19, this.size*0.5, this.size*0.5);
			ellipse(x + this.size*0.81, y - this.size*0.19, this.size*0.3, this.size*0.3);
			ellipse(x + this.size*0.31, y - this.size*0.19, this.size*0.3, this.size*0.3);

			fill(173, 216, 230, 180); // Light Blue
			ellipse(x - this.size*0.5, y - this.size*0.12, this.size*0.5, this.size*0.5);
			ellipse(x - this.size*0.75, y - this.size*0.12, this.size*0.3, this.size*0.3);
			ellipse(x - this.size*0.25, y - this.size*0.12, this.size*0.3, this.size*0.3);
				
			fill(250, 235, 215); // Antique White
			ellipse(x - this.size*0.31, y + this.size*0.5, this.size*1.05, this.size*0.75);
			ellipse(x + this.size*0.37, y + this.size*0.43, this.size*1.05, this.size*0.75);

			fill(245, 245, 245); // White Smoke
			ellipse(x, y, 100, this.size);
			ellipse(x - this.size*0.4, y + this.size*0.31, this.size*1.2, this.size*0.75);
			ellipse(x + this.size*0.31, y + this.size*0.005, this.size*1.05, this.size*0.75);
			ellipse(x + this.size*0.81, y + this.size*0.37, this.size*1.3, this.size*0.75);
			ellipse(x + this.size*0.19, y + this.size*0.37, this.size*0.5, this.size*0.75);
			pop();
		}
}

function Mountain(x, mSize)
{	
	// Core idea: Make mountain shape using curveVertex
	this.xPos = x;
	this.baseRed = 80;
	this.baseGreen = 100;
	this.baseBlue = 150; 
	this.size = mSize;
	this.variant1 = random(-40, 10);
	this.variant2 = random(-40, 10);
	this.variant3 = random(-0.3,0.6); // Add a little randomness in varriant

	this.renderMountain = function()
		{	
			push();
			// Mountain on the left
			// Map color of the mountains so it will be darker when time comes. The base color of the mountain can be changed later
			let red = map(risetime, 0, 1, this.baseRed, this.baseRed/4);
			let green = map(risetime, 0, 1, this.baseGreen, this.baseGreen/4);
			let blue = map(risetime, 0, 1, this.baseBlue, this.baseBlue/4);

			fill(red, green, blue);
			beginShape();
			curveVertex(this.xPos + this.variant1, ground_level);
			curveVertex(this.xPos + this.variant1, ground_level);
			curveVertex(this.xPos + this.size*0.33 + this.variant1, ground_level - this.size*0.58);
			curveVertex(this.xPos + this.size*0.67 + this.variant1, ground_level - this.size*0.5);
			curveVertex(this.xPos + this.size*0.83 + this.variant1, ground_level);
			curveVertex(this.xPos + this.size*0.83 + this.variant1, ground_level);
			endShape();

			if (this.variant3 > 0)
			{
				// Mountain on the right
				// Re-map color
				red = map(risetime, 0, 1, this.baseRed/4, this.baseRed/8);
				green = map(risetime, 0, 1, this.baseGreen, this.baseGreen*0.66);
				blue = map(risetime, 0, 1, this.baseBlue, this.baseBlue/4);

				fill(red, green, blue);
				beginShape();
				curveVertex(this.xPos + this.size*0.33 + this.variant2, ground_level);
				curveVertex(this.xPos + this.size*0.33 + this.variant2, ground_level);
				curveVertex(this.xPos + this.size*0.58 + this.variant2, ground_level - this.size*0.25);
				curveVertex(this.xPos + this.size*0.75 + this.variant2, ground_level - this.size*0.25);
				curveVertex(this.xPos + this.size + this.variant2, ground_level);
				curveVertex(this.xPos + this.size + this.variant2, ground_level);
				endShape();
			}
			pop();
		}
}

function WaterFall(x, s)
{	
	// Core idea: Shaped like a mountain but will have waters falling top-down into the lake/ river below. This function will only render the mountain part.
	this.xPos = x;
	this.size = s;

	this.baseRed = 80;
	this.baseGreen = 100;
	this.baseBlue = 150; 

	this.renderWaterFall = function()
	{	
		push();
		// Waterfall on the left
		// Map color of the waterfalls so it will be darker when time comes. The base color of the mountain can be changed later
		let red = map(risetime, 0, 1, this.baseRed, this.baseRed/4);
		let green = map(risetime, 0, 1, this.baseGreen, this.baseGreen/4);
		let blue = map(risetime, 0, 1, this.baseBlue, this.baseBlue/4);

		fill(red, green, blue);
		beginShape();
		curveVertex(this.xPos, ground_level);
		curveVertex(this.xPos, ground_level);
		curveVertex(this.xPos + this.size*0.33, ground_level - this.size*0.58);
		curveVertex(this.xPos + this.size*0.67, ground_level - this.size*0.5);
		curveVertex(this.xPos + this.size*0.83, ground_level);
		curveVertex(this.xPos + this.size*0.83, ground_level);
		endShape();

		// waterfall on the right
		// Re-map color
		red = map(risetime, 0, 1, this.baseRed/4, this.baseRed/8);
		green = map(risetime, 0, 1, this.baseGreen, this.baseGreen*0.66);
		blue = map(risetime, 0, 1, this.baseBlue, this.baseBlue/4);

		fill(red, green, blue);
		beginShape();
		curveVertex(this.xPos + this.size*0.33, ground_level);
		curveVertex(this.xPos + this.size*0.33, ground_level);
		curveVertex(this.xPos + this.size*0.58, ground_level - this.size*0.25);
		curveVertex(this.xPos + this.size*0.75, ground_level - this.size*0.25);
		curveVertex(this.xPos + this.size, ground_level);
		curveVertex(this.xPos + this.size, ground_level);
		endShape();
		pop();
	}
}

function Tree(x, p)
{	
	// Core idea: A set of ellipses on top of a triangle. The top point of the triangle would be the center point of the center ellipse
	this.xPos = x;
	this.properties = p;
	this.treeCenterX = x + p.trunkWidth/2;
	this.treeCenterY = ground_level - p.trunkHeight + random(-30, 18);
	this.treebough = p.trunkWidth*1.5 + random(-15, 15);

	this.renderTree = function()
		{	
			push();
			// The trunk
			strokeWeight(1);
			fill(this.properties.clr1);
			triangle(this.xPos, ground_level, this.xPos + this.properties.trunkWidth, ground_level, this.xPos + this.properties.trunkWidth/2, this.treeCenterY);
			strokeWeight(0.5);
			stroke(165,99,60);
			ellipse(this.treeCenterX, ground_level - this.properties.trunkHeight*0.3, this.properties.trunkWidth*0.6, this.properties.trunkHeight*0.5);
			ellipse(this.treeCenterX, ground_level - this.properties.trunkHeight*0.3, this.properties.trunkWidth*0.5, this.properties.trunkHeight*0.4);
			ellipse(this.treeCenterX, ground_level - this.properties.trunkHeight*0.3, this.properties.trunkWidth*0.3, this.properties.trunkHeight*0.3);
			noStroke();
		
			// The Leaves
			fill(this.properties.clr2);
			ellipse(this.treeCenterX - this.treebough/2, this.treeCenterY*1.05, this.treebough*0.5, this.treebough*0.5);
			ellipse(this.treeCenterX + this.treebough/2, this.treeCenterY*1.05, this.treebough*0.5, this.treebough*0.5);
			ellipse(this.treeCenterX, this.treeCenterY, this.treebough, this.treebough*1.2);
		
			// Details
			fill(this.properties.clr3);
			ellipse(this.treeCenterX, this.treeCenterY*0.995, this.treebough*0.8, this.treebough*1);
			fill(this.properties.clr4);
			ellipse(this.treeCenterX, this.treeCenterY*0.995, this.treebough*0.5, this.treebough*0.7);
			ellipse(this.treeCenterX - this.treebough/2, this.treeCenterY*1.05, this.treebough*0.2, this.treebough*0.2);
			ellipse(this.treeCenterX + this.treebough/2, this.treeCenterY*1.05, this.treebough*0.2, this.treebough*0.2);
			pop();
		}
}

function Bush(x)
{	
	// Core idea: Set of ellipse with their lower parts hidden by re-drawing part of the ground.
	this.xPos = x,
	this.size = bushes.size + random(-5, 13.5),
	this.yPos = ground_level - bushes.size * 0.25,
	this.dept = surfaceDept,

	this.renderBush = function()
		{
			push();
			let red = map(risetime, 0, 1, 88, 0);	
			let green = map(risetime, 0, 1, 169, 40);
			let blue = map(risetime, 0, 1, 30, 0);

			// Center
			fill(red, green, blue);
			ellipse(this.xPos, this.yPos, this.size, this.size);
			ellipse(this.xPos + this.size*0.625, this.yPos, this.size, this.size);
			ellipse(this.xPos + this.size*1.25, this.yPos, this.size, this.size);

			red = map(risetime, 0, 1, 88, 0);
			green = map(risetime, 0, 1, 200, 70);
			blue = map(risetime, 0, 1, 30, 0);
			fill(red, green, blue);
			ellipse(this.xPos, this.yPos, this.size*0.8, this.size*0.8);
			ellipse(this.xPos + this.size*0.625, this.yPos, this.size*0.8, this.size*0.8);
			ellipse(this.xPos + this.size*1.25, this.yPos, this.size*0.8, this.size*0.8);

			fill(120, 40, 10);
			ellipse(this.xPos + this.size*0.6, this.yPos, this.size*0.125, this.size*0.125);
			ellipse(this.xPos + this.size*0.02, ground_level - this.size*0.375, this.size*0.125, this.size*0.125);
			ellipse(this.xPos + this.size*1.2, ground_level - this.size*0.375, this.size*0.125, this.size*0.125);

			// Re-draw part of the ground where the bushes are so the bottom of our bushes won't appear on the screen. 
			// Upper Layer
			fill(161, 223, 80); 
			rect(this.xPos - this.size/2, ground_level, this.size*2.5, surfaceDept); 

			// Flyflies at night
			if (dayTime == 'night')
			{	
				fill(255, 250, 205, random(100, 200));
				ellipse(this.xPos + random(this.size*0.1, this.size*1.1), random(this.yPos*0.9, this.yPos), 7, 7);
			}
			pop();
		}
}

function Canyon(x, s)
{	
	// Core idea: a pit that when Char fall in he die. Will have a fire at bottom
	this.xPos = x;
	this.size = s;
	this.dept = canyons.dept;

	this.renderCanyon = function()
	{
		push();
		// Take color from the ground and darken it (RGB values * 0.7), then darken it more at night.
		// surface layers
		Red = map(risetime, 0, 1, 34, 19);
		Green = map(risetime, 0, 1, 56, 32);
		Blue = map(risetime, 0, 1, 56, 32);

		fill(Red, Green, Blue);
		beginShape();
		vertex(this.xPos, ground_level);
		vertex(this.xPos + this.size, ground_level);
		vertex(this.xPos + this.size*0.87, ground_level + surfaceDept*0.5);
		vertex(this.xPos, ground_level + surfaceDept*0.5);
		endShape(CLOSE);

		fill(Red, Green, Blue);
		beginShape();
		vertex(this.xPos, ground_level);
		vertex(this.xPos, ground_level + surfaceDept*0.5);
		vertex(this.xPos - this.size*0.25, ground_level + surfaceDept*1.5);
		vertex(this.xPos - this.size*0.25, ground_level + surfaceDept);
		endShape(CLOSE);

		Red = map(risetime, 0, 1, 37, 21);
		Green = map(risetime, 0, 1, 37, 21);
		Blue = map(risetime, 0, 1, 0, 0);
		fill(Red, Green, Blue);
		beginShape();
		vertex(this.xPos - this.size*0.25, ground_level + surfaceDept*1.5);
		vertex(this.xPos, ground_level + surfaceDept*0.5);
		vertex(this.xPos, height);
		vertex(this.xPos - this.size*0.25, height);
		endShape(CLOSE);

		beginShape()
		vertex(this.xPos, ground_level + surfaceDept*0.5);
		vertex(this.xPos + this.size * 0.87, ground_level + surfaceDept*0.5);
		vertex(this.xPos + this.size * 0.75, ground_level + surfaceDept);
		vertex(this.xPos + this.size* 0.75, height);
		vertex(this.xPos, height);
		endShape(CLOSE);

		pop();

	// Draw the canyon fire!
	this.renderCanyonFire = function()
		{	
			push();
			// outer fire
			this.fireX = this.xPos + this.size * 0.3;
			this.fireY = height;
			this.fireSize = this.size * 0.35;
			this.k = random(-this.fireSize * 0.1, this.fireSize * 0.1);
			this.t = random(-this.fireSize * 0.05, this.fireSize * 0.05);
			
			beginShape();
			noStroke();
			fill(255, 50, 0, random(200, 255));

			vertex(this.fireX, this.fireY);
			bezierVertex(this.fireX - this.fireSize, this.fireY - this.fireSize * 0.1, this.fireX - this.fireSize * 0.9, this.fireY - this.fireSize * 0.7, this.fireX - this.fireSize * 0.8 + this.k, this.fireY - this.fireSize*1.1 + this.t);
			vertex(this.fireX - this.fireSize * 0.8 + this.k, this.fireY - this.fireSize*1.1 + this.t);
			bezierVertex(this.fireX - this.fireSize * 0.8, this.fireY - this.fireSize * 0.8, this.fireX - this.fireSize * 0.45, this.fireY - this.fireSize * 0.6, this.fireX - this.fireSize * 0.5 + this.k, this.fireY - this.fireSize * 0.5 + this.t);
			vertex(this.fireX - this.fireSize * 0.5 + this.k, this.fireY - this.fireSize * 0.5 + this.t);
			bezierVertex(this.fireX - this.fireSize * 0.45, this.fireY - this.fireSize * 0.9, this.fireX - this.fireSize * 0.2, this.fireY - this.fireSize * 1.5, this.fireX + this.fireSize * 0.3 + this.k, this.fireY - this.fireSize * 1.7 + this.t); 
			vertex(this.fireX + this.fireSize * 0.3 + this.k, this.fireY - this.fireSize * 1.7 + this.t);
			bezierVertex(this.fireX + this.fireSize * 0.3, this.fireY - this.fireSize * 1.7, this.fireX - this.fireSize * 0.1, this.fireY - this.fireSize * 1.3, this.fireX + this.k, this.fireY - this.fireSize * 0.7 + this.t);
			vertex(this.fireX + this.k, this.fireY - this.fireSize * 0.7 + this.t);
			bezierVertex(this.fireX + this.fireSize * 0.3, this.fireY - this.fireSize * 0.9, this.fireX + this.fireSize * 0.3, this.fireY - this.fireSize, this.fireX + this.fireSize * 0.5 + this.k, this.fireY - this.fireSize * 1.2 + this.t);
			vertex(this.fireX + this.fireSize * 0.5 + this.k, this.fireY - this.fireSize * 1.2 + this.t);
			bezierVertex(this.fireX + this.fireSize * 0.55, this.fireY - this.fireSize * 0.7, this.fireX + this.fireSize + this.k, this.fireY - this.fireSize * 0.4 + this.t, this.fireX, this.fireY);
			endShape(CLOSE);

			// inner fire
			this.fireX = this.fireX + random(this.fireSize * -0.2, this.fireSize * 0.2);
			this.fireY = this.fireY - this.fireSize * 0.05;
			this.fireSize = this.fireSize * 0.6;
			this.k = random(- this.fireSize * 0.05, this.fireSize * 0.05);
			this.t = random(- this.fireSize * 0.05, this.fireSize * 0.05);

			beginShape();
			noStroke();
			fill(255, 140, 0, random(120, 240));

			vertex(this.fireX, this.fireY);
			bezierVertex(this.fireX - this.fireSize, this.fireY - this.fireSize * 0.1, this.fireX - this.fireSize * 0.9, this.fireY - this.fireSize * 0.7, this.fireX - this.fireSize * 0.8 + this.k, this.fireY - this.fireSize*1.1 + this.t);
			vertex(this.fireX - this.fireSize * 0.8 + this.k, this.fireY - this.fireSize*1.1 + this.t);
			bezierVertex(this.fireX - this.fireSize * 0.8, this.fireY - this.fireSize * 0.8, this.fireX - this.fireSize * 0.45, this.fireY - this.fireSize * 0.6, this.fireX - this.fireSize * 0.5 + this.k, this.fireY - this.fireSize * 0.5 + this.t);
			vertex(this.fireX - this.fireSize * 0.5 + this.k, this.fireY - this.fireSize * 0.5 + this.t);
			bezierVertex(this.fireX - this.fireSize * 0.45, this.fireY - this.fireSize * 0.9, this.fireX - this.fireSize * 0.2, this.fireY - this.fireSize * 1.5, this.fireX + this.fireSize * 0.3 + this.k, this.fireY - this.fireSize * 1.7 + this.t); //
			vertex(this.fireX + this.fireSize * 0.3 + this.k, this.fireY - this.fireSize * 1.7 + this.t);
			bezierVertex(this.fireX + this.fireSize * 0.3, this.fireY - this.fireSize * 1.7, this.fireX - this.fireSize * 0.1, this.fireY - this.fireSize * 1.3, this.fireX + this.k, this.fireY - this.fireSize * 0.7 + this.t);
			vertex(this.fireX + this.k, this.fireY - this.fireSize * 0.7 + this.t);
			bezierVertex(this.fireX + this.fireSize * 0.3, this.fireY - this.fireSize * 0.9, this.fireX + this.fireSize * 0.3, this.fireY - this.fireSize, this.fireX + this.fireSize * 0.5 + this.k, this.fireY - this.fireSize * 1.2 + this.t);
			vertex(this.fireX + this.fireSize * 0.5 + this.k, this.fireY - this.fireSize * 1.2 + this.t);
			bezierVertex(this.fireX + this.fireSize * 0.55, this.fireY - this.fireSize * 0.7, this.fireX + this.fireSize + this.k, this.fireY - this.fireSize * 0.4 + this.t, this.fireX, this.fireY);
			endShape(CLOSE);

			pop();
		}
	}
}

function Lake(x, s)
{	
	// Core idea: Make a lake that when Char falls down he die just like with Canyon. Will have 2 layers and tides
	this.xPos = x;
	this.size = s;
	this.dept = lakes.dept;

	this.renderRiver = function()
	{
		push();
		// The sands
		fill(250, 242, 195);
		beginShape();
		vertex(this.xPos, ground_level);
		vertex(this.xPos - this.size* 0.1, ground_level);
		vertex(this.xPos - this.size* 0.12, ground_level + surfaceDept);
		vertex(this.xPos - this.size * 0.05, ground_level + surfaceDept);
		endShape();

		fill(200, 150, 0);
		beginShape();
		vertex(this.xPos - this.size* 0.12, ground_level + surfaceDept);
		vertex(this.xPos - this.size * 0.05, ground_level + surfaceDept);
		vertex(this.xPos - this.size * 0.05, height);
		vertex(this.xPos - this.size* 0.12, height);
		endShape();

		// The water layers
		// Lower
		Red = map(risetime, 0, 1, 70, 35);
		Green = map(risetime, 0, 1, 130, 65);
		Blue = map(risetime, 0, 1, 180, 90);
		fill(Red, Green, Blue);
		beginShape();
		vertex(this.xPos - this.size * 0.05, ground_level + surfaceDept);
		vertex(this.xPos + this.size * 0.95, ground_level + surfaceDept);
		vertex(this.xPos + this.size * 0.95, height);
		vertex(this.xPos - this.size * 0.05, height);
		endShape(CLOSE);

		// Upper
		fill(240, 248, 255, 100);
		beginShape();
		vertex(this.xPos, ground_level);
		vertex(this.xPos + this.size, ground_level);
		vertex(this.xPos + this.size * 0.95, ground_level + surfaceDept);
		vertex(this.xPos - this.size * 0.05, ground_level + surfaceDept);
		endShape(CLOSE);

		Red = map(risetime, 0, 1, 212, 160);
		Green = map(risetime, 0, 1, 241, 195);
		Blue = map(risetime, 0, 1, 249, 200);

		fill(Red, Green, Blue);
		beginShape();
		vertex(this.xPos, ground_level);
		vertex(this.xPos + this.size, ground_level);
		vertex(this.xPos + this.size * 0.95, ground_level + surfaceDept);
		vertex(this.xPos - this.size * 0.05, ground_level + surfaceDept);
		endShape(CLOSE);

		// Tides
		let duration1 = 5
		let timeX1 = Date.now()/ 1000 //time in seconds
		let t1 = map(sin(timeX1/duration1 * PI), -1, 1, 0, 1) // first ball movement
		let x1 = lerp(this.xPos - this.size*0.02, this.xPos - this.size*0.09, t1);
		fill(0, 25, 50);

		let duration2 = 5;
		let timeX2 = Date.now()/ 1000 //time in seconds
		let t2 = map(sin(timeX2/duration2 * PI), -1, 1, 1, 0) // opposites with the first ball movement
		let x2 = lerp(this.xPos  - this.size*0.02, this.xPos - this.size*0.09, t2);
		fill(50, 25, 0);

		beginShape();
		strokeWeight(1);
		stroke(255, 255, 255);
		fill(Red, Green, Blue);
		vertex(this.xPos, ground_level);
		bezierVertex(x1, ground_level + surfaceDept * 0.25, x2, ground_level + surfaceDept * 0.7, this.xPos - this.size * 0.05, ground_level + surfaceDept);
		noStroke();
		endShape();

		let duration3 = 5;
		let timeX3 = Date.now()/ 1000 //time in seconds
		let t3 = map(sin(timeX3/duration3 * PI), -1, 1, 0, 1) // first ball movement
		let x3 = lerp(this.xPos + this.size * 1.02, this.xPos + this.size * 1.09, t3);
		fill(0, 25, 50);

		let duration4 = 5;
		let timeX4 = Date.now()/ 1000 //time in seconds
		let t4 = map(sin(timeX4/duration4 * PI), -1, 1, 0, 1) // first ball movement
		let x4 = lerp(this.xPos + this.size * 1.02, this.xPos + this.size * 1.09, t4);
		fill(0, 25, 50);

		beginShape();
		strokeWeight(1);
		stroke(255, 255, 255);
		fill(Red, Green, Blue);
		vertex(this.xPos + this.size, ground_level);
		bezierVertex(x3, ground_level + surfaceDept * 0.25, x4, ground_level + surfaceDept * 0.7, this.xPos + this.size * 0.95, ground_level + surfaceDept);
		noStroke();
		endShape();

		// rock
		image(img_rockborder, this.xPos - this.size*0.06, ground_level + surfaceDept * 0.75)
		pop();
	}
}

function render_fire_spirit()
{	
	push();
	// form
	fill(223, 34, 34);
	beginShape();
	vertex(fireSpirit.x, fireSpirit.y);
	bezierVertex(fireSpirit.x - fireSpirit.size, fireSpirit.y - fireSpirit.size * random(0.2, 0.4), fireSpirit.x - fireSpirit.size * 0.1, fireSpirit.y - fireSpirit.size * random(0.6, 0.8), fireSpirit.x, fireSpirit.y - fireSpirit.size * random(1.1, 1.3));
	vertex(fireSpirit.x, fireSpirit.y - fireSpirit.size * random(1.1, 1.3));
	bezierVertex(fireSpirit.x + fireSpirit.size * 0.1, fireSpirit.y - fireSpirit.size * random(0.6, 0.8), fireSpirit.x + fireSpirit.size, fireSpirit.y - fireSpirit.size * random(0.2, 0.4), fireSpirit.x, fireSpirit.y);
	endShape(CLOSE);

	// core
	fill(255, 140, 0);
	ellipse(fireSpirit.x, fireSpirit.y - fireSpirit.size * 0.3, fireSpirit.size * 0.5);
	fill(255, 255, 0);
	ellipse(fireSpirit.x, fireSpirit.y - fireSpirit.size * 0.2, fireSpirit.size * 0.2);

	// tail point of gameChar = [this.xPos - this.width * k, this.yPos - this.height * 0.5] // k is either 1 or -1
	if (gameChar.isRight)
	{
		fireSpirit.x += (gameChar.xPos - gameChar.width- fireSpirit.x - scrollPos)/10;
		fireSpirit.y += (gameChar.yPos - gameChar.height * 0.6 - fireSpirit.y)/10
	} 
	
	if (gameChar.isLeft)
	{
		fireSpirit.x += (gameChar.xPos + gameChar.width - fireSpirit.x - scrollPos)/10;
		fireSpirit.y += (gameChar.yPos - gameChar.height * 0.6 - fireSpirit.y)/10;
	}

	// standing or jumping/ falling straight- isLeft && isRight both false.
	if (!gameChar.isLeft && !gameChar.isRight)
	{
		fireSpirit.x += (gameChar.xPos - gameChar.width - fireSpirit.x - scrollPos)/10;
		fireSpirit.y += (gameChar.yPos - gameChar.height * 0.6 - fireSpirit.y)/10
	}
	pop();
}

function renderBurnParticles(x, y, s)
{	
	if (frameCount % fps == 0)
	{
		for (let i = 0; i < 7; i++) //7 particles each second
		{
			let p = new BurnParticle(x, y, s);
			canyonFire.burningParticle.push(p);
		}
	}

    for (let i = canyonFire.burningParticle.length - 1; i >= 0; i--) // Going backwards to avoid skipping.
    {	
		canyonFire.burningParticle[i].render();
        canyonFire.burningParticle[i].update();
        if (canyonFire.burningParticle[i].finish())
        {
            canyonFire.burningParticle.splice(i, 1);
        }
    }
}

function renderExplosion(x, y, s)
{
	let p = new Explosion(x, y, s);
	explosions.properties.push(p);

	for (let i = explosions.properties.length - 1; i >= 0; i--)
	{
		explosions.properties[i].render();
		explosions.properties[i].update();

		if (explosions.properties[i].finish())
		{
			explosions.properties.splice(i, 1);
		}
	} 
}

function renderBubbles(x, y, s)
{
	let p = new WaterBubble(x, y, s);
	water_bubbles.properties.push(p);

	for (let i = water_bubbles.properties.length - 1; i >= 0; i--)
	{
		water_bubbles.properties[i].render();
		water_bubbles.properties[i].update();
		if (water_bubbles.properties[i].finish())
		{
			water_bubbles.properties.splice(i, 1);
		}
	} 
}

function renderRipple(xStart, yStart, size)
{	
	if (frameCount % fps == 0)
	{	
		for (let i = 0; i < 5; i++)
		{
			let p = new WaterRipple(xStart, yStart, size);
			water_ripple.properties.push(p);
		}
	}


	for (let i = water_ripple.properties.length - 1; i > 0; i--)
	{
		water_ripple.properties[i].render();
		water_ripple.properties[i].update();
		if (water_ripple.properties[i].finish())
		{
			water_ripple.properties.splice(i, 1);
		}
	}
}

class BurnParticle
{   
	// Core idea: make a set of flame-shaped particles expanding up
    constructor(x, y, s)
    {
        this.x = x;
        this.y = y;
		this.size = s;
        this.alpha = 150;
        this.velocityX = random(-1.7, 1.7);
        this.velocityY = random(-3, 0);
    }

    render()
    {   
        fill(255, 140, 0, this.alpha);
		beginShape();
		vertex(this.x, this.y);
		bezierVertex(this.x - this.size, this.y - this.size * 0.3, this.x - this.size * 0.1, this.y - this.size * 0.7, this.x, this.y - this.size * 1.2);
		vertex(this.x, this.y - this.size * 1.2);
		bezierVertex(this.x + this.size * 0.1, this.y - this.size * 0.7, this.x + this.size, this.y - this.size * 0.3, this.x, this.y);
		endShape(CLOSE);
    }

    update()
    {   
        this.x += this.velocityX;
        this.y += this.velocityY;
        this.alpha -= 4;
    }

    finish()
    {
        return this.alpha < 0;
    }
}

class Explosion
{	
	// Core idea: Make a set of particles sets off to 4 direction, fade as the go further.
	// Color will be the color of enemies mix with the color of the Fire Spirit.
	constructor(x, y, s)
	{
		this.x = x;
		this.y = y;
		this.size = s;
		this.alpha = 200 + random(-20, 30);
		this.velocityX = random(-2.5, 2.5);
		this.velocityY = random(-2.5, 2.5);
	}

	update()
	{
		this.x += this.velocityX;
		this.y += this.velocityY;
		this.alpha -= 5;
	}

	render()
	{	
		strokeWeight(1);
		let k = random(0,1);
		if (k > 0.5) {fill(32, 178, 170, this.alpha);} else {fill(255, 165, 0, this.alpha);}
		ellipse(this.x, this.y, this.size);		
	}

	finish()
	{
		return this.alpha < 0;
	}
}

class WaterBubble
{	
	// Core idea: Make a row of bubbles that (at first) falls straight down
	// When bubbles reach a certain height they will spread out to better immitating real life
	constructor(x, y, s)
	{
		this.x = x;
		this.y = y;
		this.size = s;
		this.alpha = 200 + random(-50, 50);
		this.velocityY = random(1, 4);
		this.velocityX = random(-1, 1);
	}

	update()
	{
		this.y += this.velocityY;
		this.alpha -= 1.5;

		if (this.y >= ground_level - water_bubbles.size * 10)
		{
			this.x += this.velocityX;
		}
	}

	render()
	{
		for (let i = 0; i < 10; i++)
		{
			fill(212, 241, 249, this.alpha);
			ellipse(this.x + water_bubbles.size * i, this.y + random(-2, 2), water_bubbles.size);
		}
	}

	finish()
	{
		return this.alpha < 0;
	}
}

class WaterRipple
{	
	// Core ideas: Make a row of ripple expanding as they heads towards the lower part of the screen. Each ripple will have the form of an arc.
	constructor(xStart, yStart, size)
	{
		this.xStart = xStart + random(-5, 5);
		this.yStart = yStart;
		this.velocityX = random (-1, 1);
		this.velocityY = random(1, 4)
		this.size = size; //Will be the "height" of the ripple
		this.expanding = 1;
		this.waveWidth = 0.7;
	}

	render()
	{	
		push();
		for (let i = 0; i < 5; i++)
		{
			noFill();
			stroke(255, 255, 255);
			strokeWeight(this.waveWidth);
			arc(this.xStart + 50 * i, this.yStart, this.size*1.5, this.size, 0, PI);
		}
		pop();
	}

	update()
	{	
		this.size += this.expanding,
		this.xStart += this.velocityX;
		this.yStart += this.velocityY;
	}

	finish()
	{
		return this.yStart >= ground_level + surfaceDept * 0.6;
	}
}

function module_collision_canyon() 
{	
	// check collision condition for the canyons and take action accordingly.
	for (let i = 0; i < canyons.properties.length; i ++)
	{
		if (gameChar.xPos > canyons.properties[i].xPos + scrollPos && gameChar.xPos < canyons.properties[i].xPos + scrollPos + canyons.properties[i].size && gameChar.yPos >= ground_level)
		{
			gameChar.isPlummeting = true;
			deathBy_falling = true;
			sound_fallingDeath.play();
			return;
		} 
			else 
		{
			gameChar.isPlummeting = false;
		}
	}
}

function module_collision_lake() 
{	
	// check collision condition for the lakes and take action accordingly.
	for (let i = 0; i < lakes.properties.length; i ++)
	{
		if (gameChar.xPos > lakes.properties[i].xPos + scrollPos && gameChar.xPos < lakes.properties[i].xPos + scrollPos + lakes.properties[i].size && gameChar.yPos >= ground_level)
		{
			gameChar.isPlummeting = true;
			deathBy_falling = true;
			sound_fallingDeath.play();
			return;
		} 
			else 
		{
			gameChar.isPlummeting = false;
		}
	}
}

function module_collision_enemies()
{	
	// When Char hit enemy, deathBy_enemy will be set to true for Char to go up the sky and die
	for (let i = 0; i < enemies.properties.length; i++)
	{	
		if (dist(gameChar.xPos, gameChar.yPos, enemies.properties[i].xPos + scrollPos, enemies.properties[i].yPos) <= enemies.properties[i].size) 
		{	
			sound_charKilled.play();
			deathBy_enemy = true;
		} 
	}
}

function module_collision_collectibles()
{
	// Add rumble effect when the character is close to a collectible
	for (let i = 0; i< collectible.properties.length; i++)
	{
		if (dist(gameChar.xPos, gameChar.yPos, collectible.properties[i].xPos + scrollPos, collectible.properties[i].yPos) <= collectible.properties[i].size + 100) 
		{	
			collectible.properties[i].rumbleAmt = random(-2, 2);
		}
	}

	// Check Collision of collision. I add scrollPos to the formula so the collectibles coordinates "move" accordingly when side scrolling. 
	// In the lessons isFound is used to make an If statement to whether or not we draw the collectibles. However I think the method I'm using is better for scaling
	// I just check their collison like normal and then remove that collectible from our array, so in the next draw circle it would not be drawn anymore.
	// Collectibles will be reset after character death using collectible.Original array.

	for (let i = 0; i< collectible.properties.length; i++)
	{
		if (dist(gameChar.xPos, gameChar.yPos, collectible.properties[i].xPos + scrollPos, collectible.properties[i].yPos) <= collectible.properties[i].size) 
		{	
			sound_collectArtifact.play();
			collectible.properties.splice(i,1);
		}
	}
}

function module_collision_FireSpirit()
{	
	// Fire Spirit's hitbox will be slightly bigger than its size. Gameplay features
	for (let i = 0; i < enemies.properties.length; i++)
	{	
		if (dist(fireSpirit.x, fireSpirit.y, enemies.properties[i].xPos, enemies.properties[i].yPos) <= fireSpirit.size * 1.2) 
		{
			explosions.xPos = enemies.properties[i].xPos;
			explosions.yPos = enemies.properties[i].yPos;
			explosions.start = Date.now()/1000; // Set timer
			explosions.set = true; // condition to start timer "count down"
			sound_enemyExplode.play();
			enemies.properties.splice(i, 1);
		}
	}
}

function module_check_death()
{	
	// When Char hit an enemy he will go up, when Char die by falling he will go down, both until out of bounds.
	// Take actions when Character die
	if (gameChar.yPos >= height || gameChar.yPos < 0)
	{
		lives_count -= 1;
		if (lives_count > 0)
		{	
			start_game("stage1");
		} 
	}

	// Draw heart
	for (let i = 0; i < lives_count; i++)
	{	
		module_draw_heart(120 + i * 50, 100, 20);
	}
}

function module_draw_heart(x, y, size)
{	
	// Draw a simple heart
	push();
	fill(200, 100, 100);
	beginShape();
	noStroke();
	vertex(x, y);
	bezierVertex(x - size / 2, y - size / 2, x - size, y + size / 3, x, y + size);
	bezierVertex(x + size, y + size / 3, x + size / 2, y - size / 2, x, y);
	endShape(CLOSE);
	pop();
}

function render_flag_pole()
{	
	// Flagpoint has 2 parts. The pole and the flag. 
	push();
	stroke(40);
	strokeWeight(5);
	line(flag_pole.xPos, ground_level, flag_pole.xPos, flag_pole.yPos);
	fill(50, 150, 100);
	noStroke();
	rect(flag_pole.xPos, flag_pole.flagY, flag_pole.flagSize*1.2, flag_pole.flagSize);
	pop();
}

function module_reach_flagpole()
{	
	// Make flag falls down first. When Flag hit the ground only then stage truly finish.
	// This also fixes a bug when we return immediately after playing sound, the sound will keep looping annoyingly.
	if (gameChar.xPos > (flag_pole.xPos + scrollPos))
	{	
		flag_pole.flagY += 5;
		sound_finishLevel.play();
	}

	if (flag_pole.flagY >= ground_level - flag_pole.flagSize)
	{
		flag_pole.isReached = true;
		flag_pole.flagY = ground_level - flag_pole.flagSize;
	} 

}

function module_check_platform()
{	
	// Check whether Character is on Platform
	on_platform = false;
	for (let i = 0; i < platforms.properties.length; i++)
	{
		if (abs(gameChar.yPos - platforms.properties[i].yPos) < 10 //certain forgiveness when jump to platform
		&& gameChar.xPos > platforms.properties[i].xPos + scrollPos 
		&& gameChar.xPos < platforms.properties[i].xPos + platforms.properties[i].size + scrollPos)
		{	
			on_platform = true;
			gameChar.yPos = platforms.properties[i].yPos;
		} 
	}
}

function module_check_Vplatform()
{	
	// Check whether Character is on Platform
	for (let i = 0; i < vertical_platforms.properties.length; i++)
	{   
		if (abs(gameChar.yPos - vertical_platforms.properties[i].yPos) < 10 //certain forgiveness when jump to platform
		&& gameChar.xPos > vertical_platforms.properties[i].xPos + scrollPos 
		&& gameChar.xPos < vertical_platforms.properties[i].xPos + vertical_platforms.properties[i].size + scrollPos)
		{	
			on_platform = true;
			gameChar.yPos = vertical_platforms.properties[i].yPos;
		} 
	}
}
	
function module_prep_starrySky()
{	
	// Should only cover the upper part of the background (the sky)
	starrySky = createGraphics(shared.width, ground_level*0.75);
	starrySky.starX = [];
	starrySky.starY = [];
	
	for (let i = 1; i < 100; i++)
	{
		starrySky.starX.push(Math.floor(random(starrySky.width)));
		starrySky.starY.push(Math.floor(random(starrySky.height)));
	}
}

function module_draw_starrySky()
{
	// Night time comes when risetime > 0.5
	// Star is in the sky all the time, they just become invisible at Day time. That's why I don't use if Statement and the dayTime variable in this case
	// To replicate that effect, make star change color to make the sky at day and turn them to white color at night. 
	// Map Star color to the color of the sky and white color.
	
	let StarRed = map(risetime, 0, 1, 100, 255);
	let StarGreen = map(risetime, 0, 1, 155, 255);
	let StarBlue = map(risetime, 0, 1, 255, 255);
	
	for (let i = 0; i< 100; i++)
	{
		starrySky.strokeWeight(0);
		starrySky.fill(StarRed, StarGreen, StarBlue);
		starrySky.ellipse(Number(starrySky.starX[i]), Number(starrySky.starY[i]), 2.2, 2.2);
	}
	image(starrySky, 0, 0);
}

function module_draw_Sun(theSun = {xPos, yPos, size, ray_Angle}) 
{	
	// Calculate sun height based on time of day. 
	theSun.yPos = lerp(theSun.yPos, height*2, risetime)

	// draw the sun
	strokeWeight(0);
	fill(255, 253, 55); // sunshine yellow 
	ellipse(theSun.xPos, theSun.yPos, theSun.size); //the core of the sun
	fill(255, 165, 0 , 100); // sun radiance
	ellipse(theSun.xPos, theSun.yPos, theSun.size*1.1);
	
	// The sun eyes
	fill(0); 
	ellipse(theSun.xPos-theSun.size/6, theSun.yPos - theSun.size/12, theSun.size/7);
	ellipse(theSun.xPos+theSun.size/6, theSun.yPos - theSun.size/12, theSun.size/7);

	//The sun mouth. Draw an arc with noFill and stroke so only the outline remains.
	noFill(); 
	strokeWeight(5);
	stroke(255, 165, 0);
	arc(theSun.xPos, theSun.yPos-theSun.size/50, theSun.size*0.2, theSun.size*0.2, 0.1*PI, 0.9*PI);
	
	// draw the sun particles
	for (let i=0; i<20; i++)
	{
		stroke(250, 250, 210) // LightGoldenRod Yellow

		// k is the percentage of how much the light particles spread out. 
		// The higher the sun to the ground the bigger the spreads.
		let k = map(abs(theSun.yPos-height), 0, height, 0.65, 1.2); 

		let x1 = theSun.xPos + random(theSun.size * 0.5, theSun.size * k) * cos(theSun.ray_Angle);
		let y1 = theSun.yPos + random(theSun.size * 0.5, theSun.size * k) * sin(theSun.ray_Angle);
		fill(255, 253, 55);
		ellipse(x1, y1, theSun.size * 0.08);
		theSun.ray_Angle ++;
	}
}

function module_draw_moon(theMoon = {xPos, maxHeight})
{
	// Take risetime from the Sun and reverse it by using map function
	theMoon.yPos = map(risetime, 0, 1, height, theMoon.maxHeight);
	
	// Draw the moon
	noStroke();
	fill(254, 252, 215);
	ellipse(theMoon.xPos, theMoon.yPos, theSun.size*0.7, theSun.size*0.7); //Moon has to be smaller than the sun
	
	for(i = 0; i < theSun.size*0.45; i++)
	{
		fill(254,252,215,2);
	  	ellipse(theMoon.xPos,theMoon.yPos, i*3);
	}
}

function module_draw_ground() 
{
	//Upper Layer
	fill(160, 224, 80); //Inchworm
	rect(0, ground_level, width, height); 

	//Middle layer
	fill(48, 80, 80);
	rect(0, ground_level + surfaceDept, width, ground_level - surfaceDept); 

	//Bottom layer
	fill(52,52,0);
	rect(0, ground_level + surfaceDept*1.5, width, height - ground_level - surfaceDept); 
}

// Control functions. Ideally it should be in another separate sketch file to make our game more modular but I have yet learn to do link multiple sketch files.
function keyPressed()
{
	if(key == 'a' || keyCode == 37) 
	{
		gameChar.isLeft = true;
	}

	if(key == 'd' || keyCode == 39) 
	{
		gameChar.isRight = true;
	}
	if ((key == " " || keyCode == 32) && (abs(gameChar.yPos - ground_level) < 5 || on_platform == true)) //fix a bug where sometimes after moving gameChar.yPos is just a few pixel below ground level, then it can't jump anymore
	{	
		gameChar.yPos -= 150;  //Jump Heigth 150
		sound_Jump.play();
	}

	// Reset the game when all lives has been used
	if (keyCode == 32 && death_reset == true)
	{	
		death_reset = false;
		lives_count = 3;
		start_game("stage1");
	}

	if((key == 'k' || keyCode == 75) && gameChar.ability_fire == true)
	{
		fireSpirit.x = gameChar.xPos - scrollPos + gameChar.attack_range;
	}

	if((key == 'j' || keyCode == 74) && gameChar.ability_fire == true)
	{
		fireSpirit.x = gameChar.xPos - scrollPos - gameChar.attack_range;
	}

	// reset Fire Spirt coordinates. Fix a bug where Fire Spirit keeps its last Coordinate on last run after reset and unintentially kill an enemy.
	if(gameChar.ability_fire == false) 
	{
		fireSpirit.x = 0;
		fireSpirit.y = 0;
	} 
}

function keyReleased()
{
	if(key == 'a' || keyCode == 37)	
	{
		gameChar.isLeft = false;
	}

	if(key == 'd' || keyCode == 39)	
	{
		gameChar.isRight = false;
	}
	if ((key == " " || keyCode == 32) && (gameChar.yPos == ground_level || on_platform == true))
	{
		gameChar.render_jump();
	}
}

function mousePressed()
{
	if (gameStage == "intro")
	{
		newStage = "stage1";
		play_BackgroundMusic();
	}
}

function play_BackgroundMusic()
{	
	sound_Maintheme.loop();
}


