const hp = [100, 100];
const attackPower = [5, 5];
const stamina = [50, 50];
let activePlayer = 0;

const drawCard = document.getElementById('power-up-btn');
const attack = document.getElementById('attack-btn');

function switchPlayer() {
  attackPower[activePlayer] = 5;
  document.getElementById(`player-${[activePlayer]}-power`).textContent = 5;
  activePlayer = activePlayer === 0 ? 1 : 0;
}

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

// for change color hp function algo waiting for remcel
var i = 0;
function hpDeduction() {
  if (i == 0) {
    i = 1;
    var elem = document.getElementById("hpIndicator-one");
    var width = 100;
    var id = setInterval(frame, 60);
    function frame() {
      if (width <= 0) 
      {
        clearInterval(id);
        i = 0;
      } 
      else 
      {
        width--;
        if(width >30 && width <60)
        {
        elem.style.backgroundColor = "orange";
        }
        else if (width <30)
        {
        elem.style.backgroundColor = "red";
        }
        elem.style.width = width + "%";
        elem.innerHTML = width  + "%";
      }
    }
  }
}
