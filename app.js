'use strict';

// BASE PLAYER STATS
let playerHPValue = [100, 100];
let attackPower = [5, 5];
let stamina = [50, 50];
let activePlayer = 0;
let staminaRegen = 10;

// DECLARATIONS
const drawCard = document.getElementById('power-up-btn');
const attack = document.getElementById('attack-btn');
const gameEnd = document.querySelector('.game-over');
const powerUpText = document.getElementById('power-up-text');
const audios = [
  {
    type: 'start',
    path: 'assets/audio/start-game.mp3',
  },
  {
    type: 'rooster',
    path: 'assets/audio/rooster-crow.mp3',
  },
  {
    type: 'power-up-plus',
    path: 'assets/audio/power-up-plus.mp3',
  },
  {
    type: 'power-up-zero',
    path: 'assets/audio/power-up-zero.mp3',
  },
  {
    type: 'attack',
    path: 'assets/audio/attack.mp3',
  },
  {
    type: 'hp-critical',
    path: 'assets/audio/hp-critical.mp3',
  },
  {
    type: 'win',
    path: 'assets/audio/winner.mp3',
  },
];

// LOADING OF AUDIOS
const loadAudios = () => {
  audios
    .map((audio) => {
      audio.audio = new Audio(audio.path);

      return audio;
    })
    .forEach((audio) => {
      audio.audio.addEventListener('canplaythrough', (e) => {
        audioCounter++;
        // TODO: Add something better to indicate that all audios can play
      });
    });
};

let audioCounter = 0;

const playAudio = (type) => {
  const audio = audios.find((audio) => audio.type === type);

  if (!audio) {
    throw new 'No audio type for that!'(); // TODO: Change for better error
  }
  audio.audio.play();
};

// RESETS THE ATTACKING CHICKEN IMAGE BACK TO NORMAL
const resetImage = () => {
  document.getElementById('chickens').src =
    'assets/images/chicken-playerx-attack.png';
  removeArrows.style.visibility = 'visible';
};

// CARD FLIP TO BACK
const cardFlipBack = () => {
  const cardSide = document.getElementById('power-up').getAttribute('src');
  if (cardSide !== 'assets/images/card-back.png') {
    flipAnimation();
  }
  document.getElementById('power-up').src = 'assets/images/card-back.png';
  powerUpText.textContent = 'Power Up!';
};

// GAME OVER DELAY FUNCTION
const gameOverDelay = () => {
  document.getElementById(
    'chickens'
  ).src = `assets/images/chicken-player${activePlayer}-winner.png`;
};

// GAME OVER CONDITION
let resetGameOverTimeOut;
const gameOver = () => {
  document.querySelector('.play-again').src =
    'assets/images/play-again-btn.png';
  attack.setAttribute('onclick', 'playAgain()');
  midContainer.classList.add('hidden');

  resetGameOverTimeOut = setTimeout(gameOverDelay, 1500);

  if (activePlayer === 1) {
    gameEnd.style.flexDirection = 'row-reverse';
  }
  gameEnd.classList.toggle('hidden');
  clearTimeout(resetTimeOut);
};

//CARD FLIP ANIMATION
const flipAnimation = () => {
  drawCard.classList.toggle('flipped');
  if (drawCard.classList.contains('flipped')) {
    document.getElementById('power-up').style.transform = 'scaleX(-1)';
  } else {
    document.getElementById('power-up').style.transform = 'scaleX(1)';
  }
};

// STAMINA LOW ANIMATION
const staminaLow = () => {
  powerUpText.textContent = 'Stamina Low!';
  powerUpText.classList.add('text-bounce');
};

// GENERATE RANDOM POWER-UP FUNCTION
let delayFlipCard;
const generatePowerUp = () => {
  clearTimeout(delayFlipCard);
  flipAnimation();

  // Deduct Stamina
  let remainingStamina = stamina[activePlayer] - 5;
  stamina[activePlayer] = remainingStamina;
  document.getElementById(`player-${activePlayer}-stamina`).textContent =
    stamina[activePlayer];

  // Check Stamina
  if (stamina[activePlayer] < 5) {
    drawCard.removeEventListener('click', generatePowerUp);
    drawCard.addEventListener('click', staminaLow);
  } else {
    drawCard.removeEventListener('click', staminaLow);
    drawCard.addEventListener('click', generatePowerUp);
  }

  // Generate random power-up
  let randomNum = Math.floor(Math.random() * 6) * 2;
  document.getElementById(
    'power-up'
  ).src = `assets/images/card-${randomNum}.png`;
  if (randomNum > 0) {
    let totalAttackPower = attackPower[activePlayer] + randomNum;
    attackPower[activePlayer] = totalAttackPower;
    document.getElementById(`player-${activePlayer}-power`).textContent =
      attackPower[activePlayer];
    playAudio('power-up-plus');
    powerUpText.textContent = 'Power Up!';
  } else {
    powerUpText.textContent = 'Lose Turn!';
    delayFlipCard = setTimeout(cardFlipBack, 2000);
    //
    switchPlayer();
    arrowSwitch();
    playAudio('power-up-zero');
  }
};

