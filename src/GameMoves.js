import { INVALID_MOVE } from 'boardgame.io/core';
import { cellStatus, playerType, directions } from "./GameDefinitions"
import { searchables, search_cards } from './GameSetup';

/************************************************************
 * 
 * Here is the file containing the possible moves that a 
 * player can do during his turn.
 * 
 ***********************************************************/

//#region HELPERS

/**********************************************************
 * This two arrays identify the operation to apply to the 
 * current position of the player (or a simple location)
 * to identify the cell where the player move based on the
 * direction he is looking. 
 * Based on the original direction assigned to the player
 * (the "directions" enumeration in the Definitions file)
 * we understand that, for example, to move throuth the
 * north direction (0) whe have to decrease the actual 
 * row number of 1 (-1) and mantain the position for the
 * column (0).
 * The board is made with the (0, 0) cordinate in the top
 * left corner
 * 
 *      (0, 0)----------------------------(0, 19)
 *        |                                  |
 *        |                                  |
 *        |                                  |
 *        |                 n                |
 *        |                                  |
 *        |             w   +   e            |
 *        |                                  |
 *        |                 s                |
 *        |                                  |
 *        |                                  |
 *        |                                  |
 *        |                                  |
 *     (23, 0)---------------------------(23, 19)
 * 
 **********************************************************/
const rowmov = [ -1, 0, 1, 0 ];
const colmov = [ 0, 1, 0, -1 ];

/***********************************************************
 * The nowall array, is used to identify if there's a wall
 * in the direction the player are trying to go. The logic
 * is the same for the row and col movement, if the player 
 * try to move in the "north direction" (0) the destination
 * cell doesn't have a wall in the south direction.
 * Each cell contains information about the wall in the 
 * specific direction. The name is builded with format
 * "<a>;<b>;<c>", where the <b> represent the walls in the 
 * cell; for example a "we" identify a wall at the north 
 * and the east side of the cell.
 ***********************************************************/
const nowall = [ "s", "w", "n", "e" ];

/*************************************************************
 * This function launch a specific number of dice, returning
 * an array with the desired result of the roll.
 *************************************************************/
function RollDices(dicesNumber, facesNumber) {
    return Array.from({ length: dicesNumber }, (_, idx) => Math.floor(Math.random() * facesNumber) + 1);
}

/*******************************************************************
 * This function return the next cell where the player are looking
 * or behind him if invert is true
 *******************************************************************/
function playerDestination(player, direction = player.currentPosition.direction, invert = false){
    return { 
        row: player.currentPosition.row + (rowmov[direction] * (invert ? -1 : 1)),
        col: player.currentPosition.col + (colmov[direction] * (invert ? -1 : 1)),
        direction
    }
}

/*******************************************************************
 * This function update the cells of the board after a forward or
 * backward movement
 *******************************************************************/
 function cellMovementUpdate(G, ctx, currentPlayer, move){
    // Get the original cell value...
    let restore = G.cells[currentPlayer.currentPosition.row][currentPlayer.currentPosition.col].split(';');
    // ...restore the cell with the empty value (the cell had to be empty originally for the player to occupy it).
    G.cells[currentPlayer.currentPosition.row][currentPlayer.currentPosition.col] = 
        "".concat(cellStatus.empty, ";", restore[1], ";", restore[2]);
    // Make the same for the new player position...
    restore = G.cells[move.destination.row][move.destination.col].split(';');
    // ...positioning inside the pawn identifier.
    G.cells[move.destination.row][move.destination.col] = 
        "".concat(currentPlayer.name, ";", restore[1], ";", restore[2]);
    // Update the position of the player and the number of turn played.
    G.players.humans[ctx.currentPlayer].currentPosition = move.destination;
    G.players.humans[ctx.currentPlayer].turnPlayed++;
    return;
}

/***********************************************
 * This function check if two position coincide
 ***********************************************/
 function checkPositions(pos1, pos2){
    return pos1.row == pos2.row && pos1.col == pos2.col;
}

/*******************************************************************
 * This function return the status of the cell. Te possible values
 * can be:
 *  1. an obstacle
 *  2. a searchable place
 *  3. a player
 *  4. empty
 *******************************************************************/
 function checkCell(board, players, position){
    let valueCheck = board[position.row][position.col].split(';');
    if (valueCheck[0] == cellStatus.obstacle || valueCheck[0] == cellStatus.searchable)
        return valueCheck[0];
    // TODO: verify that the cell have the information of the player pawn, probably the find of the player
    // located on the cell is not needs.
    return players.humans.concat(players.zombies).find(el => checkPositions(el.currentPosition, position)) || cellStatus.empty;
}

