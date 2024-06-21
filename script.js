const gameArea = document.getElementById('gameArea');
const player = document.getElementById('player');
const gameOverAlert = document.getElementById('gameOverAlert');
const playerSpeed = 30;
let gameInterval;
let objectInterval;
let score = 0;
let highScore = localStorage.getItem('highScore') ? parseInt(localStorage.getItem('highScore')) : 0;
let live=3;

var audio2 = new Audio('assets/gameOver.mp3');

// Initialize the game
startGame();


// Start the game
function startGame() {
    gameInterval = setInterval(gameLoop, 20);
    objectInterval = setInterval(createFallingObject, 1000);
    updateHighScore();
    showLives();
}

// Control Player movement
document.addEventListener('keydown', (e) => {
    let playerPos = player.offsetLeft;
    if (e.key === 'ArrowLeft' && playerPos+60-player.offsetWidth > 0) {
        player.style.left = playerPos - playerSpeed + 'px';
    } else if (e.key === 'ArrowRight' && playerPos < gameArea.offsetWidth - player.offsetWidth+45) {
        player.style.left = playerPos + playerSpeed + 'px';
    }
});


// Add touch event listeners
gameArea.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    playerStartX = player.offsetLeft;
});
//For Phone
gameArea.addEventListener('touchmove', (e) => {
    let touchMoveX = e.touches[0].clientX;
    let moveDistance = touchMoveX - touchStartX;
    let newPlayerPos = playerStartX + moveDistance;
    
    if (newPlayerPos >= 0 && newPlayerPos <= gameArea.offsetWidth - player.offsetWidth+30) {
        player.style.left = newPlayerPos + 'px';
    }
});

// Game loop
function gameLoop() {
    const objects = document.getElementsByClassName('fallingObject');
    var audio = new Audio('assets/hit.mp3');
    for (let i = 0; i < objects.length; i++) {
        let object = objects[i];
        object.style.top = object.offsetTop + 5 + 'px';
        let scoreCard = document.getElementsByClassName('score-container');
        // Check for collision with player
        if (isCollision(player, object)) {
            audio.play();
            score++;
            object.remove();
            scoreCard[0].innerHTML=`Score : ${score}`;
            console.log('Score:', score);
            updateHighScore();
        }

        // Remove object if it goes off screen
        if (object.offsetTop-object.offsetHeight > gameArea.offsetHeight-50) {
            object.remove();
            live-=1;
            showLives();
            if(live==0){
               endGame();
            }
            console.log('Lives over' , live);
        }
    }
}

//Display Lives
function showLives(){
    let liveContainer = document.getElementById('lives');
    if (live==3){
        liveContainer.innerHTML="❤❤❤";
    }
    if (live==2){
        liveContainer.innerHTML="❤❤";
    }
    if (live==1){
        liveContainer.innerHTML="❤";
    }
    if (live==0){
        liveContainer.innerHTML="💔";
    }
}

// Create a falling object
function createFallingObject() {
    const object = document.createElement('div');
    object.className = 'fallingObject';
    object.src = 'assets/comet.png';
    object.style.left = Math.random() * (gameArea.offsetWidth - 30) + 'px';
    gameArea.appendChild(object);
}


// Update score and check for high score
function updateHighScore() {
    let highScoreCard = document.getElementsByClassName('highscore-container');
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
    }
    highScoreCard[0].innerHTML = `Your High Score: ${highScore}`;
}


// Check for collision between player and object
function isCollision(player, object) {
    const playerRect = player.getBoundingClientRect();
    const objectRect = object.getBoundingClientRect();
    
    return !(
        playerRect.top > objectRect.bottom ||
        playerRect.bottom < objectRect.top ||
        playerRect.right < objectRect.left ||
        playerRect.left > objectRect.right
    );
}

// End game
function endGame() {
    gameOver = true;
    clearInterval(gameInterval);
    clearInterval(objectInterval);
    gameOverAlert.classList.remove('hidden');
    gameOverAlert.classList.add('gameOverAlert');
    audio2.play();
}

// Restart game
function restartGame() {
    window.location.reload(); 
}