// SWITCH PLAYER FUNCTION
const switchPlayer = () => {
  attackPower[activePlayer] = 5;
  document.getElementById(`player-${activePlayer}-power`).textContent = 5;
  activePlayer = activePlayer === 0 ? 1 : 0;
  if (playerHPValue[activePlayer] === 0) {
    switchPlayer();
    gameOver();
    playAudio('win');
  }
  powerUpText.classList.remove('text-bounce');
  if (stamina[activePlayer] < 5) {
    drawCard.removeEventListener('click', generatePowerUp);
    drawCard.addEventListener('click', staminaLow);
  } else {
    drawCard.removeEventListener('click', staminaLow);
    drawCard.addEventListener('click', generatePowerUp);
  }
};

// POWER UP ONCLICK EVENT
drawCard.addEventListener('click', generatePowerUp);

// SWITCHING ARROWS FUNCTION
const arrowSwitch = () => {
  if (activePlayer === 1) {
    indicator0.classList.add('invisible');
    indicator1.classList.remove('invisible');
  } else {
    indicator0.classList.remove('invisible');
    indicator1.classList.add('invisible');
  }
};

// OPPOSITES THE ACTIVE PLAYER: FOR THE DAMAGE APPLICATION TO THE OPPONENT
const opposite = () => {
  return activePlayer === 0 ? 1 : 0;
};

const removeArrows = document.querySelector('.arrow-container');

const attackAnimate = () => {
  document.getElementById(
    'chickens'
  ).src = `assets/images/chicken-player${activePlayer}-attack.png`;
  removeArrows.style.visibility = 'hidden';
};

// FUNCTION FOR ATTACK BTN; HP - totalAttackPower
const playerHpText = document.getElementById(`hp-text-${opposite()}`);
let resetTimeOut;

