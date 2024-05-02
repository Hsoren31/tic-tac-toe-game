//Display Board
 const gameboard = (function gameboard(){
   const board = [];
   const rows = 3;
   const columns = 3;

   for (let i = 0; i < rows; i++) {
      board[i] = [];
      for (let j = 0; j < columns; j++){
         board[i].push(cell().getValue());
      };
   };

   const getBoard = () => board;

   const placeMarker = (row, column, player) => {
      const availableCell = board[row][column] === '-';
      if (!availableCell) return;
      return board[row][column].addMarker(player);
   };

   return {getBoard, placeMarker};
})();

function cell() {
   let value = '-';

   const getValue = () => value;

   const addMarker = (playerMarker) => {
      return value = `${playerMarker}`;
   };

   return {
      addMarker,
      getValue
   };
};

const gameController = (function gameController(
   playerOneName = 'Player 1',
   playerTwoName = 'Player 2'
){
   const board = gameboard.getBoard();

   const players = [
      {name: playerOneName, marker: 'X'},
      {name: playerTwoName, marker: 'O'}
   ];
   
   let activePlayer = players[0];

   const switchPlayerTurn = () => {
      activePlayer = activePlayer === players[0] ? players[1] : players[0];
   };

   const getActivePlayer = () => activePlayer;

   let gameWon = false;

   const checkWinner = () => {
      const [
         [cell1, cell2, cell3],
         [cell4, cell5, cell6],
         [cell7, cell8, cell9]
      ] = board;

      const winningCombinations = [
         [cell1, cell2, cell3], //row combinations
         [cell4, cell5, cell6],
         [cell7, cell8, cell9],
         [cell1, cell4, cell7], //column combinations
         [cell2, cell5, cell8],
         [cell3, cell6, cell9],
         [cell1, cell5, cell9], //diagonal combinations
         [cell3, cell5, cell7]
      ]

      for (let w = 0; w < winningCombinations.length; w++){
         const winCombination = winningCombinations[w];
         const cellA = winCombination[0];
         const cellB = winCombination[1];
         const cellC = winCombination[2];

      if (cellA !== '-' && cellB !== '-' && cellC !== '-'){
         if (cellA === cellB && cellB === cellC){
            console.log(`${getActivePlayer().name} won.`);
            gameWon = true;
         };
      }
      };
   };

   const checkForDraw = () => {
      let availableCells = 0;

      for (let r = 0; r < board.length; r++){
         for (let c = 0; c < board[r].length; c++){
            board[r][c] === '-'
            ? availableCells++ : (availableCells = availableCells);
         };
      };

      if (availableCells === 0 && gameWon === false){
         console.log('it is a draw.');
      };

      return (console.log(availableCells));
   };

   const playRound = (row, column) => {
      board[row][column] = getActivePlayer().marker;
      checkForDraw();
      checkWinner();
      switchPlayerTurn();
      return board;
   };

   return {
      activePlayer,
      getActivePlayer,
      playRound
   };
})();