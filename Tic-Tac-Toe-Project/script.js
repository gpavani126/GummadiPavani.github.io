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
    //horizontal
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    //vertical
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    //slant
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
    // // write down the ID of any cell clicked
    // console.log(grid.target.id)
    if(gameType=="comp"){
        if (typeof startboard[grid.target.id] == 'number') { //If the clicked ID is "number", it means that both human and AI have not played in that position. So.....
            // pass in the ID that clicking 
            turn(grid.target.id, oPlayer)
    
            //After the player takes a turn, check to see if there is a tie
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
    startboard[squareId] = objectPlayer; //shows the player who has clicked the cell
    document.getElementById(squareId).innerText = objectPlayer; //put more string in the cell with the ID just called
    moves.push(squareId)
    let gameWon = checkWin(startboard, objectPlayer) //check win
    if (gameWon) gameOver(gameWon)
}

function checkWin(board, player) {
    let plays = board.reduce((a, e, i) =>
        (e === player) ? a.concat(i) : a, []); /* Use the minify method which will go through every element in the board array. And the concat function will not change the current array, but it will return a new array that will contain the values of the arrays passed in.
    // a is the final value to be returned
    // e is the element in the board array we are running through and indexing*/
    let gameWon = null;
    for (let [index, win] of winning.entries())
    /* entries: Returns the enumerable property array of [key, value] pairs with the given object, similar to using the for ... in iteration. */ {
        if (win.every(elem => plays.indexOf(elem) > -1))
        //In essence the every function has the same effect as using a loop to loop through all elements of the array. 
        //The indexOf function will look for an element in the array based on the value of the element, it returns the position (key) of the element if found, and -1 if it is not found.
        {
            //if the player satisfies any array of values in winning
            gameWon = { index: index, player: player };
            break;
        }
    }
    return gameWon;
}

//create highlights all cells that make up a victory and prevents the user from entering any more boxes
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
    //filter every element from the board array
    return startboard.filter(s => typeof s == 'number');
}

function bestmove() {
    // //Find all blank cells and get first element from blank cell. So the AI will always play the first slot
    // return emptygrids()[0];

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
    //  find the indexes of the available spots in the board and set them to a variable called availSpots
    var availSpots = emptygrids();

    // check terminal states
    if (checkWin(board, oPlayer)) {
        return { score: -10 }; // O win
    } else if (checkWin(board, aiPlayer)) {
        return { score: 10 }; // X win
    } else if (availSpots.length === 0) {
        return { score: 0 }; // tie
    }
    // Next, you need to collect the scores from each of the empty spots to evaluate later.
    var moves = [];
    //  Therefore, make an array called moves and loop through empty spots while collecting each move’s index and score in an object called move.
    for (var i = 0; i < availSpots.length; i++) {
        var move = {};
        // Then, set the index number of the empty spot that was stored as a number in the startboard to the index property of the move object
        move.index = board[availSpots[i]];
        // set the empty spot on the newboard to the current player
        board[availSpots[i]] = player;

        // store the object resulted from the minimax function call that includes a score property to the score property of the move object.
        if (player == aiPlayer) {
            var result = minimax(board, oPlayer);
            move.score = result.score;
        } else {
            var result = minimax(board, aiPlayer);
            move.score = result.score;
        }

        board[availSpots[i]] = move.index;

        // minimax reset new board to what it was before and pushes the move object to the moves aray
        moves.push(move);
    }

    // Then, the minimax algorithm needs to evaluate the best move in the moves array
    var bestMove;
    // It should choose the move with the highest score when AI is playing and the move with the lowest score when the human is playing. So...
    if (player === aiPlayer) {
        // If the player is aiPlayer, it sets a variable called bestScore to a very low number and loops through the moves array, 
        var bestScore = -10000;
        for (var i = 0; i < moves.length; i++) {
            // if a move has a higher score than bestScore, the algorithm stores that move
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i; // In case there are moves with similar score, only the first one will be stored.
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

// Replay Tic Tac Toe button
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
