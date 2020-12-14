const GameBoard = (() => {
  let _gameBoard = [];
  
  const resetGameBoard = () => {
    _gameBoard = [
      [null, null, null],
      [null, null, null],
      [null, null, null]
    ];
  };
  
  const getGameBoard = () => _gameBoard;
  
  const setChipOnGameBoard = (sign, coordinates) => {
    _gameBoard[coordinates.x][coordinates.y] = sign;
    return getGameBoard();
  };

  const isThreeInRow = (sign) => {
    if (
      // Horizontal rows
      (_gameBoard[0][0] === sign && _gameBoard[0][1] === sign && _gameBoard[0][2] === sign) ||
      (_gameBoard[1][0] === sign && _gameBoard[1][1] === sign && _gameBoard[1][2] === sign) ||
      (_gameBoard[2][0] === sign && _gameBoard[2][1] === sign && _gameBoard[2][2] === sign) ||
      // Vertical rows
      (_gameBoard[0][0] === sign && _gameBoard[1][0] === sign && _gameBoard[2][0] === sign) ||
      (_gameBoard[0][1] === sign && _gameBoard[1][1] === sign && _gameBoard[2][1] === sign) ||
      (_gameBoard[0][2] === sign && _gameBoard[1][2] === sign && _gameBoard[2][2] === sign) ||
      // Corner to corner rows
      (_gameBoard[0][0] === sign && _gameBoard[1][1] === sign && _gameBoard[2][2] === sign) ||
      (_gameBoard[2][0] === sign && _gameBoard[1][1] === sign && _gameBoard[0][2] === sign)
    ) {
      return true;
    } 
    
    return false;
  };

  const isBoardFull = () => {
    if (
      _gameBoard[0].includes(null) ||
      _gameBoard[1].includes(null) ||
      _gameBoard[2].includes(null)
    ) {
      return false;
    }

    return true;
  };

  return {
    resetGameBoard,
    getGameBoard,
    setChipOnGameBoard,
    isThreeInRow,
    isBoardFull
  }
})();

const Player = (details) => {
  const _sign = details.sign;
  const _name = details.name;
  let _wins = 0;
  
  const getName = () => _name;
  const getSign = () => _sign;
  const getWins = () => _wins;
  const addWin = () => _wins++;

  return {
    getName,
    getSign,
    getWins,
    addWin
  };
};

const GameFlow = (() => {
  let _playerOne = undefined;
  let _playerTwo = undefined;
  let _currentPlayer = undefined;
  let _rounds = undefined;
  let _roundCounter = undefined;

  const setPlayers = (p1, p2) => {
    _playerOne = Object.create(Player({ name: p1.name, sign: p1.sign }));
    _playerTwo = Object.create(Player({ name: p2.name, sign: p2.sign }));
  };

  const setGameBoard = () => {
    GameBoard.resetGameBoard();
  };

  const setRounds = (rounds) => {
    _rounds = rounds;
    _roundCounter = 1;
  }

  const setCurrentPlayer = () => _currentPlayer = {
    // Player one starts by default
    id: 'p1',
    name: _playerOne.getName(),
    sign: _playerOne.getSign()
  };
  
  const getCurrentRound = () => _roundCounter;

  const getRounds = () => _rounds;

  const getCurrentPlayer = () => _currentPlayer;

  const changeCurrentPlayer = () => {
    if (_currentPlayer.id === "p1") {
      _currentPlayer = {
        id: 'p2',
        name: _playerTwo.getName(),
        sign: _playerTwo.getSign()
      };

    } else {
      _currentPlayer = {
        id: 'p1',
        name: _playerOne.getName(),
        sign: _playerOne.getSign()
      };        
    }
  }

  const makeMoveAndVerifyResult = (coordinates) => {
    GameBoard.setChipOnGameBoard(_currentPlayer.sign, coordinates);

    let roundOver = false;
    let roundStatus = undefined;

    if (GameBoard.isThreeInRow(_currentPlayer.sign)) {
      // Increase win counter of the player who won the round.
      _currentPlayer.id === 'p1' ? _playerOne.addWin() : _playerTwo.addWin();
      roundOver = true;
      roundStatus = "round win";
    }

    if (GameBoard.isBoardFull()) {
      roundOver = true;
      roundStatus = "round draw";
    } 
    
    if (roundOver) {
      
      // If the played round wasn't the last one, continue the game.
      if (_roundCounter < _rounds) {
        // Increase round counter.
        _roundCounter++;
        // return round status.
        return roundStatus;

      // The played round was the last one -> end the game.
      } else {
        if (_playerOne.getWins() === _playerTwo.getWins()) {
          return "game draw";

        } else if (
          (_currentPlayer.id === 'p1' &&
          _playerOne.getWins() > _playerTwo.getWins()) ||
          (_currentPlayer.id === 'p2' &&
          _playerTwo.getWins() > _playerOne.getWins())
        ) {
          return "game win";

        } else {
          return "game loss";
        }
      }  
    
    // The round didn't end yet -> opponent's next move!
    } else {
      changeCurrentPlayer();
      return "next move"
    }
  };

  const getPlayers = () => {
    return {
      p1: {
        name: _playerOne.getName(),
        sign: _playerOne.getSign(),
        wins: _playerOne.getWins()
      },
      p2: {
        name: _playerTwo.getName(),
        sign: _playerTwo.getSign(),
        wins: _playerTwo.getWins()
      }
    }
  };

  return {
    setPlayers,
    setGameBoard,
    setRounds,
    setCurrentPlayer,
    getCurrentRound,
    getRounds,
    getCurrentPlayer,
    getPlayers,
    makeMoveAndVerifyResult
  }
})();

