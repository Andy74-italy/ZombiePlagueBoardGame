import { BoardSetup, SetupPlayer, indoors, searchables } from './GameSetup';
import { Search, Attack, Barricade, TurnOnTheLeft, TurnOnTheRight, MoveBackward, MoveForward, DestroyBarricade } from './GameMoves'
import './GameMoves'

/************************************************************************
 * The human victory is attributed if:
 * 1. there are no zombies into the house and the garage
 * 2. all the entrance are barricades
 * 3. and all the searchable place are sifted
 *************************************************************/
function IsHumansVictory(zombies) {
         // no zombies indoor: search for zombie with position in one of the indoor cells
  return indoors.every(el => zombies.findIndex(z => z.currentPosition.row == el[0] && z.currentPosition.col == el[1]) == -1 ) 
          /// TODO: all entrances barricaded
          ///       all searchables sifted: the third element of the array for the searchables cells is 0 if noone have search on it
          && searchables.every(el => el[2] != 0) 
          && false;
}

/**************************************
 * Zombies win if all humans are dead
 **************************************/
function IsZombiesVictory(humans) {
  return humans.every(el => !el.live);
}

/******************************************************
 * There's no possibility that the game finish in draw
 ******************************************************/
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
      endIf: (G, ctx) => { debugger;
        // is not launched when a player finish his turns 
        // ??????????????????????????
        let plyr = G.players.humans[ctx.currentPlayer];
        return plyr.turnPlayed === plyr.turnAvailable || !plyr.live || ctx.currentPlayer >= ctx.numPlayers - 1;
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