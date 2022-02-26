let playerHPValue = [100, 100];
const attackPower = [5, 5];
const stamina = [50, 50];
let activePlayer = 0;

const drawCard = document.getElementById('power-up-btn');
const attack = document.getElementById('attack-btn');

//Sound Effects Assets
const startGame = new Audio("assets/audio/start-game.mp3");
const powerUpPlus = new Audio("assets/audio/power-up-plus.mp3");
const powerUpZero = new Audio("assets/audio/power-up-zero.mp3");
const attackSound = new Audio("assets/audio/attack.mp3");
const hpCritical = new Audio("assets/audio/hp-critical.mp3");
const winSound = new Audio("assets/audio/win.mp3");

//Sound Effects
const playAudio = (audioFile) => {
  audioFile.play();
}

const switchPlayer = () => {
  attackPower[activePlayer] = 5;
  document.getElementById(`player-${[activePlayer]}-power`).textContent = 5;
  activePlayer = activePlayer === 0 ? 1 : 0;
};

drawCard.addEventListener('click', function () {
  // Deduct Stamina
  let remainingStamina = stamina[activePlayer] - 5;
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
  document.getElementById('power-up').src = `assets/images/card-${randomNum}.png`;
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
//Opposites the active player: for the damage application to the opponent
const opposite = () => {
  if (activePlayer === 0) {
    return 1;
  } else {
    return 0;
  }
};
//function for attack btn; HP - totalAttackPower;
const hpDeduction = () => {
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
  switchPlayer();
};

 