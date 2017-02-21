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
var paused = false;
var pauseText = new createjs.Text("PAUSED", "120px Arial", "#ffffff");
var gameOver = false;
var gameOverText = new createjs.Text("GAME OVER", "120px Arial", "#ffffff");
var preload;
var timer = 0;
var score = 0;
var scoreText = new createjs.Text("Score: ", "60px Arial", "#ffffff");


//Scene Functions
function load() {
    preload = new createjs.LoadQueue(true);
    preload.installPlugin(createjs.Sound);
    createjs.Sound.alternateExtensions = ["ogg"];
    preload.addEventListener("complete", init);

    preload.loadManifest([
        { id: "Background", src: "http://i857.photobucket.com/albums/ab138/Sarakus/Game%20Assets/Background_zpskobkr5xl.png" },
        { id: "Overlay", src: "http://i857.photobucket.com/albums/ab138/Sarakus/Game%20Assets/Overlay_zpsgcjvpvxl.png" },
        { id: "PlayerShip", src: "http://i857.photobucket.com/albums/ab138/Sarakus/Game%20Assets/PlayerShip_zpszu451wks.png" },
        { id: "EnemyRed", src: "http://i857.photobucket.com/albums/ab138/Sarakus/Game%20Assets/EnemyShip1_zpsvi2wnzj0.png" },
        { id: "EnemyPurple", src: "http://i857.photobucket.com/albums/ab138/Sarakus/Game%20Assets/EnemyShip2_zpssqrwp1ur.png" },
        { id: "ShotBlue", src: "http://i857.photobucket.com/albums/ab138/Sarakus/Game%20Assets/ShotBlue_zpsfplvo92t.png" },
        { id: "ShotPurple", src: "http://i857.photobucket.com/albums/ab138/Sarakus/Game%20Assets/ShotPurple_zpsb0e3hylp.png" },
        { id: "Music", src:"/assets/WindSprite.mp3"}
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
    bg.setTransform(0, 0, 1.17, 1.2);
    stage.addChild(bg);

    //Create player
    player = new createjs.Bitmap(preload.getResult("PlayerShip"));
    player.set({ x: playerX, y: playerY });
    stage.addChild(player);
    stage.addEventListener("mousedown", createBullet);
    setControls();

    //Play background music
    createjs.Sound.play('Music', createjs.Sound.INTERRUPT_NONE, 0, 0, -1, .5, 0);
    
    //UI overlay
    var ol = new createjs.Bitmap(preload.getResult("Overlay"));
    ol.setTransform(0, 600, 1.17, 1.2);
    stage.addChild(ol);

    //Setup score counter
    scoreText.set({ x: 780, y: 625 });
    stage.addChild(scoreText);

    //Setup lives display
    createLives();

    //TODO create stage, create bitmaps, start ticker
    //TODO add event listeners

}

function tick() {
    if (!paused && !gameOver) {
        timer++;
        spawnRate();
        movePlayer();
        moveEnemy();
        moveShot();
        checkHit();
        updateScore();
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
    image = preload.getResult("ShotBlue");
    var bullet = new createjs.Bitmap(image);
    bullet.x = player.x + 100; bullet.y = player.y + 35;
    stage.addChild(bullet);
    bullets.push(bullet);
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
            if (paused && !gameOver) {
                paused = false;
                stage.removeChild(pauseText);
            }
            else if(!gameOver) {
                paused = true;
                pauseText.x = 360; pauseText.y = 250;
                stage.addChild(pauseText);
                stage.update();
            }
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
        enemies.splice(index, 1);
        if (enemy.id == "red" && killed)
            score += 100;
        if (enemy.id == "purple" && killed)
            score += 300;
        enemy = null;
    }
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
