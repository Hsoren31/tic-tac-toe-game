//Tic tac toe game

//gameboard function represents the state of the board
function gameboard(){
   const board = [];
   const rows = 3;
   const columns = 3;
   //this loop creates our board, consisting of three row arrays,
   //and three column arrays within each row array
   for (let row = 0; row < rows; row++) {
      board[row] = [];
      for (let col = 0; col < columns; col++){
         board[row].push(cell());
      };
   };
   //function grabs our board
   const getBoard = () => board;
//place marker function takes in the index of a cell and add the players
//marker to that index, it will exit the function if the cell is already taken
   const placeMarker = (row, column, player) => {
      const availableCell = board[row][column].getValue() === '-';
      if (!availableCell) return;
      board[row][column].addMarker(player);
   };
//printBoard is for our console version so we can see what is going on to 
//the state of the board
   const printBoard = () => {
      const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()))
      console.log(boardWithCellValues);
    };

   return {getBoard, placeMarker, printBoard};
};

//cell function represents the value of our cells on the board
function cell() {
   let value = '-';//default value

   const addMarker = (player) => {
      //changing the value to the players marker
      value = player;
   };
   //grab the current value of the cell
   const getValue = () => value;

   return {
      getValue,
      addMarker
   };
};

function createPlayer (name, marker) {
   name = name;
   marker = marker;

   let playerScore = 0;
   const getScore = () => playerScore;
   const giveScore = () => playerScore++;

   return {
      name,
      marker,
      getScore,
      giveScore
   }
};

//gameController is our game flow function, it takes in two players
// sets their markers and plays rounds of tic tac toe while checking for
//draws or wins from the players and alternating turns between the players
function gameController(player1, player2){
   
   const board = gameboard();
   //array to hold player objects, the following functions will start the 
   //game at player ones turn and then alternate to player two and so on.
   const players = [
      player1,
      player2
   ];
   
   let activePlayer = players[0];

   const switchPlayerTurn = () => {
      activePlayer = activePlayer === players[0] ? players[1] : players[0];
   };

   const getActivePlayer = () => activePlayer;

   //gameWon will remain false unless one player gets three in a row
   let gameWon = false;

   //checkwinner will be how we test if one player has gotten three in
   //a row on the board
   const checkWinner = () => {
      //destruct the board to assign the cells a specific variable
      const [
         [cell1, cell2, cell3],
         [cell4, cell5, cell6],
         [cell7, cell8, cell9]
      ] = board.getBoard();
      //here we assign the cell variables into winning combinations that
      //we would see on the board
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
      //for loop will loop through winning combination array
      for (let w = 0; w < winningCombinations.length; w++){
         //destruct each array in winning combinations to assign their value
         const winCombination = winningCombinations[w];
         const cellA = winCombination[0].getValue();
         const cellB = winCombination[1].getValue();
         const cellC = winCombination[2].getValue();
         //here we test if the cells are taken
         if (cellA !== '-' && cellB !== '-' && cellC !== '-'){
            //if the cells are all taken and they are the same marker
            //the game has won and we change gameWon to true;
            if (cellA === cellB && cellB === cellC){
               console.log(`${getActivePlayer().name} won.`);
               gameWon = true;
            };
         }
      };
   };
   //Checking for a draw we have to see if every cell on the board was taken
   //without getting three in a row by either player
   const checkForDraw = () => {
      //available cells will represent the number of cells that are equal to '-'
      let availableCells = 0;
      const currentBoard = board.getBoard(); //grab the board to iterate through
      //loop checks every value of the board, each one that is equal to '-' will
      //add 1 to available cells
      for(let i = 0; i < currentBoard.length; i++){
         for(let j = 0; j < currentBoard[i].length; j++){
            currentBoard[i][j].getValue() === '-'
            ? availableCells++ : availableCells;
         };
      };
      //if there are no available cells and the game was not won, we determine a
      //draw between the players
      if (availableCells === 0 && gameWon === false){
         console.log('it is a draw.');
      };
   };
   //we use this to print the board, and to log the active players turn
   const printNewRound = () => {
      board.printBoard();
      console.log(`${getActivePlayer().name}'s turn`)
   };
   /*play round function plays a single round of tic tac toe, we take in the
   selected row and column, and we use the place marker function to change
   the cells value to the players marker, then we check for a winner, then
   for a draw, then switch the players turns, and print the new board*/
   const playRound = (row, column) => {
      board.placeMarker(row, column, getActivePlayer().marker);
      checkForDraw();
      checkWinner();
      switchPlayerTurn();
      printNewRound();
   };
   //print initial board and first players turn
   printNewRound();

   return {
      getActivePlayer,
      playRound,
      getBoard: board.getBoard()
   };
};

/* screen controller will turn our console version game into a game with buttons
that users can click and it will trigger our play round function and we can play
our game of tic tac toe
*/
function screenController (player1, player2) {
   const game = gameController(player1, player2);
   const playerTurnDiv = document.getElementById('player_turn');
   const boardContainer = document.getElementById('board_container');
   const board = game.getBoard;

   //updateScreen function turns each cell in the board into a clickable
   //button that holds the value of the row and column that it represents
   const updateScreen = () => {
      boardContainer.textContent = ''; //clear our board container
      //update the players turn message
      playerTurnDiv.textContent = `${game.getActivePlayer().name}'s turn...`;
      //turn board cells into buttons with values of their row and column
      for(let row = 0; row < board.length; row++){
         for(let col = 0; col < board[row].length; col++){
            const cellButton = document.createElement('button');
            cellButton.classList = 'cell_button';
            cellButton.dataset.row = row;
            cellButton.dataset.column = col;
            cellButton.textContent = board[row][col].getValue();
            boardContainer.append(cellButton);
         };
         //use html breaks to make the board display as a 3X3 board
         const br = document.createElement('br');
         boardContainer.append(br);
      };
   };
   //click handler will trigger our play round function and update our screen
   function clickHandler(e) {
      game.playRound(e.target.dataset.row, e.target.dataset.column);
      updateScreen();
   };
   //assign our click handler function to a event listener on our board container
   boardContainer.addEventListener('click', clickHandler);
   //initially update the screen
   updateScreen();
};

//Start and Reset game button
const gameInteract = (function gameInteract(){
   const startGame = document.querySelector('#start_game');
   const resetGame = document.querySelector('#reset_game');
   const dialogGame = document.querySelector('#game');

   const playerNameForm = document.querySelector('#player_name_form');
   const submitNames = document.querySelector('#submit_names');

   //hide the gameboard until game starts
   dialogGame.style.display = 'none';
   resetGame.style.display = 'none';

   //show our player name input form when we click start game
   startGame.addEventListener('click', () => {
      playerNameForm.showModal();
   });

   //submit player name form
   submitNames.addEventListener('click', (e) => {
      e.preventDefault();
      let player1Name = document.querySelector('#player_one').value;
      let player2Name = document.querySelector('#player_two').value;

      let player1 = createPlayer(player1Name, 'X');
      let player2 = createPlayer(player2Name, 'O');
   
      playerNameForm.close();
      startGame.style.display = 'none';
      dialogGame.style.display = 'block';
      resetGame.style.display = 'block';

      screenController(player1, player2);
   });

   //reset game when clicked will clear and show our game
   //board and restart our screen controller game
   resetGame.addEventListener('click', () => {
      dialogGame.style.display = 'none';
      startGame.style.display = 'block';
      resetGame.style.display = 'none';
   });
   
})();