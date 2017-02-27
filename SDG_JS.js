//Bullet variables
var bullets = []; // The shot that will be fired
var bulletSpeed = 30;   // The speed of the shot fired

//Player Variables
var player;
var playerX = 75;
var playerY = 300;
const ARROW_KEY_Up = 87
const ARROW_KEY_Down = 83;
const SPACE_KEY = 32;
var upKey = false;
var downKey = false;
var playerDY = 15;
var lives = [];

//Enemy Variables
var enemies = [];
var redEnemySpeed = 5;
var purpleEnemySpeed = 3;
var spawnInterval = 90;

//Game variables
var stage;
const STAGE_WIDTH = 1200;
const STAGE_HEIGHT = 700;
var paused = false;
var pauseText = new createjs.Text("PAUSED", "120px Arial", "#ffffff");
var gameOver = false;
var gameOverText = new createjs.Text("GAME OVER", "120px Arial", "#ffffff");
var started = false;
var startDisplayed = false;
var startScreen;
var preload;
var timer = 0;
var score = 0;
var scoreText = new createjs.Text("Score: ", "60px Arial", "#ffffff");

//Effects
var exSheet; //Explosion sprite
var blast;
var laser;


//Scene Functions
function load() {
    //Load assets
    preload = new createjs.LoadQueue(true);
    preload.installPlugin(createjs.Sound);
    createjs.Sound.alternateExtensions = ["ogg"];
    preload.addEventListener("complete", init);

    preload.loadManifest([
        { id: "Background", src: "/assets/Background.png" },
        { id: "Overlay", src: "/assets/Overlay.png" },
        { id: "PlayerShip", src: "/assets/PlayerShip.png" },
        { id: "EnemyRed", src: "/assets/EnemyShip1.png" },
        { id: "EnemyPurple", src: "/assets/EnemyShip2.png" },
        { id: "ShotBlue", src: "/assets/ShotBlue.png" },
        { id: "ShotPurple", src: "/assets/ShotPurple.png" },
        { id: "Explosion", src: "/assets/Explosion.png"},
        { id: "Music", src: "/assets/WindSprite.mp3" },
        { id: "Blast", src: "/assets/Blast.mp3" },
        { id: "Laser", src: "/assets/Laser.mp3" }
        ]);
  
    preload.load();
}

function init() {
    //Create stage and ticker
    stage = new createjs.Stage("canvas");
    createjs.Ticker.setFPS(30);
    createjs.Ticker.addEventListener("tick", tick);

    //Create background image
    var bg = new createjs.Bitmap(preload.getResult("Background"));
    bg.setTransform(0, 0, 1, 1);
    stage.addChild(bg);

    //Create player
    player = new createjs.Bitmap(preload.getResult("PlayerShip"));
    player.set({ x: playerX, y: playerY });
    stage.addChild(player);
    stage.addEventListener("mousedown", createBullet);
    setControls();

    //Play background music
    createjs.Sound.play('Music', createjs.Sound.INTERRUPT_NONE, 0, 0, -1, .5, 0);

    //Sprite Sheet creation
    exSheet = new createjs.SpriteSheet({
        framerate: 30,
        images: [preload.getResult("Explosion")],
        frames: { width: 150, height: 150, count: 6, regX: 0, regY: 0 },
        animations: {
            "explode": [0, 5, "explode", 0.5]
        }
    });

    //UI overlay
    var ol = new createjs.Bitmap(preload.getResult("Overlay"));
    ol.setTransform(0, 600, 1, 1);
    stage.addChild(ol);

    //Setup score counter
    scoreText.set({ x: 780, y: 625 });
    stage.addChild(scoreText);

    //Setup lives display
    createLives();

    //Create start screen
    createStartScreen();

    //TODO create stage, create bitmaps, start ticker
    //TODO add event listeners

}

function tick() {
    if (started && !paused && !gameOver) {
        timer++;
        spawnRate();
        movePlayer();
        moveEnemy();
        moveShot();
        checkHit();
        updateScore();
        stage.update();
    } else if (!started) {
        if (!startDisplayed) {
            displayStartScreen();
        }
        stage.update();
    } else if (gameOver) {
        gameOverText.x = 220; gameOverText.y = 250;
        stage.addChild(gameOverText);
        stage.update();
    }
}

function updateScore() {
    if (timer % 30 == 0) {
        score += 10;
    }
    scoreText.text = "Score: " + score;
}

