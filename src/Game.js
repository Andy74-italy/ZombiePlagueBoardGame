import { INVALID_MOVE } from 'boardgame.io/core';

const cellStatus = {
  empty: 0,
  obstacle: 1,
  searchable: 2
};
const directions = {
  north: true,
  east: true,
  south: true,
  west: true
};
function BoardSetup(){
  let board =  Array(24).fill(Array(20).fill(cellStatus.empty));
  let obstacles = [[1, 6], [3, 1], [3, 8], [4, 1], [4, 3], [4, 4], [4, 5], [5, 1], [5, 5], [6, 1], [6, 4], [6, 5], [6, 8], [6, 9], [7, 1], [7, 5], [7, 8], [7, 9]
                  , [0, 12], [0, 18], [0, 19], [1, 19], [5, 13], [5, 14], [6, 12], [6, 13], [6, 14], [6, 16], [6, 17], [6, 18], [7, 12], [7, 13], [7, 18]
                  , [8, 1], [8, 2], [8, 8], [8, 9], [9, 1], [9, 5], [10, 8], [10, 9], [11, 8], [13, 8], [14, 8], [15, 2], [15, 3], [15, 4], [15, 8]
                  , [8, 12], [9, 14], [9, 15], [9, 16], [9, 17], [9, 18], [10, 18], [11, 10], [11, 15], [11, 16], [11, 18], [12, 14], [12, 15], [12, 16], [12, 17], [12, 18]
                  , [13, 11], [13, 12], [13, 14], [13, 18], [14, 11], [14, 14], [14, 18], [15, 18]
                  , [16, 2], [16, 3], [16, 4], [16, 8], [17, 2], [17, 3], [17, 4], [17, 8], [17, 9], [18, 2], [18, 3], [18, 4], [18, 9], [19, 2], [19, 4], [19, 9], [21, 6]
                  , [16, 14], [16, 15], [19, 10], [20, 19], [21, 10], [21, 13], [21, 15], [21, 19]];
  let searchables = [[4, 2], [8, 18], [10, 10], [11, 14], [19, 3], [16, 18]];
  let walls = [[5, 10, { north: true, east: true, south: false, west: true }]
              , [6, 10, { north: false, east: true, south: true, west: true }]
              , [9, 7, { north: true, east: false, south: true, west: true }]
              , [9, 8, { north: true, east: true, south: true, west: false }]
              , [9, 12, { north: true, east: false, south: true, west: true }]
              , [9, 13, { north: true, east: true, south: true, west: false }]
              , [10, 11, { north: true, east: true, south: false, west: true }]
              , [10, 12, { north: true, east: true, south: false, west: true }]
              , [11, 11, { north: false, east: true, south: true, west: true }]
              , [11, 12, { north: false, east: true, south: true, west: true }]
              , [16, 12, { north: true, east: true, south: false, west: true }]
              , [17, 12, { north: false, east: true, south: true, west: true }]];
  let barricades = [];
  
  board = cellStatus.obstacle;

  return board;
}

export const ZombiePlague = {
    setup: () => ({ cells: BoardSetup() }),
  
    moves: {
      clickCell: (G, ctx, id) => {
        if (G.cells[id] !== null) {
          return INVALID_MOVE;
        }
        G.cells[id] = ctx.currentPlayer;
      },
    },
  };