const chickenAttack = () => {
  cardFlipBack();
  const playerHP = document.getElementById(`hp-bar-${[opposite()]}`);
  const playerHpText = document.getElementById(`hp-text-${opposite()}`);
  playAudio('attack');
  stamina[activePlayer] += staminaRegen;
  document.getElementById(`player-${activePlayer}-stamina`).textContent =
    stamina[activePlayer];
  playerHPValue[opposite()] -= attackPower[activePlayer];
  if (playerHPValue[opposite()] < 0) {
    playerHPValue[opposite()] = 0;
  }
  //for hp colors as it decreases
  if (playerHPValue[opposite()] > 30 && playerHPValue[opposite()] < 60) {
    playerHP.style.background =
      'linear-gradient(180deg, #fff2b4 0, #fff2b4 15%, #ffa118 15%, #ffa118 80%, #ff7f0d 80%)';
  } else if (playerHPValue[opposite()] < 30) {
    playerHP.style.background =
      'linear-gradient(180deg, #ffa7bd 0, #ffa7bd 15%, #ff2968 15%, #ff2968 80%, #c40851 80%)';
    playAudio('hp-critical');
  }
  //Bar displays the decrease in HP
  playerHP.style.width = playerHPValue[opposite()] + '%';
  playerHpText.innerHTML = playerHPValue[opposite()];
  attackAnimate();
  if (playerHPValue[opposite()] > 0) {
    clearTimeout(resetTimeOut);
    resetTimeOut = setTimeout(resetImage, 500);
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
const shortcutBtns = document.querySelector('.shortcut-buttons');

// MODAL WINDOW OPEN AND CLOSE FUNCTION
const openAndCloseModal = function () {
  modal.classList.toggle('hidden');
  blurModal.classList.toggle('hidden');
  titleScreen.classList.toggle('hidden');
  playAudio('start');
};

// NEW GAME FUNCTION

const firstGame = () => {
  clearTimeout(resetGameOverTimeOut);
  titleScreen.classList.add('hidden');
  topContainer.classList.remove('hidden');
  midContainer.classList.remove('hidden');
  indicator0.classList.remove('invisible');
  attack.classList.remove('hidden');
  shortcutBtns.classList.remove('hidden');
  playAudio('start');
  playAudio('rooster');
};

const newGame = function () {
  firstGame();
  restartGame();
};

// BUTTON EVENTS
btnOpenModal.addEventListener('click', openAndCloseModal);
btnCloseModal.addEventListener('click', openAndCloseModal);
blurModal.addEventListener('click', openAndCloseModal);
startGame.addEventListener('click', newGame);

// PLAY AGAIN FUNCTION

const restartGame = () => {
  gameEnd.classList.add('hidden');
  document.querySelector('.play-again').src = 'assets/images/attack-btn.png';
  attack.setAttribute('onclick', 'chickenAttack()');
  document.getElementById('hp-bar-0').style.width = 100 + '%';
  document.getElementById('hp-bar-1').style.width = 100 + '%';
  document.getElementById('hp-bar-0').style.background =
    'linear-gradient(180deg, #6ae061 0, #6ae061 15%, #4eb947 15%, #4eb947 80%, #298941 80%)';
  document.getElementById('hp-bar-1').style.background =
    'linear-gradient(180deg, #6ae061 0, #6ae061 15%, #4eb947 15%, #4eb947 80%, #298941 80%)';
  playerHPValue = [100, 100];
  document.getElementById('hp-text-0').textContent = playerHPValue[0];
  document.getElementById('hp-text-1').textContent = playerHPValue[1];
  stamina = [50, 50];
  document.getElementById('player-0-stamina').textContent = stamina[0];
  document.getElementById('player-1-stamina').textContent = stamina[1];
  document.getElementById('chickens').src =
    'assets/images/chicken-playerx-attack.png';
  indicator0.classList.remove('invisible');
  indicator1.classList.add('invisible');
  removeArrows.style.visibility = 'visible';
  activePlayer = 0;
  gameEnd.style.flexDirection = 'row';
  powerUpText.textContent = 'Power Up!';
  attackPower = [5, 5];
  drawCard.removeEventListener('click', staminaLow);
  drawCard.addEventListener('click', generatePowerUp);
  powerUpText.classList.remove('text-bounce');
  document.getElementById('power-up').src = 'assets/images/card-back.png';
  document.getElementById(`player-0-power`).textContent = '5';
  document.getElementById(`player-1-power`).textContent = '5';
};

const playAgain = () => {
  firstGame();
  restartGame();
};

// HOME AND RESTART SHORTCUTS
const homeBtn = document.getElementById('home');
const restartBtn = document.getElementById('restart');
const returnTitleModal = document.querySelector('.return-title-modal');
const restartGameModal = document.querySelector('.restart-game-modal');
const darkBlur = document.querySelector('.dark-blur');
const yesBtnTitle = document.getElementById('yes-btn-title');
const yesBtnRestart = document.getElementById('yes-btn-restart');
const noBtn = document.querySelectorAll('.no-btn');

homeBtn.addEventListener('click', function () {
  returnTitleModal.classList.remove('hidden');
  darkBlur.classList.remove('hidden');
});

restartBtn.addEventListener('click', function () {
  restartGameModal.classList.remove('hidden');
  darkBlur.classList.remove('hidden');
});

noBtn.forEach((element) =>
  element.addEventListener('click', function () {
    returnTitleModal.classList.add('hidden');
    restartGameModal.classList.add('hidden');
    darkBlur.classList.add('hidden');
  })
);

yesBtnTitle.addEventListener('click', function () {
  clearTimeout(resetGameOverTimeOut);
  titleScreen.classList.remove('hidden');
  topContainer.classList.add('hidden');
  midContainer.classList.add('hidden');
  indicator0.classList.add('invisible');
  attack.classList.add('hidden');
  shortcutBtns.classList.add('hidden');
  returnTitleModal.classList.add('hidden');
  darkBlur.classList.add('hidden');
  gameEnd.classList.add('hidden');
  indicator0.classList.add('invisible');
  indicator1.classList.add('invisible');
  document.getElementById('chickens').src =
    'assets/images/chicken-playerx-attack.png';
});

yesBtnRestart.addEventListener('click', function () {
  firstGame();
  restartGame();
  returnTitleModal.classList.add('hidden');
  restartGameModal.classList.add('hidden');
  darkBlur.classList.add('hidden');
});

// PRELOAD FUNCTION
(() => {
  // Preload assets
  loadAudios();
})();
