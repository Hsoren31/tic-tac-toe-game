//Tic tac toe game

/* function gameboard holds the state of the board, it creates a 3 x 3 grid
   made up of arrays, in each column we call the cell function which we define
   later, we return multiple functions that will change the value of the column,
   grab the gameboard, and reset the board to default values*/
function gameboard(){
   const board = [];
   const rows = 3;
   const columns = 3;

   for (let row = 0; row < rows; row++) {
      board[row] = [];                          
      for (let col = 0; col < columns; col++){
         board[row].push(cell());
      };
   };
   
   const getBoard = () => board;                

   const placeMarker = (row, column, player) => {
      board[row][column].addMarker(player);
   };

   const resetBoard = () => {
      board.forEach((row) => {
         row.forEach((col) => {
            col.resetValue();
         })
      })
   };

   return {getBoard, placeMarker, resetBoard};
};

/*This function will be what holds the value of the columns
   - is the default value
   X or O will be the players markers */
function cell() {
   let value = '-';

   const addMarker = (player) => {
      value = player;
   };
   
   const getValue = () => value;

   const resetValue = () => {
      value = '-';
   };

   return {
      getValue,
      addMarker,
      resetValue
   };
};

//function to create player that holds their name, marker, and score
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

/*game controller is the function that holds our game flow, holds our board,
our players, game status, functions to switch players, check for winner, check
for draw, play a single round, and end game function */
function gameController(player1, player2){
   const board = gameboard();

   const players = [
      player1,
      player2
   ];
   
   let activePlayer = players[0];

   const switchPlayerTurn = () => {
      activePlayer = activePlayer === players[0] ? players[1] : players[0];
   };

   const getActivePlayer = () => activePlayer;

   let roundWon = false;   
   let roundTie = false;   

   const getRoundStatus = () => {
      roundWon,
      roundTie
   };
   /*check for winner will assign the columns variables, the we put the variables
   into winning combinations to check against, if we come across a combinations
   that all have the same player value we return round won to be true*/
   const checkWinner = () => {
      const [
         [cell1, cell2, cell3],
         [cell4, cell5, cell6],
         [cell7, cell8, cell9]
      ] = board.getBoard();
     
      const winningCombinations = [
         [cell1, cell2, cell3], //row combinations
         [cell4, cell5, cell6],
         [cell7, cell8, cell9],
         [cell1, cell4, cell7], //column combinations
         [cell2, cell5, cell8],
         [cell3, cell6, cell9],
         [cell1, cell5, cell9], //diagonal combinations
         [cell3, cell5, cell7]
      ];
      
      for (let w = 0; w < winningCombinations.length; w++){
         const winCombination = winningCombinations[w];
         const cellA = winCombination[0].getValue();
         const cellB = winCombination[1].getValue();
         const cellC = winCombination[2].getValue();
         
         if (cellA !== '-' && cellB !== '-' && cellC !== '-'){
            if (cellA === cellB && cellB === cellC){
               getActivePlayer().giveScore();
               roundWon = true;
               endRound();
            };
         }
      };
   };
  /*check for draw, will go through the board to check for any
  unchecked cells, if our board is full with no winning combos
  we return draw to be true*/
   const checkForDraw = () => {
      let availableCells = 0;
      const currentBoard = board.getBoard();

      for(let i = 0; i < currentBoard.length; i++){
         for(let j = 0; j < currentBoard[i].length; j++){
            currentBoard[i][j].getValue() === '-'
            ? availableCells++ : availableCells;
         };
      };

      if (availableCells === 0 && gameWon === false){
         console.log('it is a draw.');
         roundTie = true;
         endRound();
      };
   };
   /*end round will run if draw or win is true, and display
   a message whether a player won or draw has occured, and 
   resets the board to default values*/
   function endRound() {
      const roundMessage = document.querySelector('#game_messages');
      const endMessage = document.querySelector('#end_message');

      getRoundStatus();

      if(roundTie === true){
         roundMessage.showModal();
         endMessage.textContent = 'The round has ended in a tie';
      } else if (roundWon === true) {
         roundMessage.showModal();
         endMessage.textContent = `${getActivePlayer().name} won the round!`;
      }

      board.resetBoard();
   };
   /*play round function plays a single round of tic tac toe, we take in the
   selected row and column, and we use the place marker function to change
   the cells value to the players marker, then we check for a winner, then
   for a draw, then switch the players turns*/
   const playRound = (row, column) => {
      board.placeMarker(row, column, getActivePlayer().marker);
      checkForDraw();
      checkWinner();
      switchPlayerTurn();
   };

   return {
      getActivePlayer,
      playRound,
      getBoard: board.getBoard(),
   };
};

/* screen controller takes in our game controller function, and connects it
to the screen, we use the update screen function to update the board, which
players turn it is, and the players scores between game rounds
*/
function screenController (player1, player2) {
   const game = gameController(player1, player2);
   const playerTurnDiv = document.getElementById('player_turn');
   const boardContainer = document.getElementById('board_container');
   const board = game.getBoard;
   const player1Score = document.getElementById('p1_score');
   const player2Score = document.getElementById('p2_score');

   const updateScreen = () => {
      boardContainer.textContent = '';
      
      playerTurnDiv.textContent = `${game.getActivePlayer().name}'s turn...`;

      player1Score.textContent = `Player 1's Score: ${player1.getScore()}`;
      player2Score.textContent = `Player 2's Score: ${player2.getScore()}`;

      for(let row = 0; row < board.length; row++){
         for(let col = 0; col < board[row].length; col++){
            const cellButton = document.createElement('button');
            cellButton.classList = 'cell_button';
            cellButton.dataset.row = row;
            cellButton.dataset.column = col;
            cellButton.textContent = board[row][col].getValue();
            boardContainer.append(cellButton);
         };
         const br = document.createElement('br');
         boardContainer.append(br);
      };
   };
   //click handler will trigger our play round function and update our screen
   function clickHandler(e) {
      const availableCell = '-';
      if (e.target.textContent != availableCell) return;

      game.playRound(e.target.dataset.row, e.target.dataset.column);
      updateScreen();
   };
   boardContainer.addEventListener('click', clickHandler);
   //initially update the screen
   updateScreen();
};

//game interact holds our player name form, our start game button,
//and our reset round click handler
const gameInteract = (function gameInteract(){
   const startGame = document.querySelector('#start_game');
   const resetRound = document.querySelector('#reset_round');
   const gameDiv = document.querySelector('#game');
   const gameMessage = document.querySelector('#game_messages');
   const playerNameForm = document.querySelector('#player_name_form');
   const submitNames = document.querySelector('#submit_names');

   //hide the gameboard until game starts
   gameDiv.style.display = 'none';
   resetRound.style.display = 'none';

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
      gameDiv.style.display = 'block';
      resetRound.style.display = 'block';
      screenController(player1, player2);
   });

   //reset game when clicked will clear and show our game
   //board and restart our screen controller game
   resetRound.addEventListener('click', () => {
      gameMessage.close();
      gameDiv.style.display = 'block';
   });
})();