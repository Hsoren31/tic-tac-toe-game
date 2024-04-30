//Display Board
 const gameboard = (function () {
   //Our board will be a 3x3 grid
   const board = [];
   const rows = 3;
   const columns = 3;

   for(let i = 0; i < rows; i++){
      //each row in the board array will be represented by another array
      board[i] = [];
      //the columns in the rows will be represented by -
      for (let j = 0; j < columns; j++){
         board[i].push('-');
      }
   }

   return board;
})();

//create player objects that hold their name and marker for the game
function createPlayer (name, marker) {
   return {
      name,
      marker
   }
};

const player1 = createPlayer('player 1', 'X');
const player2 = createPlayer('player 2', 'O');

//object to play the game
const game = (function (){
   const board = gameboard;
   console.log(board);

   //Keep players in array to easily switch between turns
   const players = [
      player1,
      player2
   ]
   
   let activePlayer = players[0];
   const switchPlayerTurn = () => {
      activePlayer = activePlayer === players[0] ? players[1] : players[0];
   }

   const getActivePlayer = () => activePlayer;

   console.log(activePlayer);
   //Rounds
   const playRound = (row, column) => {
      board[row][column] = getActivePlayer().marker;
      console.log(board);
      switchPlayerTurn();
   }

   return {
      activePlayer,
      playRound
   };
})();