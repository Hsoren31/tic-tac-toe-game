//Game Board function to make 3x3 board and print to the console.
 function GameBoard() {
   //Make board of 3x3
    const rows = 3;
    const columns = 3;
    const board = [];

    for(let i = 0; i < rows; i++){
      board[i] = [];
      for(let j = 0; j < columns; j++ ){
         board[i].push(Cell());
      }
    }
    //Place Marker function that will change the value of the cell on the board
    const placeMarker = (row, column, player) => {
      board[row][column].addMarker(player);
    }

    //This should pass the active state of the board to the console.
    const printBoard = () => {
      const boardWithCellValues = board.map((row) => 
      row.map((cell) => cell.getValue()))
      console.log(boardWithCellValues);
    };
    return {
      placeMarker,
      printBoard};
};
//function to determine the value of each cell
function Cell(){
   let value = '0';

   const addMarker = (player) => {
      value = player.marker;
   };

   const getValue = () => value;

   return {
      addMarker,
      getValue
   };
}

 //Function to create player objects that hold their name and marker for the game

 function createPlayer (name, marker) {
   return {
      name,
      marker
   }
 }

 const player1 = createPlayer('player1', 'X');
 const player2 = createPlayer('player2', 'O');

//Function that passes in both players, determines 
//which players turn, and plays a single 'round' or 'turn;
 function GameController(player1, player2){
   const board = GameBoard();


   //players go into an array to then easily pass back and forth turns
   const players = [
      player1,
      player2
   ];

   let activePlayer = players[0];

   const switchPlayerTurn = () => {
      activePlayer = activePlayer === players[0] ?
      players[1] : players[0];
   };

   const getActivePlayer = () => activePlayer;
   //Prints current state of board and trades turns
   const printNewRound = () => {
      board.printBoard();

      console.log(`${getActivePlayer().name}'s turn.`);
   };

   const playRound = (row, column) => {
      console.log(`Placing ${getActivePlayer().name}'s marker...`);

      board.placeMarker(row, column, getActivePlayer());

      switchPlayerTurn();
      printNewRound();
   };

   printNewRound();

   return {
      playRound,
      getActivePlayer
   };
 }

 const game = GameController(player1, player2);