import { BoardSetup, SetupPlayer, indoors, searchables } from './GameSetup';
import { Search, Attack, Barricade, TurnOnTheLeft, TurnOnTheRight, MoveBackward, MoveForward, DestroyBarricade } from './GameMoves'
// import defaultExport from './GameDefinitions'
import './GameMoves'

function IsHumansVictory(zombies) {
  return indoors.every(el => zombies.findIndex(z => z.currentPosition.row == el[0] && z.currentPosition.col == el[1]) == -1 )  // no zombies indoor
          // all entrances barricaded
          && searchables.every(el => el[2] != 0) // all searchables sifted
          && false;
}

function IsZombiesVictory(humans) {
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
        let plyr = G.players.humans[ctx.currentPlayer];
        return plyr.turnPlayed === plyr.turnAvailable;
      },
    },

    endIf: (G, ctx) => {
      if (IsHumansVictory(G.players.zombies) || IsZombiesVictory(G.players.humans)) {
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