function createStartScreen() {
    //Greyed background
    var greyBack = new createjs.Shape().set({ x: 0, y: 0 });
    greyBack.graphics.beginFill("rgba(50, 50, 50, 0.8)").drawRect(0, 0, STAGE_WIDTH, STAGE_HEIGHT);

    //Controls
    var controlBox = new createjs.Shape().set({ x: 60, y: 40 });
    controlBox.graphics.setStrokeStyle(8).beginStroke("white").beginFill("purple").drawRect(0, 0, 520, 380);

    var upText = new createjs.Text("W key to move up.", "50px Arial", "#ffffff").set({ x: 110, y: 50 });
    var downText = new createjs.Text("S key to move down.", "50px Arial", "#ffffff").set({ x: 90, y: 150 });
    var fireText = new createjs.Text("Left Click to fire shots.", "50px Arial", "#ffffff").set({ x: 70, y: 250 });
    var spaceText = new createjs.Text("Space Bar to pause.", "50px Arial", "#ffffff").set({ x: 92, y: 350 });

    var controls = new createjs.Container();
    controls.addChild(controlBox, upText, downText, fireText, spaceText);

    //Top Scores
    var scoreBox = new createjs.Shape().set({ x: 620, y: 40 });
    scoreBox.graphics.setStrokeStyle(8).beginStroke("white").beginFill("purple").drawRect(0, 0, 520, 380);

    var ts = new createjs.Text("Top Scores", "50px Arial", "#ffffff").set({ x: 760, y: 50 });
    var score1 = new createjs.Text("Name : Score", "40px Arial", "#ffffff").set({ x: 650, y: 120 });
    var score2 = new createjs.Text("Name : Score", "40px Arial", "#ffffff").set({ x: 650, y: 180 });
    var score3 = new createjs.Text("Name : Score", "40px Arial", "#ffffff").set({ x: 650, y: 240 });
    var score4 = new createjs.Text("Name : Score", "40px Arial", "#ffffff").set({ x: 650, y: 300 });
    var score5 = new createjs.Text("Name : Score", "40px Arial", "#ffffff").set({ x: 650, y: 360 });

    var topScores = new createjs.Container();
    topScores.addChild(scoreBox, ts, score1, score2, score3, score4, score5);

    //Start button
    var startBox = new createjs.Shape().set({ x: 400, y: 500 });
    startBox.graphics.setStrokeStyle(8).beginStroke("white").beginFill("purple").drawRect(0, 0, 400, 150);
    var startText = new createjs.Text("START", "100px Arial", "#ffffff").set({ x: 432, y: 520 });
    startBox.addEventListener("click", removeStartScreen);
    startText.addEventListener("click", removeStartScreen);

    var startButton = new createjs.Container();
    startButton.addChild(startBox, startText);

    //Start Screen
    startScreen = new createjs.Container();
    startScreen.addChild(greyBack, controls, topScores, startButton);
}

function displayStartScreen() {
    stage.addChild(startScreen);
    startDisplayed = true;
    started = false;
}

function removeStartScreen() {
    stage.removeChild(startScreen);
    startDisplayed = false;
    started = true;
}


//Player Functions

function createLives() {
    image = preload.getResult("PlayerShip");
    for (i = 0; i < 5; i++) {
        tinyPlayer = new createjs.Bitmap(image);
        tinyPlayer.setTransform(0, 0, .35, .35);
        tinyPlayer.x = (70 * i) + 85; tinyPlayer.y = 650;
        stage.addChild(tinyPlayer);
        lives.push(tinyPlayer);
    }
}

function updateLives() {
    if (lives.length > 1)
        stage.removeChild(lives.pop());
    else {
        stage.removeChild(lives.pop());
        gameOver = true;
    }
}

function createBullet() {
    if (started) {
        image = preload.getResult("ShotBlue");
        var bullet = new createjs.Bitmap(image);
        bullet.x = player.x + 100; bullet.y = player.y + 35;
        stage.addChild(bullet);
        bullets.push(bullet);
        if (laser != null) {
            laser.stop();
        }
        laser = createjs.Sound.play('Laser', createjs.Sound.INTERRUPT_NONE, 0, 0, 0, .5, 0);
    }
}

