let playerHPValue = [100, 100];
const attackPower = [5, 5];
const stamina = [50, 50];
let activePlayer = 0;

const drawCard = document.getElementById('power-up-btn');
const attack = document.getElementById('attack-btn');
const gameEnd = document.querySelector('.game-over');

//Sound Effects Assets
const startGameAudio = new Audio('assets/audio/start-game.mp3');
const powerUpPlus = new Audio('assets/audio/power-up-plus.mp3');
const powerUpZero = new Audio('assets/audio/power-up-zero.mp3');
const attackSound = new Audio('assets/audio/attack.mp3');
const hpCritical = new Audio('assets/audio/hp-critical.mp3');
const winSound = new Audio('assets/audio/win.mp3');

//Sound Effects
const playAudio = (audioFile) => {
  audioFile.play();
};
//Opposites the active player: for the damage application to the opponent
const opposite = () => {
  if (activePlayer === 0) {
    return 1;
  } else {
    return 0;
  }
};
//Resets the attacking chicken image back to normal
const resetImage = () => {
  document.getElementById(
    'chickens'
  ).src = `assets/images/chicken-playerx-attack.png`;
};
//GAME OVER
const gameOver = () => {
  document.getElementById(
    'chickens'
  ).src = `assets/images/chicken-player${activePlayer}-winner.png`;
  midContainer.classList.add('hidden');
  if (activePlayer === 1) {
    gameEnd.style.flexDirection = 'row-reverse';
  }
  gameEnd.classList.toggle('hidden');
};
//Switch player functionality
const switchPlayer = () => {
  attackPower[activePlayer] = 5;
  document.getElementById(`player-${[activePlayer]}-power`).textContent = 5;
  activePlayer = activePlayer === 0 ? 1 : 0;
  if (playerHPValue[activePlayer] === 0) {
    switchPlayer();
    gameOver();
  }
  if (stamina[activePlayer] <= 0) {
    document.getElementById('power-up-btn').disabled = true;
  } else {
    document.getElementById('power-up-btn').disabled = false;
  }
};
//Power Up random onClick
drawCard.addEventListener('click', function () {
  // Deduct Stamina
  let remainingStamina = stamina[activePlayer] - 10;
  stamina[activePlayer] = remainingStamina;
  document.getElementById(`player-${[activePlayer]}-stamina`).textContent =
    stamina[activePlayer];

  // Check Stamina
  if (stamina[activePlayer] <= 0) {
    document.getElementById('power-up-btn').disabled = true;
  } else {
    document.getElementById('power-up-btn').disabled = false;
  }

  // Generate random power-up
  let randomNum = Math.floor(Math.random() * 6) * 2;
  document.getElementById('power-up').textContent = randomNum;
  document.getElementById(
    'power-up'
  ).src = `assets/images/card-${randomNum}.png`;
  if (randomNum > 0) {
    let totalAttackPower = attackPower[activePlayer] + randomNum;
    attackPower[activePlayer] = totalAttackPower;
    document.getElementById(`player-${[activePlayer]}-power`).textContent =
      attackPower[activePlayer];
    playAudio(powerUpPlus);
  } else {
    switchPlayer();
    playAudio(powerUpZero);
  }
});
//switching arrows functionaility
const arrowSwitch = () => {
  if (activePlayer === 1) {
    indicator0.classList.add('invisible');
    indicator1.classList.remove('invisible');
  } else {
    indicator0.classList.remove('invisible');
    indicator1.classList.add('invisible');
  }
};

const attackAnimate = () => {
  document.getElementById(
    'chickens'
  ).src = `assets/images/chicken-player${activePlayer}-attack.png`;
};

//function for attack btn; HP - totalAttackPower;
const chickenAttack = () => {
  document.getElementById('power-up').src = `assets/images/card-back.png`;
  const playerHP = document.getElementById(`hp-bar-${[opposite()]}`);
  playAudio(attackSound);
  playerHPValue[opposite()] -= attackPower[activePlayer];

  if (playerHPValue[opposite()] < 0) {
    playerHPValue[opposite()] = 0;
  }
  //for hp colors as it decreases
  if (playerHPValue[opposite()] > 30 && playerHPValue[opposite()] < 60) {
    playerHP.style.background = 'orange';
  } else if (playerHPValue[opposite()] < 30) {
    playerHP.style.backgroundColor = 'red';
    playAudio(hpCritical);
  }
  //Bar displays the decrease in HP
  playerHP.style.width = playerHPValue[opposite()] + '%';
  playerHP.innerHTML = playerHPValue[opposite()] + '%';
  attackAnimate();
  if (playerHPValue[opposite()] > 0) {
    setTimeout(resetImage, 250);
  }
  switchPlayer();
  arrowSwitch();
};

// TITLE SCREEN & MODAL WINDOW
const titleScreen = document.querySelector('.title-screen');
const startGame = document.querySelector('.start-game-btn');
const modal = document.querySelector('.modal');
const blurModal = document.querySelector('.blur');
const btnCloseModal = document.querySelector('.close-modal');
const btnOpenModal = document.querySelector('.how-to-play-btn');
const topContainer = document.querySelector('.top-container');
const midContainer = document.querySelector('.mid-container');
const indicator0 = document.querySelector('.arrow-0');
const indicator1 = document.querySelector('.arrow-1');

const openAndCloseModal = function () {
  modal.classList.toggle('hidden');
  blurModal.classList.toggle('hidden');
  titleScreen.classList.toggle('hidden');
};

const newGame = function () {
  titleScreen.classList.add('hidden');
  topContainer.classList.remove('hidden');
  midContainer.classList.remove('hidden');
  indicator0.classList.remove('invisible');
  attack.classList.remove('hidden');
};

btnOpenModal.addEventListener('click', openAndCloseModal);
btnCloseModal.addEventListener('click', openAndCloseModal);
blurModal.addEventListener('click', openAndCloseModal);
startGame.addEventListener('click', newGame);
