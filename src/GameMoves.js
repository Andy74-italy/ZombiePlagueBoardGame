import { INVALID_MOVE } from 'boardgame.io/core';
import { cellStatus, playerType, directions } from "./GameDefinitions"
import { searchables, search_cards } from './GameSetup';

const rowmov = [ -1, 0, 1, 0 ];
const colmov = [ 0, 1, 0, -1 ];
const nowall = [ "s", "w", "n", "e" ];

function CheckMovements(board, move){
    let valueCheck = board[move.destination.row][move.destination.col].split(';');
    if (board[move.destination.row][move.destination.col].startsWith(cellStatus.empty) // cell is free
        && !valueCheck[1].includes(nowall[move.currentPos.direction]) // no wall in that direction
        && !valueCheck[2].includes(nowall[move.currentPos.direction]+"1")) // no active baricade
        return true;

    return false;
}

function PlayerAttack(player){
    if (player.playerType == playerType.human){

    } else if (player.playerType == playerType.zombie){
        
    }
}

function CheckSearch(player, cells){
    let currentPos = Object.assign({}, player.currentPosition);
    currentPos.row += rowmov[currentPos.direction];
    currentPos.col += colmov[currentPos.direction];
    if (cells[currentPos.row][currentPos.col].startsWith(cellStatus.searchable))
    {
        let src = searchables.find(el => el[0] == currentPos.row && el[1] == currentPos.col);
        const plp = (2 ** player.player);
        if ((src[2] & plp) != plp) {
            src[2] |= plp;
            return true;
        }
        return false;
    }
    return false;
}

function MoveForward(G, ctx){
    let currentPlayer = G.players.humans[ctx.currentPlayer];
    let move = { currentPos: currentPlayer.currentPosition, destination: {} };
    move.destination.row = move.currentPos.row + rowmov[move.currentPos.direction];
    move.destination.col = move.currentPos.col + colmov[move.currentPos.direction];
    move.destination.direction = move.currentPos.direction;
    if (CheckMovements(G.cells, move)){
        let restore = G.cells[currentPlayer.currentPosition.row][currentPlayer.currentPosition.col].split(';');
        G.cells[currentPlayer.currentPosition.row][currentPlayer.currentPosition.col] = 
            "".concat(cellStatus.empty, ";", restore[1], ";", restore[2]);
        restore = G.cells[move.destination.row][move.destination.col].split(';');
        G.cells[move.destination.row][move.destination.col] = 
            "".concat(currentPlayer.name, ";", restore[1], ";", restore[2]);
        G.players.humans[ctx.currentPlayer].currentPosition = move.destination;
        G.players.humans[ctx.currentPlayer].turnPlayed++;
        return;
    }
    return INVALID_MOVE;
}

function MoveBackward(G, ctx){
    let currentPlayer = G.players.humans[ctx.currentPlayer];
    if (currentPlayer.playerType == playerType.zombie)
        return INVALID_MOVE;
    let move = { currentPos: currentPlayer.currentPosition, destination: {} };
    move.destination.row = move.currentPos.row - rowmov[move.currentPos.direction];
    move.destination.col = move.currentPos.col - colmov[move.currentPos.direction];
    move.destination.direction = move.currentPos.direction;
    if (currentPlayer.playerType !== playerType.zombie && CheckMovements(G.cells, move)){
        G.players.humans[ctx.currentPlayer].currentPosition = move.destination;
        G.players.humans[ctx.currentPlayer].turnPlayed++;
        return;
    }
    return INVALID_MOVE;
}

function TurnOnTheLeft(G, ctx){
    let currentPlayer = G.players.humans[ctx.currentPlayer];
    currentPlayer.currentPosition.direction = (directions.length + (currentPlayer.currentPosition.direction - 1)) % directions.length;
    currentPlayer.turnPlayed++;
}

function TurnOnTheRight(G, ctx){
    let currentPlayer = G.players.humans[ctx.currentPlayer];
    currentPlayer.currentPosition.direction = (currentPlayer.currentPosition.direction + 1) % directions.length;
    currentPlayer.turnPlayed++;
}

function Barricade(G, ctx){
    let currentPlayer = G.players.humans[ctx.currentPlayer];
    if (currentPlayer.playerType !== playerType.human && CheckMovements(G.cells, move)){
        // modify the state of the barricade
        currentPlayer.turnPlayed++;
        return;
    }
    return INVALID_MOVE;
}

function DestroyBarricade(G, ctx){
    let currentPlayer = G.players.humans[ctx.currentPlayer];
    // check 4 zombie in front of the barricade
    if (currentPlayer.playerType !== playerType.zombie && false){
        // modify the state of the barricade
        currentPlayer.turnPlayed++;
        return;
    }
    return INVALID_MOVE;
}

function Attack(G, ctx){
    let currentPlayer = G.players.humans[ctx.currentPlayer];
    PlayerAttack(currentPlayer);
    currentPlayer.turnPlayed++;
}

function Search(G, ctx, dom){
    let currentPlayer = G.players.humans[ctx.currentPlayer];
    if (currentPlayer.playerType === playerType.human && CheckSearch(currentPlayer, G.cells)){
        // turn a card
        let sc = search_cards[Math.floor(Math.random() * search_cards.length)];
        dom.ownerDocument.getElementById("Object").innerText = sc.object;
        dom.ownerDocument.getElementById("Description").innerText = sc.description;
        currentPlayer.turnPlayed++;
        return;
    }
    return INVALID_MOVE;
}

module.exports = { Search, Attack, Barricade, TurnOnTheLeft, TurnOnTheRight, MoveBackward, MoveForward, DestroyBarricade };