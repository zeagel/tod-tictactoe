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
      p1 += '<div class="item-header">Player #1</div>';

      p1 += '<div class="radio-container-stacked">';
      p1 += '<div>';
      p1 += '<input type="radio" id="player1-type-human" name="player1-type" value="human" onchange="displayControl.handlePlayerTypeOnChange(\'p1\')" checked />';
      p1 += '<label for="player1-type-human">Human</label>';
      p1 += '<br />';
      p1 += '<input type="radio" id="player1-type-cpu" name="player1-type" value="computer" onchange="displayControl.handlePlayerTypeOnChange(\'p1\')" />';
      p1 += '<label for="player1-type-cpu">Computer</label>';
      p1 += '</div>';
      p1 += '</div>';

      p1 += '<label for="player1" class="item-sub-header">Name:</label>';
      p1 += '<input id="player1" class="player-setup-input" name="player1" maxlength="18" />';

      p1 += '<div>';
      p1 += '<div class="item-sub-header">Game sign:</div>';
      p1 += '<div class="radio-container-stacked">';
      p1 += '<div>';
      p1 += '<input type="radio" id="X" name="sign-sel-p1" value="X" onchange="displayControl.toggleGameSigns({p: 1, s: \'X\'})" checked />';
      p1 += '<label for="X">Cross ( X )</label>';
      p1 += '<br />';
      p1 += '<input type="radio" id="0" name="sign-sel-p1" value="0" onchange="displayControl.toggleGameSigns({p: 1, s: \'0\'})" />';
      p1 += '<label for="O">Zero ( 0 )</label>';
      p1 += '</div>';
      p1 += '</div>';

      p1 += '</div>'; // closes '<div class="player-setup-grid-item">'

      let p2 = '<div class="player-setup-grid-item">';
      p2 += '<div class="item-header">Player #2</div>';

      p2 += '<div class="radio-container-stacked">';
      p2 += '<div>';
      p2 += '<input type="radio" id="player2-type-human" name="player2-type" value="human" onchange="displayControl.handlePlayerTypeOnChange(\'p2\')" checked />';
      p2 += '<label for="player2-type-human">Human</label>';
      p2 += '<br />'
      p2 += '<input type="radio" id="player1-type-cpu" name="player2-type" value="computer" onchange="displayControl.handlePlayerTypeOnChange(\'p2\')" />';
      p2 += '<label for="player2-type-cpu">Computer</label>';
      p2 += '</div>';
      p2 += '</div>';

      p2 += '<label for="player2" class="item-sub-header">Name:</label>';
      p2 += '<input id="player2" class="player-setup-input" name="player2" maxlength="18" />';

      p2 += '<div>';
      p2 += '<div class="item-sub-header">Game sign:</div>';
      p2 += '<div class="radio-container-stacked">';
      p2 += '<div>';
      p2 += '<input type="radio" id="X" name="sign-sel-p2" value="X" onchange="displayControl.toggleGameSigns({p: 2, s: \'X\'})" />';
      p2 += '<label for="X">Cross ( X )</label>';
      p2 += '<br />'
      p2 += '<input type="radio" id="0" name="sign-sel-p2" value="0" onchange="displayControl.toggleGameSigns({p: 2, s: \'0\'})" checked />';
      p2 += '<label for="O">Zero ( 0 )</label>';
      p2 += '</div>';
      p2 += '</div>';

      p2 += '</div>'; // closes '<div class="player-setup-grid-item">'

      let roundSelAndSubmit = '<div class="player-setup-grid-item span-col-2">';
      
      roundSelAndSubmit += '<div class="item-sub-header">How many rounds are played?</div>';
      roundSelAndSubmit += '<div id="round-radio-container">';
      roundSelAndSubmit += '<div>'
      roundSelAndSubmit += '<input type="radio" id="three-rounds" name="round-selection" value="3" checked />';
      roundSelAndSubmit += '<label for="three-rounds">3 rounds</label>';
      roundSelAndSubmit += '</div><div>'
      roundSelAndSubmit += '<input type="radio" id="five-rounds" name="round-selection" value=""5 />';
      roundSelAndSubmit += '<label for="five-rounds">5 rounds</label>';
      roundSelAndSubmit += '</div><div>'
      roundSelAndSubmit += '<input type="radio" id="seven-rounds" name="round-selection" value="7" />';
      roundSelAndSubmit += '<label for="seven-rounds">7 rounds</label>';
      roundSelAndSubmit += '</div></div>';
      
      roundSelAndSubmit += '<div id="start-button-container">';
      roundSelAndSubmit += '<button id="start" class="common-button" onclick="displayControl.handleStartGameOnClick()">START GAME</button>';
      roundSelAndSubmit += '</div>';
      
      roundSelAndSubmit += '</div>'; // closes '<div class="player-setup-grid-item span-col-2">'

      const messageContainer = '<div id="player-setup-message-container" class="span-col-2"></div>';

      $('#player-setup-grid-container').append(p1, p2, roundSelAndSubmit, messageContainer);
    });
  };

  // Clear possible earlier set interval timeouts.
  const clearAllEarlierIntervalTimeouts = () => {
    const highestId = window.setTimeout(() => {
      for (let i = highestId; i >= 0; i--) {
        window.clearInterval(i);
      }
    }, 0);
  };

  const handlePlayerTypeOnChange = (player) => {
    console.log(`Player '${player}' type onChange event triggered!`);

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

      // Clear possible earlier message.
      $('#player-setup-message-container').empty();

      const p1Name = $('input[id="player1"]').val();
      const p1Sign = $('input[name="sign-sel-p1"]:checked').val();
      const p1Type = $('input[name="player1-type"]:checked').val();
      const p2Name = $('input[id="player2"]').val();
      const p2Sign = $('input[name="sign-sel-p2"]:checked').val();
      const p2Type = $('input[name="player2-type"]:checked').val();
      const rounds = $('input[name="round-selection"]:checked').val();

      if (p1Name !== '' && p2Name !== '') {
        GameFlow.setPlayers({ name: p1Name, sign: p1Sign }, { name: p2Name, sign: p2Sign });
        GameFlow.setGameBoard();
        GameFlow.setRounds(rounds);
        GameFlow.setCurrentPlayer();
  
        addGameBoard();
        addGameStatusContainer();
        updateRoundInfo();
        updateGameStatus();
        updateNextMoveMessage();
      } else {
        $('#player-setup-message-container')
          .append('<div class="error-message">Error! Both player names must be provided.</div>');
      
        clearAllEarlierIntervalTimeouts();

        setInterval(() => {
          $('#player-setup-message-container').empty();
        }, 3000);
  
      }
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
      $('#p1-wins').empty();
      $('#p2-wins').empty();
      $('#p1-wins').append(`<div class="wins-data-item-left">${playerDetails.p1.name} ( ${playerDetails.p1.sign} )</div><div class="wins-data-item-right">: ${playerDetails.p1.wins}</div>`);
      $('#p2-wins').append(`<div class="wins-data-item-left">${playerDetails.p2.name} ( ${playerDetails.p2.sign} )</div><div class="wins-data-item-right">: ${playerDetails.p2.wins}</div>`);
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

      // Clear ealier message.
      $('#game-messages').empty();

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
            message = `<div>Congrats ${currentPlayer.name}! You won the round!</div>`;
            message += '<div>';
            message += `<button id="next-round" class="common-button" onclick="displayControl.handleNextRoundOnClick()">NEXT ROUND</button>`
            message += '</div>';
            displayGameMessage(message);
            break;
          
          case 'round draw':
            message = '<div>Dou! The round was draw!</div>';
            message += '<div>';
            message += `<button id="next-round" class="common-button" onclick="displayControl.handleNextRoundOnClick()">NEXT ROUND</button>`
            message += '</div>';
            displayGameMessage(message);
            break;

          case 'game win':
            message = `<div>Awesome, ${currentPlayer.name}! You won the game!</div>`;
            displayGameMessage(message);
            break;

          case 'game loss':
            message = `<div>Sorry ${currentPlayer.name}, you lost the game...!</div>`;
            displayGameMessage(message);
            break;

          case 'game draw':
            message = '<div>W00t?!? The game was draw! Unbelievable...!</div>';
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
      statusContainer += '<div id="wins-info">Round wins:</div>';
      statusContainer += '<div id="p1-wins" class="wins-data-container"></div>';
      statusContainer += '<div id="p2-wins" class="wins-data-container"></div>';
      statusContainer += '</div>';
      statusContainer += '</div>';
      statusContainer += '<div id="game-messages"></div>';
      statusContainer += '</div>';

      $('#main-container').append(statusContainer);
    });
  };

  return {
    addPlayerSetup,
    handlePlayerTypeOnChange,
    toggleGameSigns,
    handleStartGameOnClick,
    handleGameGridItemOnClick,
    handleNextRoundOnClick }
})();