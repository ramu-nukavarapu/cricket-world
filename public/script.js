// Get total players and play mode from session storage
let totalPlayers = sessionStorage.getItem('totalPlayers');
let playMode = sessionStorage.getItem('play');
let playerNames = JSON.parse(sessionStorage.getItem('playerNames')) || [];
let autoplay;
let outspos = {2:"duckout",13:"CaughtAndBowled",27:"runout",49:"InsideEdge",58:"Bowled",71:"HitWicket",84:"catchout",98:"Stumped"};


console.log(playerNames);
// Set default values if session storage is not available
if (totalPlayers === null || totalPlayers === 'undefined' || playMode == 'auto') {
  totalPlayers = 2;
  autoplay = true;
  playerNames.push("computer");
  console.log(playerNames);
} else {
  totalPlayers = parseInt(totalPlayers); 
}
if (playMode === null || playMode === 'undefined') {
  playMode = 'auto';
}

console.log(totalPlayers);
console.log(playMode);

const board = document.getElementById('board');

// Function to create the board
function createBoard() {
  let cellCount = 91;

  for (let i = 10; i > 0; i--) {
    if (i % 2 == 0) {
      for (let j = i * 10; j >= cellCount; j--) {
        const cell = createCell(j);
        board.appendChild(cell);
      }
    } else {
      for (let j = cellCount; j <= i * 10; j++) {
        const cell = createCell(j);
        board.appendChild(cell);
      }
    }
    cellCount -= 10;
  }
}

// Function to create a single cell
function createCell(number) {
  const cell = document.createElement('div');
  cell.id = 'cell' + number;
  cell.classList.add('cell');
  if(number in outspos){
    cell.style.backgroundImage = `URL(./assets/outs/${outspos[number]}.jpg)`;
    cell.style.backgroundSize = 'cover';
  }
  if(number == 100){
    cell.style.backgroundImage = `URL(./assets/outs/win.jpg)`;
    cell.style.backgroundSize = 'cover';
  }
  if (number % 2 == 0) {
    cell.classList.add('even');
  } else {
    cell.classList.add('odd');
  }

  // Create text div
  const text = document.createElement('div');
  text.textContent = number;
  text.classList.add('text');
  cell.appendChild(text);

  // Create player container div
  const playerContainer = document.createElement('div');
  playerContainer.classList.add('player-container');
  cell.appendChild(playerContainer);

  return cell;
}

// Function to roll the dice and display the result
function rollDice() {
  var array = ['DOT', 'ONE', 'TWO', 'THREE', 'FOUR', 'SIX'];
  var numArray = [0,1,2,3,4,5]
  let index = Math.floor(Math.random() * array.length);
  let display = document.getElementById("input");
  display.value = array[index];
  playSound(array[index],"mpeg");
  console.log(array[index]);
  changePlayer(currentPlayerIndex,numArray[index]);
}

// Event listener for the roll dice button
document.getElementById("rollButton").addEventListener("click", rollDice);

//function to change player
function changePlayer(playerId, rollNumber){
  
  if(rollNumber==0){
    changeColor();
    if(autoplay && currentPlayerIndex==1){
      rollDice()
    }
    return;
  }
  movePlayer(playerId,rollNumber);
  changeColor();
}

// Function to change the color of the roll dice button
let currentPlayerIndex = 0;
const playerDisplay = document.createElement('div');
playerDisplay.classList.add('playerDisplay');
document.getElementById('playerNamesContainer').appendChild(playerDisplay);
playerDisplay.textContent = playerNames[currentPlayerIndex];


function changeColor() {
  let playerShow = document.getElementsByClassName("playerDisplay")[0];
  let dice = document.getElementById("rollButton");
  let display = document.getElementById("input");

  dice.classList.remove(team[currentPlayerIndex]);
  playerShow.classList.remove(team[currentPlayerIndex]);

  currentPlayerIndex = (currentPlayerIndex + 1) % totalPlayers;
  playerShow.textContent = playerNames[currentPlayerIndex];

  playerShow.classList.add(team[currentPlayerIndex]);
  dice.classList.add(team[currentPlayerIndex]);
}

// Player colors
var team = ["bg-blue-900", "bg-red-600", "bg-yellow-500", "bg-gray-900"];

// Function to initialize players
function initializePlayers() {
  for (let i = 0; i < totalPlayers; i++) {
    let player = document.createElement('div');
    player.classList.add('player', `player${i}`, team[i]);

    player.id = `player${i}`;
    document.querySelector('#cell1 .player-container').appendChild(player);
  }
}

// Function to move player to a specific cell
let playerPos = [1,1,1,1];
console.log(`players arr ${playerPos}`);
function movePlayer(playerId, rollNumber) {
  var cellNumber = playerPos[playerId] + rollNumber;
  if(cellNumber>100){
    return;
  }
  
  const player = document.getElementById(`player${playerId}`);

  function moveStep(step) {
    if (step <= cellNumber) {
      playerPos[playerId] = step;
      const targetCell = document.querySelector(`#cell${step}`);
      if (player && targetCell) {
        playSound("move","mp3");
        targetCell.append(player);
      }
      if(step==cellNumber){
        checkwinning(cellNumber,playerId);
        if(cellNumber in outspos){
          console.log(`hey outs ${outspos[cellNumber]}`);
          showAlert(`${playerNames[playerId]} taken by ${outspos[cellNumber]}`);
          playSound("out","mpeg");
          sendPlayerToStart(playerId);
        }
      }
      setTimeout(() => moveStep(step + 1), 500);//0.5 sec delay
    }
    else{
      if(autoplay && currentPlayerIndex==1){
        rollDice()
      }
    }
  }

  moveStep(playerPos[playerId] + 1);
  console.log(`moving player${playerId}`);
}

function showAlert(message) {
  const alert = document.createElement('div');
  alert.classList.add('alert');
  alert.innerText = message;
  document.body.appendChild(alert);
  alert.offsetHeight;
  alert.classList.add('show');

  setTimeout(() => {
    alert.classList.remove('show');
    setTimeout(() => {
      document.body.removeChild(alert);
    }, 500);
  }, 2000);
}

function playSound(msg,type) {
  const audio = new Audio(`./assets/sounds/${msg}.${type}`);
  if(msg === 'move'){
    audio.volume = 0.25;
  }
  audio.play();
}

function sendPlayerToStart(playerId) {
  setTimeout(() => {
    playerPos[playerId] = 1;
    const player = document.getElementById(`player${playerId}`);
    const targetCell = document.querySelector(`#cell1`);
    if (player && targetCell) {
      targetCell.append(player);
    }
  }, 2000); // Delay for showing alert
}

function checkwinning(position,playerId){
  if(position==100){
    showAlert(`${playerNames[playerId]} has Won!`);
    playSound("win","mp3");

    const rollButton = document.getElementById('rollButton');
    rollButton.disabled = true;

    setTimeout(() => {
      const buttonsContainer = document.createElement('div');
      buttonsContainer.classList.add('buttons-container');

      const newGameButton = document.createElement('button');
      newGameButton.textContent = 'New Game';
      newGameButton.addEventListener('click', () => {
        window.location.href = 'versus.html';
      });

      const exitButton = document.createElement('button');
      exitButton.textContent = 'Exit';
      exitButton.addEventListener('click', () => {
        window.location.href = 'index.html';
      });

      buttonsContainer.appendChild(newGameButton);
      buttonsContainer.appendChild(exitButton);

      document.body.appendChild(buttonsContainer);
    }, 2000); // 2 second delay
  }
}
// Create the board
createBoard();

// Initializing players on the board
initializePlayers();
