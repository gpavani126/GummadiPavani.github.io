var moves=[]
var startboard;
const oPlayer = 'O';
const aiPlayer = 'X'
const xPlayer= aiPlayer
let currentPlayer = oPlayer;
let gameType="comp";
//game types = comp or human

function playermode(elem){
        gameType=elem.id
        // console.log(elem)
}

const winning = [
    //side ways
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    //straight
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    //diagonally
    [0, 4, 8],
    [6, 4, 2]
]

const cells = document.querySelectorAll('.cell');
startGame();

function startGame() {
    document.querySelector(".endgame").style.display = "none";
    startboard = Array.from(Array(9).keys());
    console.log(startboard);
    for (var i = 0; i < cells.length; i++) {
        cells[i].innerText = ''; //clear
        cells[i].style.removeProperty('background-color');
        //add a event process vào click mouse event
        cells[i].addEventListener('click', whosturn, false);
    }
}


function whosturn(grid) {
    if(gameType=="comp"){
        if (typeof startboard[grid.target.id] == 'number') {
            turn(grid.target.id, oPlayer)
            if (!checkTie()) turn(bestmove(), aiPlayer);
        }
    }
    else{
        if (typeof startboard[grid.target.id] == 'number') {
            // console.log("Yo this is human")
          if (currentPlayer === oPlayer) {
            turn(grid.target.id, oPlayer);
            currentPlayer = xPlayer;
          } else {
            turn(grid.target.id, xPlayer);
            currentPlayer = oPlayer;
          }
        
          if (checkWin(startboard, currentPlayer)) {
            gameOver(currentPlayer + " wins!");
          } else if (checkTie()) {
            gameOver("Tie game!");
          }
        }
    }

}


function turn(squareId, objectPlayer) {
    startboard[squareId] = objectPlayer; 
    document.getElementById(squareId).innerText = objectPlayer; 
    moves.push(squareId)
    let gameWon = checkWin(startboard, objectPlayer) 
    if (gameWon) gameOver(gameWon)
}

function checkWin(board, player) {
    let plays = board.reduce((a, e, i) =>
        (e === player) ? a.concat(i) : a, []);
    let gameWon = null;
    for (let [index, win] of winning.entries())
     {
        if (win.every(elem => plays.indexOf(elem) > -1))
        {
            gameWon = { index: index, player: player };
            break;
        }
    }
    return gameWon;
}


function gameOver(gameWon) {
    for (let index of winning[gameWon.index]) {
        document.getElementById(index).style.backgroundColor =
            gameWon.player == oPlayer ? "blue" : "red";
    }
    for (var i = 0; i < cells.length; i++) {
        cells[i].removeEventListener('click', whosturn, false);
    }

    declareWinner(gameWon.player == oPlayer ? "O wins!" : "X won!");
}

function declareWinner(whoWin) {
    document.querySelector(".endgame").style.display = "block";
    document.querySelector(".endgame .text").innerText = whoWin;
}

function emptygrids() {
    return startboard.filter(s => typeof s == 'number');
}

function bestmove() {
    return minimax(startboard, aiPlayer).index;
}

function checkTie() {
    if (emptygrids().length == 0) {
        for (var i = 0; i < cells.length; i++) {
            cells[i].style.backgroundColor = "pink";
            cells[i].removeEventListener('click', whosturn, false);
        }
        declareWinner("Tie Game!")
        return true;
    }
    return false;
}

function minimax(board, player) {
    var availSpots = emptygrids();

    if (checkWin(board, oPlayer)) {
        return { score: -10 }; // O win
    } else if (checkWin(board, aiPlayer)) {
        return { score: 10 }; // X win
    } else if (availSpots.length === 0) {
        return { score: 0 }; // tie
    }
    var moves = [];
    for (var i = 0; i < availSpots.length; i++) {
        var move = {};
        move.index = board[availSpots[i]];
        board[availSpots[i]] = player;

        if (player == aiPlayer) {
            var result = minimax(board, oPlayer);
            move.score = result.score;
        } else {
            var result = minimax(board, aiPlayer);
            move.score = result.score;
        }

        board[availSpots[i]] = move.index;

        moves.push(move);
    }

    var bestMove;
    if (player === aiPlayer) {
        var bestScore = -10000;
        for (var i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i; 
            }
        }
    } else {
        var bestScore = 10000;
        for (var i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    return moves[bestMove];
}

// Replay button
const docStyle = document.documentElement.style
const aElem = document.querySelector('a')
const boundingClientRect = aElem.getBoundingClientRect()

aElem.onmousemove = function (e) {

    const x = e.clientX - boundingClientRect.left
    const y = e.clientY - boundingClientRect.top

    const xc = boundingClientRect.width / 2
    const yc = boundingClientRect.height / 2

    const dx = x - xc
    const dy = y - yc

    docStyle.setProperty('--rx', `${dy / -1}deg`)
    docStyle.setProperty('--ry', `${dx / 10}deg`)
}

aElem.onmouseleave = function (e) {
    docStyle.setProperty('--ty', '0')
    docStyle.setProperty('--rx', '0')
    docStyle.setProperty('--ry', '0')
}

aElem.onmousedown = function (e) {
    docStyle.setProperty('--tz', '-25px')
}

document.body.onmouseup = function (e) {
    docStyle.setProperty('--tz', '-12px')
}

function undo(){
    squareId=moves.pop()
    document.getElementById(squareId).textContent=""
    console.log(squareId)
    startboard[squareId]=parseInt(squareId)
    currentPlayer=currentPlayer=== "O" ? "X":"O"
}
