let playerHPValue = [100, 100];
const attackPower = [5, 5];
const stamina = [50, 50];
let activePlayer = 0;

const drawCard = document.getElementById('power-up-btn');
const attack = document.getElementById('attack-btn');

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
  if (randomNum > 0) {
    let totalAttackPower = attackPower[activePlayer] + randomNum;
    attackPower[activePlayer] = totalAttackPower;
    document.getElementById(`player-${[activePlayer]}-power`).textContent =
      attackPower[activePlayer];
  } else {
    switchPlayer();
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
  const playerHP = document.getElementById(`hp-bar-${[opposite()]}`);
  playerHPValue[opposite()] -= attackPower[activePlayer];
  if (playerHPValue[opposite()] < 0) {
    playerHPValue[opposite()] = 0;
  }
  //for hp colors as it decreases
  if (playerHPValue[opposite()] > 30 && playerHPValue[opposite()] < 60) {
    playerHP.style.backgroundColor = 'orange';
  } else if (playerHPValue[opposite()] < 30) {
    playerHP.style.backgroundColor = 'red';
  }
  //Bar displays the decrease in HP
  playerHP.style.width = playerHPValue[opposite()] + '%';
  playerHP.innerHTML = playerHPValue[opposite()] + '%';
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
};

const newGame = function () {
  titleScreen.classList.add('hidden');
  topContainer.classList.remove('hidden');
  midContainer.classList.remove('hidden');
  indicator.classList.remove('invisible');
  attack.classList.remove('hidden');
};

btnOpenModal.addEventListener('click', openAndCloseModal);
btnCloseModal.addEventListener('click', openAndCloseModal);
blurModal.addEventListener('click', openAndCloseModal);
startGame.addEventListener('click', newGame);
