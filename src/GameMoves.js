import { playerType } from "./GameDefinitions"

const rowmov = [ -1, 0, 1, 0 ];
const colmov = [ 0, 1, 0, -1 ];

function CheckMovements(move){
    return true;
}

function MoveForward(G, ctx){
    let currentPlayer = ctx.currentPlayer;
    let move = { currentPos: currentPlayer.currentPosition, destination: {} };
    move.destination.row = move.currentPos.row + rowmov[move.currentPos.direction];
    move.destination.rcol = move.currentPos.col + colmov[move.currentPos.direction];
    move.destination.direction = move.currentPos.direction;
    if (CheckMovements(move)){
        currentPlayer.currentPosition = move.destination;
        currentPlayer.turnPlayed++;
    }
}

function MoveBackward(G, ctx){
    let currentPlayer = ctx.currentPlayer;
    let move = { currentPos: currentPlayer.currentPosition, destination: {} };
    move.destination.row = move.currentPos.row - rowmov[move.currentPos.direction];
    move.destination.rcol = move.currentPos.col - colmov[move.currentPos.direction];
    move.destination.direction = move.currentPos.direction;
    if (currentPlayer.playerType !== playerType.zombie && CheckMovements(move)){
        currentPlayer.currentPosition = move.destination;
        currentPlayer.turnPlayed++;
    }
}

function TurnOnTheLeft(G, ctx){
    let currentPlayer = ctx.currentPlayer;
    currentPlayer.currentPosition.direction = (directions.length + (currentPlayer.currentPosition.direction - 1)) % direction.length;
    currentPlayer.turnPlayed++;
}

function TurnOnTheRight(G, ctx){
    let currentPlayer = ctx.currentPlayer;
    currentPlayer.currentPosition.direction = (currentPlayer.currentPosition.direction + 1) % direction.length;
    currentPlayer.turnPlayed++;
}

function Barricade(G, ctx){
    let currentPlayer = ctx.currentPlayer;
    if (currentPlayer.playerType !== playerType.human){
        
        currentPlayer.turnPlayed++;
    }
}

function DestroyBarricade(G, ctx){
    let currentPlayer = ctx.currentPlayer;
    if (currentPlayer.playerType !== playerType.zombie && false){
        
        currentPlayer.turnPlayed++;
    }
}

function Attack(G, ctx){
    let currentPlayer = ctx.currentPlayer;

    currentPlayer.turnPlayed++;
}

function Search(G, ctx){
    let currentPlayer = ctx.currentPlayer;
    if (currentPlayer.playerType !== playerType.human){
        
        currentPlayer.turnPlayed++;
    }
}

module.exports = { Search, Attack, Barricade, TurnOnTheLeft, TurnOnTheRight, MoveBackward, MoveForward, DestroyBarricade };