function moveShot() {
    for (i = 0; i < bullets.length; i++) {
        bullets[i].x += bulletSpeed;
        if (bullets[i].x > 1200) {
            stage.removeChild(bullets[i]);
            bullets.splice(i, 1);
        }
    }
}

function movePlayer() {
    if (upKey) {
        if (player.y + playerDY <= 0) {
            player.y = 0;
        } else {
            player.y = player.y - playerDY;
        }

    } else if (downKey) {

        if (player.y - playerDY >= 525) {
            player.y = 525;
        } else {
            player.y = player.y + playerDY;
        }
    }
}

function pauseGame() {
    if (paused && !gameOver) {
        paused = false;
        stage.removeChild(pauseText);
    }
    else if (!gameOver) {
        paused = true;
        pauseText.x = 360; pauseText.y = 250;
        stage.addChild(pauseText);
        stage.update();
    }
}

function handleKeyDown(e) {
    switch (e.keyCode) {
        case ARROW_KEY_Up: upKey = true;
            break;
        case ARROW_KEY_Down: downKey = true;
            break;
    }
}

function handleKeyUp(e) {
    switch (e.keyCode) {
        case SPACE_KEY:
            pauseGame();
            break;
        case ARROW_KEY_Up: upKey = false;
            break;
        case ARROW_KEY_Down: downKey = false;
            break;
    }
}
function setControls() {
    window.onkeydown = handleKeyDown;
    window.onkeyup = handleKeyUp;
}



//Enemy Functions

function spawnEnemy() {
    var rando = Math.floor(5 * Math.random());
    if (rando == 4)
        image = preload.getResult("EnemyPurple");
    else
        image = preload.getResult("EnemyRed");
    enemyBitmap = new createjs.Bitmap(image);

    var randY = Math.floor((525 * Math.random()));
    enemyBitmap.x = 1300;
    enemyBitmap.y = randY;

    if (rando == 4) {
        enemies.push({ id: "purple", image: enemyBitmap, lives: 2 });
    }
    else {
        enemies.push({ id: "red", image: enemyBitmap, lives: 1 });
    }
    stage.addChild(enemyBitmap);
}

function spawnRate() {
    if (timer % 300 == 0) {
        redEnemySpeed++;
        purpleEnemySpeed++;
        if (spawnInterval > 30) {
            spawnInterval -= 6;
        }
    }

    if (timer % spawnInterval == 0) {
        spawnEnemy();
    }
}


function checkHit() {
    //TODO hit checks, destruction
    for (var i = 0; i < enemies.length; i++) {
        for (var j = 0; j < bullets.length; j++) {
            if ((bullets[j].x + 35) >= (enemies[i].image.x + 45)) {
                if ((enemies[i].image.x < 1150)
                    && ((bullets[j].y + 7) <= (enemies[i].image.y + 60))
                    && ((bullets[j].y + 14) >= (enemies[i].image.y + 10)))
                {
                    destroy(enemies[i], i, true);
                    stage.removeChild(bullets[j]);
                    bullets.splice(j, 1);
                    return;
                }
            }
        }
    }
}

function destroy(enemy, index, killed){
    //Death explosion at enemy location
    enemy.lives -= 1;

    if (enemy.lives > 0) {
        return;
    }
    else {
        stage.removeChild(enemy.image);
        explodeEnemy(enemy);
        enemies.splice(index, 1);
        if (enemy.id == "red" && killed)
            score += 100;
        if (enemy.id == "purple" && killed)
            score += 300;
        enemy = null;
    }
}

function explodeEnemy(enemy) {
    var explosion = new createjs.Sprite(exSheet, "explode");
    explosion.set({x: enemy.image.x, y: enemy.image.y - 30});
    stage.addChild(explosion);
    if (blast != null) {
        blast.stop();
    }
    blast = createjs.Sound.play('Blast', createjs.Sound.INTERRUPT_NONE, 0, 0, 0, .5, 0);
    setTimeout(function () { stage.removeChild(explosion); }, 350);
}

function moveEnemy() {
    for (i = 0; i < enemies.length; i++) {
        if (enemies[i].id == "red" && enemies[i].image.x > 75) {
            enemies[i].image.x -= redEnemySpeed;
        } else if (enemies[i].id == "purple" && enemies[i].image.x > 75) {
            enemies[i].image.x -= purpleEnemySpeed;
        } else {
            destroy(enemies[i], i, false);
            updateLives();
        }
    }
}
