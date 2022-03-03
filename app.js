let playerHPValue = [100, 100];
const attackPower = [5, 5];
let stamina = [50, 50];
let activePlayer = 0;
let staminaRegen = 10;

const drawCard = document.getElementById('power-up-btn');
const attack = document.getElementById('attack-btn');
const gameEnd = document.querySelector('.game-over');
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

//Resets the attacking chicken image back to normal
const resetImage = () => {
  document.getElementById('chickens').src =
    'assets/images/chicken-playerx-attack.png';
  removeArrows.style.visibility = 'visible';
};

//Card Flip Back
const cardFlipBack = () => {
  document.getElementById('power-up').src = 'assets/images/card-back.png';
};
const gameOverDelay = () => {
  document.getElementById(
    'chickens'
  ).src = `assets/images/chicken-player${activePlayer}-winner.png`;
};
//GAME OVER
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

let delayFlipCard;
const generatePowerUp = () => {
  clearTimeout(delayFlipCard);
  drawCard.classList.toggle('flipped');
  if (drawCard.classList.contains('flipped')) {
    document.getElementById('power-up').style.transform = 'scaleX(-1)';
  } else {
    document.getElementById('power-up').style.transform = 'scaleX(1)';
  }

  // Deduct Stamina
  let remainingStamina = stamina[activePlayer] - 10;
  stamina[activePlayer] = remainingStamina;
  document.getElementById(`player-${activePlayer}-stamina`).textContent =
    stamina[activePlayer];
  // Check Stamina
  if (stamina[activePlayer] < 10) {
    drawCard.removeEventListener('click', generatePowerUp);
  } else {
    drawCard.addEventListener('click', generatePowerUp);
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
    document.getElementById(`player-${activePlayer}-power`).textContent =
      attackPower[activePlayer];
    playAudio('power-up-plus');
  } else {
    delayFlipCard = setTimeout(cardFlipBack, 3000);
    //
    switchPlayer();
    arrowSwitch();
    playAudio('power-up-zero');
  }
};

//Switch player functionality
const switchPlayer = () => {
  attackPower[activePlayer] = 5;
  document.getElementById(`player-${activePlayer}-power`).textContent = 5;
  activePlayer = activePlayer === 0 ? 1 : 0;
  if (playerHPValue[activePlayer] === 0) {
    switchPlayer();
    gameOver();
    playAudio('win');
  }
  if (stamina[activePlayer] < 10) {
    drawCard.removeEventListener('click', generatePowerUp);
  } else {
    drawCard.addEventListener('click', generatePowerUp);
  }
};
//Power Up random onClick
drawCard.addEventListener('click', generatePowerUp);
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
//Opposites the active player: for the damage application to the opponent
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

//function for attack btn; HP - totalAttackPower;

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
    resetTimeOut = setTimeout(resetImage, 1000);
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
  playAudio('start');
};
//  NEW GAME
const newGame = function () {
  clearTimeout(resetGameOverTimeOut);
  titleScreen.classList.add('hidden');
  topContainer.classList.remove('hidden');
  midContainer.classList.remove('hidden');
  indicator0.classList.remove('invisible');
  attack.classList.remove('hidden');
  playAudio('start');
  playAudio('rooster');
};
btnOpenModal.addEventListener('click', openAndCloseModal);
btnCloseModal.addEventListener('click', openAndCloseModal);
blurModal.addEventListener('click', openAndCloseModal);
startGame.addEventListener('click', newGame);

// PLAY AGAIN FUNCTION
const playAgain = () => {
  newGame();
  gameEnd.classList.toggle('hidden');
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
  activePlayer = 0;
  gameEnd.style.flexDirection = 'row';
};

(() => {
  // Preload assets
  loadAudios();
})();