const displayControl = (() => {
  const addPlayerSetup = () => {
    $(document).ready(function(){
      $('#main-container').empty();

      $('#main-container').append('<div id="player-setup-grid-container"></div>');

      let p1 = '<div class="player-setup-grid-item">';
      p1 += '<p>Player #1</p>';
      p1 += '<label for="player1">Name:</label>';
      p1 += '<input id="player1" name="player1" />';
      p1 += '<p>Select your game sign:</p>';
      p1 += '<label for="X">Cross (X)</label>';
      p1 += '<input type="radio" id="X" name="sign-sel-p1" value="X" onchange="displayControl.toggleGameSigns({p: 1, s: \'X\'})" checked />';
      p1 += '<label for="O">Zero (0)</label>';
      p1 += '<input type="radio" id="0" name="sign-sel-p1" value="0" onchange="displayControl.toggleGameSigns({p: 1, s: \'0\'})" />';
      p1 += '</div>';

      let p2 = '<div class="player-setup-grid-item">';
      p2 += '<p>Player #2</p>';
      p2 += '<label for="player2">Name:</label>';
      p2 += '<input id="player2" name="player2" />';
      p2 += '<p>Select your game sign:</p>';
      p2 += '<label for="X">Cross (X)</label>';
      p2 += '<input type="radio" id="X" name="sign-sel-p2" value="X" onchange="displayControl.toggleGameSigns({p: 2, s: \'X\'})" />';
      p2 += '<label for="O">Zero (0)</label>';
      p2 += '<input type="radio" id="0" name="sign-sel-p2" value="0" onchange="displayControl.toggleGameSigns({p: 2, s: \'0\'})" checked />';
      p2 += '</div>';

      let roundSelAndSubmit = '<div class="player-setup-grid-item span-col-2">';
      roundSelAndSubmit += '<div>';
      roundSelAndSubmit += '<p>Select how many rounds are played:</p>';
      roundSelAndSubmit += '<label for="three-rounds">3 rounds</label>';
      roundSelAndSubmit += '<input type="radio" id="three-rounds" name="round-selection" value="3" checked />';
      roundSelAndSubmit += '<label for="five-rounds">5 rounds</label>';
      roundSelAndSubmit += '<input type="radio" id="five-rounds" name="round-selection" value=""5 />';
      roundSelAndSubmit += '<label for="seven-rounds">7 rounds</label>';
      roundSelAndSubmit += '<input type="radio" id="seven-rounds" name="round-selection" value="7" />';
      roundSelAndSubmit += '</div>';
      roundSelAndSubmit += '<div>';
      roundSelAndSubmit += '<button id="start" onclick="displayControl.handleStartGameOnClick()">Start game</button>';
      roundSelAndSubmit += '</div>';
      roundSelAndSubmit += '</div>';

      $('#player-setup-grid-container').append(p1, p2, roundSelAndSubmit);
    });
  };

  const toggleGameSigns = (selection) => {
    $(document).ready(function() {
      if (selection.p === 1 && selection.s === 'X') {
        $('input[name="sign-sel-p2"][id="0"]').prop('checked', true);
      } else if (selection.p === 1 && selection.s === '0') {
        $('input[name="sign-sel-p2"][id="X"]').prop('checked', true);
      } else if (selection.p === 2 && selection.s === 'X') {
        $('input[name="sign-sel-p1"][id="0"]').prop('checked', true);
      } else if (selection.p === 2 && selection.s === '0') {
        $('input[name="sign-sel-p1"][id="X"]').prop('checked', true);
      }
    });
  };

  const handleStartGameOnClick = () => {
    $(document).ready(function() {
      const p1Name = $('input[id="player1"]').val();
      const p1Sign = $('input[name="sign-sel-p1"]:checked').val();
      const p2Name = $('input[id="player2"]').val();
      const p2Sign = $('input[name="sign-sel-p2"]:checked').val();
      const rounds = $('input[name="round-selection"]:checked').val();

      GameFlow.setPlayers({ name: p1Name, sign: p1Sign }, { name: p2Name, sign: p2Sign });
      GameFlow.setGameBoard();
      GameFlow.setRounds(rounds);
      GameFlow.setCurrentPlayer();

      addGameBoard();
      addGameStatusContainer();
      updateRoundInfo();
      updateGameStatus();
      updateNextMoveMessage();
    });
  };

  const updateNextMoveMessage = () => {
    $(document).ready(function() {
      $('#game-messages').empty();
      const currentPlayer = GameFlow.getCurrentPlayer();
      const messageElem = `<div>${currentPlayer.name}, make your move!</div>`;
      $('#game-messages').append(messageElem);
    });
  };

  const updateRoundInfo = () => {
    $(document).ready(function() {
      $('#round-info').text(
        `Current round: ${GameFlow.getCurrentRound()} / ${GameFlow.getRounds()}`
      );
    });
  };

  const updateGameStatus = () => {
    $(document).ready(function() {
      const playerDetails = GameFlow.getPlayers();
      $('#p1-wins').text(`${playerDetails.p1.name} (${playerDetails.p1.sign}): ${playerDetails.p1.wins}`);
      $('#p2-wins').text(`${playerDetails.p2.name} (${playerDetails.p2.sign}): ${playerDetails.p2.wins}`);
    });
  };

  const handleNextRoundOnClick = () => {
    GameFlow.setGameBoard();
    addGameBoard();
    addGameStatusContainer();
    updateRoundInfo();
    updateGameStatus();
    updateNextMoveMessage();
  };

  const displayGameMessage = (message) => {
    // Show updated game details on screen.
    updateGameStatus();

    $(document).ready(function() {

      // Disable/remove onClick events from all game board cells.
      $('.gameboard-grid-item').removeAttr('onclick');

      // Show desired game message.
      $('#game-messages').append(message);
    });
  };

  const handleGameGridItemOnClick = (coordinates) => {
    $(document).ready(function() {
      
      const clickedCell = $(`#${'cell-' + coordinates.x + coordinates.y}`);

      // Game board cell is updated only if it is empty.
      if (clickedCell.text() === '') {
        const currentPlayer = GameFlow.getCurrentPlayer();
        clickedCell.append(currentPlayer.sign);

        // Pass the move to game engine and get the result.
        const result = GameFlow.makeMoveAndVerifyResult(coordinates);

        // Message placeholder.
        let message = '';

        // Select correct message to be displayed.
        switch (result) {
          
          case 'round win':
            message = `<p>Congrats ${currentPlayer.name}! You won the round!</p>`;
            message += '<div>';
            message += `<button id="next-round" onclick="displayControl.handleNextRoundOnClick()">Next round</button>`
            message += '</div>';
            displayGameMessage(message);
            break;
          
          case 'round draw':
            message = '<p>Dou! The round was draw!</p>';
            message += '<div>';
            message += `<button id="next-round" onclick="displayControl.handleNextRoundOnClick()">Next round</button>`
            message += '</div>';
            displayGameMessage(message);
            break;

          case 'game win':
            message = `<p>Awesome, ${currentPlayer.name}! You won the game!</p>`;
            displayGameMessage(message);
            break;

          case 'game loss':
            message = `<p>Sorry ${currentPlayer.name}, you lost the game...!</p>`;
            displayGameMessage(message);
            break;

          case 'game draw':
            message = '<p>W00t?!? The game was draw! Unbelievable...!</p>';
            displayGameMessage(message);
            break;

          case 'next move':
            updateNextMoveMessage();
            break;

          default:
            break;
        }
      }

    });
  };

  const addGameBoard = () => {
    $(document).ready(function() {
      $('#main-container').empty();

      $('#main-container').append('<div id="gameboard-grid-container"></div>');

      let boardGridItems = '';
      for (let x = 0; x < 3; x++) {
        for (let y = 0; y < 3; y++) {
          boardGridItems += `<div class="gameboard-grid-item" id="${'cell-' + x + y}" onclick="displayControl.handleGameGridItemOnClick({ x: ${x}, y: ${y} })"></div>`;
        }
      }

      $('#gameboard-grid-container').append(boardGridItems); 
    });
  };

  const addGameStatusContainer = () => {
    $(document).ready(function() {
      let statusContainer = '<div id="game-status-container">';
      statusContainer += '<div id="game-details">';
      statusContainer += '<div id="round-info"></div>';
      statusContainer += '<div id="wins-info"><p>Wins:</>';
      statusContainer += '<div id="p1-wins"></div>';
      statusContainer += '<div id="p2-wins"></div>';
      statusContainer += '</div>';
      statusContainer += '</div>';
      statusContainer += '<div id="game-messages"></div>';
      statusContainer += '</div>';

      $('#main-container').append(statusContainer);
    });
  };

  return { addPlayerSetup, toggleGameSigns, handleStartGameOnClick, handleGameGridItemOnClick, handleNextRoundOnClick }
})();