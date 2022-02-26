import { INVALID_MOVE } from 'boardgame.io/core';
import { BoardSetup, SetupPlayer } from './GameSetup';
import { Search, Attack, Barricade, TurnOnTheLeft, TurnOnTheRight, MoveBackward, MoveForward, DestroyBarricade } from './GameMoves'
// import defaultExport from './GameDefinitions'
import './GameMoves'

function IsVictory(cells) {
  return false;
}

function IsDraw(cells) {
  return false;
}

export const ZombiePlague = {
    setup: (ctx) => ({ cells: BoardSetup(),
                       players: SetupPlayer(ctx.numPlayers)
                    }),

    minPlayers: 1,
    maxPlayers: 8,

    turn: {
      minMoves: 1,
      maxMoves: 4,
      endIf: (G, ctx) => {
        let plyr = ctx.players[parseInt(ctx.currentPlayer)];
        return plyr.turnPlayed === plyr.turnAvailable;
      },
    },

    moves: { Search, Attack, Barricade, TurnOnTheLeft, TurnOnTheRight, MoveBackward, MoveForward, DestroyBarricade },

    endIf: (G, ctx) => {
      if (IsVictory(G.cells)) {
        return { winner: ctx.currentPlayer };
      }
      if (IsDraw(G.cells)) {
        return { draw: true };
      }
    },
  
    moves: {
      clickCell: (G, ctx, id) => {
        if (G.cells[id] !== null) {
          return INVALID_MOVE;
        }
        G.cells[id] = ctx.currentPlayer;
      },
    },
  };