// Get total players and play mode from session storage
let totalPlayers = sessionStorage.getItem('totalPlayers');
let playMode = sessionStorage.getItem('play');

// Set default values if session storage is not available
if (totalPlayers === null || totalPlayers === 'undefined') {
  totalPlayers = 2;
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
  // cell.textContent = number;
  cell.id = 'cell' + number;
  if (number % 2 == 0) {
    cell.classList.add('cell', 'even');
  } else {
    cell.classList.add('cell', 'odd');
  }
  const text = document.createElement('div');
  text.textContent = number;
  text.classList.add('text');
  cell.appendChild(text);
  if(number === 1){
    // cell.classList.add('cell-contains');
    // cell.textContent = '';
    for (let i = 0; i < totalPlayers; i++) {
      const innerDiv = document.createElement('div');
      innerDiv.classList.add('player-marker', team[i]);
      
      cell.appendChild(innerDiv);
    }
  }
  return cell;
}

// Function to roll the dice and display the result
function rollDice() {
  var array = ['DOT', 'ONE', 'TWO', 'THREE', 'FOUR', 'SIX'];
  let index = Math.floor(Math.random() * array.length);
  let display = document.getElementById("input");
  display.value = array[index];
  console.log(array[index]);
  changeColor();
}

// Event listener for the roll dice button
document.getElementById("rollButton").addEventListener("click", rollDice);

// Function to change the color of the roll dice button
let currentPlayerIndex = 0;
function changeColor() {
  let dice = document.getElementById("rollButton");
  dice.classList.remove(team[currentPlayerIndex]);
  currentPlayerIndex = (currentPlayerIndex + 1) % totalPlayers;
  dice.classList.add(team[currentPlayerIndex]);
}

// Player colors
var team = ["bg-blue-900", "bg-red-600", "bg-yellow-500", "bg-gray-900"];


// Create the board
createBoard();