/*******************************************************************
 * This function verify the possibility for the player to move in 
 * the specific cell. The possibility to move in the cell is made
 * by its status (it must to be empty) and by the fact that there
 * are no walls or barricades between.
 *******************************************************************/
 function CheckMovements(board, move){
    let valueCheck = board[move.destination.row][move.destination.col].split(';');
    // TODO: verify that the cell is not ocuupied by another player
    if (valueCheck[0] == cellStatus.empty // cell is free
        && !valueCheck[1].includes(nowall[move.currentPos.direction]) // no wall in that direction
        && !valueCheck[2].includes(nowall[move.currentPos.direction]+"1")) // no active baricade
        return true;

    return false;
}

/********************************************************************
 * This function checks whether a human player (already verified externally to this function) can actually search the cell in front of him.
 * The conditions for which a search can be made are:
 *  1. The cell is a search in which you can search
 *  2. The player has never searched this cell
 * (Each player can research the same location no more than once).
 ********************************************************************/
 function CheckSearch(player, cells){
     // retrieve the cell of the board in front of the player
    let currentPos = Object.assign({}, player.currentPosition);
    currentPos.row += rowmov[currentPos.direction];
    currentPos.col += colmov[currentPos.direction];
    // check if the cell is a searchable cell
    if (cells[currentPos.row][currentPos.col].startsWith(cellStatus.searchable))
    {
        // in that case check if the user have already search in this specific location
        // To keep track of each player's search, I refer to the third value of the searchable locations array, 
        // which is initially 0 and I perform a bitwise operation with the current player's location.
        // Player one, therefore, will have the least significant bit, while the last one will have the most
        // significant bit.
        // pl4 pl3 pl2 pl1
        //  0   0   0   0
        // a zero value will identify that no player has searched that cell
        // pl4 pl3 pl2 pl1
        //  0   1   0   0
        // a value of four will indicate that player three has already searched that cell and can no longer do so
        // pl4 pl3 pl2 pl1
        //  0   1   1   0
        // the value six will indicate that the players who have already searched in this cell are number two 
        // and number three
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

//#endregion

//#region ACTION IMPLEMENTATION

/********************************************************************
 * This is the real action of the attack.
 * Difference between Human and zombie attack is the follow:
 *  Zombies: Rolls two dice, if the value of the two data coincides, 
 *           the attack was successful. In this case, if possible, 
 *           the human player moves one square behind the direction 
 *           of the attack. A second roll with a single die will mark 
 *           the fate of the human player. If the die value is 1 the 
 *           human player is zombified.
 *  Humans: Only one die is rolled.
 *          The value effect may vary from the weapons you are using
 *          (refer to item modifiers).
 *              1) Failed attack or out of ammunition; the player 
 *                 ends the turn.
 *              2, 3 and 4) Missed target.
 *              5) Blow to the body; The zombie is pushed back one
 *                 square in the direction of the attack, if there
 *                 are other zombies they suffer the same movement
 *                 unless there are obstacles. No damage to the zombie.
 *              6) Headshot: the zombie dies.
 *          The number of cells the weapon manages to hit is defined 
 *          by the weapon itself, in the absence of this information 
 *          the attack is on the adjacent cell. If you don't have any
 *          weapon and the result is 5 or 6, you roll again; if the 
 *          result of the second roll is equal to that of the first, 
 *          the result of the normal attack is performed, otherwise 
 *          it is considered as a miss.
 ********************************************************************/
function PlayerAttack(player, board, players){
    if (player.playerType == playerType.human){
        let dice = RollDices(1, 6)[0];
        switch (dice) {
            case 1:
                
                break;
            case 2:
            case 3:
            case 4:

                break;
            case 5:
                
                break;
            case 6:
                
                break;
            default:
                break;
        }
    } else if (player.playerType == playerType.zombie){
        let dices = RollDices(2, 6);
        if (dices[0] == dices[1]){
            let destination = playerDestination(player);
            let chkcell = checkCell(board, players, destination)
            if (chkcell.playerType && chkcell.playerType == 0){
                let newplayerPosition = playerDestination(chkcell, player.currentPosition.direction);
                chkcell.currentPosition.row = newplayerPosition.row;
                chkcell.currentPosition.col = newplayerPosition.col;
                let dice = RollDices(1, 6)[0];
                if (dice == 0)
                    chkcell.live = false;
            }
        }
    }
}

//#endregion

//#region ACTIONS

/*********************************************************************
 *       ╔╦╗╔═╗╦  ╦╔═╗  ╔═╗╔═╗╦═╗╦ ╦╔═╗╦═╗╔╦╗  ╔═╗╔═╗╔╦╗╦╔═╗╔╗╔
 *       ║║║║ ║╚╗╔╝║╣   ╠╣ ║ ║╠╦╝║║║╠═╣╠╦╝ ║║  ╠═╣║   ║ ║║ ║║║║
 *       ╩ ╩╚═╝ ╚╝ ╚═╝  ╚  ╚═╝╩╚═╚╩╝╩ ╩╩╚══╩╝  ╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝
 * ------------------------------------------------------------------
 * This move moves the player one square in the direction they are 
 * looking at if it is not already occupied or if nothing prevents 
 * movement (such as walls or barricades).
 *********************************************************************/
function MoveForward(G, ctx){
    // Get the cell in front of the player
    let currentPlayer = G.players.humans[ctx.currentPlayer];
    let move = { currentPos: currentPlayer.currentPosition, destination: playerDestination(currentPlayer) };
    // If nothing prevents movement...
    if (CheckMovements(G.cells, move)){
        // ...update the board.
        cellMovementUpdate(G, ctx, currentPlayer, move);
        return;
    }
    return INVALID_MOVE;
}

/*********************************************************************
 *     ╔╦╗╔═╗╦  ╦╔═╗  ╔╗ ╔═╗╔═╗╦╔═╦ ╦╔═╗╦═╗╔╦╗  ╔═╗╔═╗╔╦╗╦╔═╗╔╗╔
 *     ║║║║ ║╚╗╔╝║╣   ╠╩╗╠═╣║  ╠╩╗║║║╠═╣╠╦╝ ║║  ╠═╣║   ║ ║║ ║║║║
 *     ╩ ╩╚═╝ ╚╝ ╚═╝  ╚═╝╩ ╩╚═╝╩ ╩╚╩╝╩ ╩╩╚══╩╝  ╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝
 * ------------------------------------------------------------------
 * This move moves the player one square in the opposite direction 
 * they are looking at if it is not already occupied or if nothing 
 * prevents movement (such as walls or barricades). This movement
 * is available only for the humans players, zombies cannot move
 * backward.
 *********************************************************************/
 function MoveBackward(G, ctx){
    // Check immediate if the player is human or zombie
    let currentPlayer = G.players.humans[ctx.currentPlayer];
    if (currentPlayer.playerType == playerType.zombie)
        return INVALID_MOVE;
    // As for the move forward, the concept of the advanced cell work if instead add
    // the rowmov or colmov value, it's removed.
    let move = { currentPos: currentPlayer.currentPosition, destination: playerDestination(currentPlayer, undefined, true) };
    // Check if is possible to move in that direction... 
    if (CheckMovements(G.cells, move)){
        // ...update the board.
        cellMovementUpdate(G, ctx, currentPlayer, move);
        return;
    }
    return INVALID_MOVE;
}

/*********************************************************************
 *         ╔╦╗╦ ╦╦═╗╔╗╔  ╦  ╔═╗╔═╗╔╦╗  ╔═╗╔═╗╔╦╗╦╔═╗╔╗╔
 *          ║ ║ ║╠╦╝║║║  ║  ║╣ ╠╣  ║   ╠═╣║   ║ ║║ ║║║║
 *          ╩ ╚═╝╩╚═╝╚╝  ╩═╝╚═╝╚   ╩   ╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝
 * ------------------------------------------------------------------
 * This action rotate the player 90 degrees counterclockwise
 *********************************************************************/
function TurnOnTheLeft(G, ctx){
    let currentPlayer = G.players.humans[ctx.currentPlayer];
    currentPlayer.currentPosition.direction = (directions.length + (currentPlayer.currentPosition.direction - 1)) % directions.length;
    currentPlayer.turnPlayed++;
}

/*********************************************************************
 *          ╔╦╗╦ ╦╦═╗╔╗╔  ╦═╗╦╔═╗╦ ╦╔╦╗  ╔═╗╔═╗╔╦╗╦╔═╗╔╗╔
 *           ║ ║ ║╠╦╝║║║  ╠╦╝║║ ╦╠═╣ ║   ╠═╣║   ║ ║║ ║║║║
 *           ╩ ╚═╝╩╚═╝╚╝  ╩╚═╩╚═╝╩ ╩ ╩   ╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝
 * ------------------------------------------------------------------
 * This action rotate the player 90 degrees clockwise
 *********************************************************************/
function TurnOnTheRight(G, ctx){
    let currentPlayer = G.players.humans[ctx.currentPlayer];
    currentPlayer.currentPosition.direction = (currentPlayer.currentPosition.direction + 1) % directions.length;
    currentPlayer.turnPlayed++;
}

/*********************************************************************
 *           ╔╗ ╔═╗╦═╗╦═╗╦╔═╗╔═╗╔╦╗╔═╗  ╔═╗╔═╗╔╦╗╦╔═╗╔╗╔
 *           ╠╩╗╠═╣╠╦╝╠╦╝║║  ╠═╣ ║║║╣   ╠═╣║   ║ ║║ ║║║║
 *           ╚═╝╩ ╩╩╚═╩╚═╩╚═╝╩ ╩═╩╝╚═╝  ╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝
 * ------------------------------------------------------------------
 * If the human player is in front of a door or a window, he can 
 * barricade it, in order to prevent zombies from entering.
 * TODO: finish to implement
 *********************************************************************/
 function Barricade(G, ctx){
    let currentPlayer = G.players.humans[ctx.currentPlayer];
    if (currentPlayer.playerType !== playerType.human && CheckMovements(G.cells, move)){
        // modify the state of the barricade
        currentPlayer.turnPlayed++;
        return;
    }
    return INVALID_MOVE;
}

/*********************************************************************
 * ╔╦╗╔═╗╔═╗╔╦╗╦═╗╔═╗╦ ╦  ╔╗ ╔═╗╦═╗╦═╗╦╔═╗╔═╗╔╦╗╔═╗  ╔═╗╔═╗╔╦╗╦╔═╗╔╗╔
 *  ║║║╣ ╚═╗ ║ ╠╦╝║ ║╚╦╝  ╠╩╗╠═╣╠╦╝╠╦╝║║  ╠═╣ ║║║╣   ╠═╣║   ║ ║║ ║║║║
 * ═╩╝╚═╝╚═╝ ╩ ╩╚═╚═╝ ╩   ╚═╝╩ ╩╩╚═╩╚═╩╚═╝╩ ╩═╩╝╚═╝  ╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝
 * ------------------------------------------------------------------
 * Four zombies in line that look at the same direction with the
 * first in line in front of an active barricade (looking it), can
 * destroy the barricade.
 * TODO: finish to implement
 *********************************************************************/
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

/*********************************************************************
 *              ╔═╗╔╦╗╔╦╗╔═╗╔═╗╦╔═  ╔═╗╔═╗╔╦╗╦╔═╗╔╗╔
 *              ╠═╣ ║  ║ ╠═╣║  ╠╩╗  ╠═╣║   ║ ║║ ║║║║
 *              ╩ ╩ ╩  ╩ ╩ ╩╚═╝╩ ╩  ╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝
 * ------------------------------------------------------------------
 * All player can attack, regardless of the result, the attack costs 
 * one turn.
 *********************************************************************/
 function Attack(G, ctx){
    let currentPlayer = G.players.humans[ctx.currentPlayer];
    PlayerAttack(currentPlayer, G.cells, G.players);
    currentPlayer.turnPlayed++;
}

/*********************************************************************
 *             ╔═╗╔═╗╔═╗╦═╗╔═╗╦ ╦  ╔═╗╔═╗╔╦╗╦╔═╗╔╗╔
 *             ╚═╗║╣ ╠═╣╠╦╝║  ╠═╣  ╠═╣║   ║ ║║ ║║║║
 *             ╚═╝╚═╝╩ ╩╩╚═╚═╝╩ ╩  ╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝
 * ------------------------------------------------------------------
 * The humans players can search object in the place identified as 
 * searchable. 
 * TODO: finish to implement
 *********************************************************************/
 function Search(G, ctx, dom){
    let currentPlayer = G.players.humans[ctx.currentPlayer];
    // if the player is human and the cell in front of him is searchable...
    if (currentPlayer.playerType === playerType.human && CheckSearch(currentPlayer, G.cells)){
        // ...flip a card.
        let sc = search_cards[Math.floor(Math.random() * search_cards.length)];
        dom.ownerDocument.getElementById("Object").innerText = sc.object;
        dom.ownerDocument.getElementById("Description").innerText = sc.description;
        currentPlayer.turnPlayed++;
        return;
    }
    return INVALID_MOVE;
}

//#endregion

module.exports = { Search, Attack, Barricade, TurnOnTheLeft, TurnOnTheRight, MoveBackward, MoveForward, DestroyBarricade };