let playerHPValue = [100, 100];
const attackPower = [5, 5];
const stamina = [50, 50];
let activePlayer = 0;

const drawCard = document.getElementById('power-up-btn');
const attack = document.getElementById('attack-btn');
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

const switchPlayer = () => {
  attackPower[activePlayer] = 5;
  document.getElementById(`player-${activePlayer}-power`).textContent = 5;
  activePlayer = activePlayer === 0 ? 1 : 0;
  if (stamina[activePlayer] <= 0) {
    document.getElementById('power-up-btn').disabled = true;
  } else {
    document.getElementById('power-up-btn').disabled = false;
  }
};

drawCard.addEventListener('click', function () {
  // Deduct Stamina
  let remainingStamina = stamina[activePlayer] - 10;
  stamina[activePlayer] = remainingStamina;
  document.getElementById(`player-${activePlayer}-stamina`).textContent =
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
    document.getElementById(`player-${activePlayer}-power`).textContent =
      attackPower[activePlayer];
    playAudio('power-up-plus');
  } else {
    switchPlayer();
    playAudio('power-up-zero');
  }
});
//Opposites the active player: for the damage application to the opponent
const opposite = () => {
  return activePlayer === 0 ? 1 : 0;
};
const attackAnimate = () => {
  document.getElementById(
    'chickens'
  ).src = `assets/images/chicken-player${activePlayer}-attack.png`;
};

const resetImage = () => {
  document.getElementById(
    'chickens'
  ).src = `assets/images/chicken-playerx-attack.png`;
};
const gameOver = () => {};
//function for attack btn; HP - totalAttackPower;

const playerHpText = document.getElementById(`hp-text-${opposite()}`);

const chickenAttack = () => {
  resetImage();
  document.getElementById('power-up').src = `assets/images/card-back.png`;
  const playerHP = document.getElementById(`hp-bar-${[opposite()]}`);
  const playerHpText = document.getElementById(`hp-text-${opposite()}`);
  playAudio(attackSound);
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
    playAudio(hpCritical);
  }
  //Bar displays the decrease in HP
  playerHP.style.width = playerHPValue[opposite()] + '%';
  playerHpText.innerHTML = playerHPValue[opposite()];
  attackAnimate();
  setInterval(resetImage, 2000);
  switchPlayer();
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
const indicator = document.querySelector('.arrow-0');

const openAndCloseModal = function () {
  modal.classList.toggle('hidden');
  blurModal.classList.toggle('hidden');
  titleScreen.classList.toggle('hidden');
  playAudio('start');
};

const newGame = function () {
  titleScreen.classList.add('hidden');
  topContainer.classList.remove('hidden');
  midContainer.classList.remove('hidden');
  indicator.classList.remove('invisible');
  attack.classList.remove('hidden');
  playAudio('start');
  playAudio('rooster');
};

btnOpenModal.addEventListener('click', openAndCloseModal);
btnCloseModal.addEventListener('click', openAndCloseModal);
blurModal.addEventListener('click', openAndCloseModal);
startGame.addEventListener('click', newGame);

(() => {
  // Preload assets
  loadAudios();
})();
