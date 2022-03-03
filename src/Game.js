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
    maxPlayers: 6,

    turn: {
      minMoves: 1,
      maxMoves: 4,
      endIf: (G, ctx) => {
        let plyr = ctx.players[parseInt(ctx.currentPlayer)];
        return plyr.turnPlayed === plyr.turnAvailable;
      },
    },

    endIf: (G, ctx) => {
      if (IsVictory(G.cells)) {
        return { winner: ctx.currentPlayer };
      }
      if (IsDraw(G.cells)) {
        return { draw: true };
      }
    },
  
    moves: {
      _MoveForward: MoveForward, 
      _MoveBackward: MoveBackward, 
      _TurnOnTheLeft: TurnOnTheLeft, 
      _TurnOnTheRight: TurnOnTheRight, 
      _Search: Search, 
      _Attack: Attack, 
      _Barricade: Barricade, 
      _DestroyBarricade: DestroyBarricade
      // clickCell: (G, ctx, id) => {
      //   if (G.cells[id] !== null) {
      //     return INVALID_MOVE;
      //   }
      //   G.cells[id] = ctx.currentPlayer;
      // },
    }
  };