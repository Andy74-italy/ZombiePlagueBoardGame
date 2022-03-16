import { cellStatus, playerType, directions } from "./GameDefinitions"

const obstacles = [[1, 6], [3, 1], [3, 8], [4, 1], [4, 3], [4, 4], [4, 5], [5, 1], [5, 5]
              , [6, 1], [6, 4], [6, 5], [6, 8], [6, 9], [7, 1], [7, 5], [7, 8], [7, 9]
              , [0, 12], [0, 18], [0, 19], [1, 19], [5, 13], [5, 14], [6, 12], [6, 13]
              , [6, 14], [6, 16], [6, 17], [6, 18], [7, 12], [7, 13], [7, 18]
              , [8, 1], [8, 2], [8, 8], [8, 9], [9, 1], [9, 5], [10, 8], [10, 9]
              , [11, 8], [13, 8], [14, 8], [15, 2], [15, 3], [15, 4], [15, 8]
              , [8, 12], [9, 14], [9, 15], [9, 16], [9, 17], [9, 18], [10, 18], [11, 10]
              , [11, 15], [11, 16], [11, 18], [12, 14], [12, 15], [12, 16], [12, 17], [12, 18]
              , [13, 11], [13, 12], [13, 14], [13, 18], [14, 11], [14, 14], [14, 18], [15, 18]
              , [16, 2], [16, 3], [16, 4], [16, 8], [17, 2], [17, 3], [17, 4], [17, 8], [17, 9]
              , [18, 2], [18, 3], [18, 4], [18, 9], [19, 2], [19, 4], [19, 9], [21, 6]
                 , [16, 14], [16, 15], [19, 10], [20, 19], [21, 10], [21, 13], [21, 15], [21, 19]];
const searchables = [[4, 2], [8, 18], [10, 10], [11, 14], [19, 3], [16, 18]];
const walls = [[5, 10, "s"]
          , [6, 10, "n"]
          , [9, 7, "e"]
          , [9, 8, "w"]
          , [9, 12, "e"]
          , [9, 13, "w"]
          , [10, 11, "s"]
          , [10, 12, "s"]
          , [11, 11, "n"]
          , [11, 12, "n"]
          , [16, 12, "s"]
             , [17, 12, "n"]];
const barricades = [[5, 11, "s"]
                , [6, 11, "n"]
                , [5, 15, "s"]
                , [6, 15, "n"]
                , [8, 5, "e"]
                , [8, 6, "w"]
                , [12, 7, "e"]
                , [12, 8, "w"]
                , [9, 13, "s"]
                , [10, 13, "nw"]
                , [10, 12, "e"]
                , [16, 10, "s"]
                , [16, 11, "s"]
                , [16, 13, "s"]
                , [16, 16, "s"]
                , [16, 17, "s"]
                , [17, 10, "n"]
                , [17, 11, "n"]
                , [17, 13, "n"]
                , [17, 16, "n"]
                  , [17, 17, "n"]];

function arrayEquals(a, b) {
    return Array.isArray(a) &&
        Array.isArray(b) &&
        a.length === b.length &&
        a.every((val, index) => val === b[index]);
}

function BoardSetup(){
  let board =  Array(24).fill(null).map(() => Array(20).fill(cellStatus.empty + ";[];[]"));

  obstacles.forEach(el => board[el[0]][el[1]] = cellStatus.obstacle + ";[];[]");
  searchables.forEach(el => board[el[0]][el[1]] = cellStatus.searchable + ";[];[]");

  walls.forEach(el => board[el[0]][el[1]] = board[el[0]][el[1]].replace(";[];", ";[" + el[2] + "];"));
  barricades.forEach(el => board[el[0]][el[1]] = board[el[0]][el[1]].replace("];[]", "];[" + el[2] + "0]"));

  return board;
}

function RedrawBoard(){

}

function SetupPlayer(playerNum){
  let players = {
    humans: [],
    zombies: [],
    allPlayers: []
  };
  for (let index = 0; index < playerNum; index++) {
    let player = { 
        name: `Human #${index}`, 
        player: index, 
        playerType: playerType.human, 
        live: true, 
        turnsAvailable: 4, 
        turnPlayed: 0,
        currentPosition: { 
            row: 23, 
            col: Math.round(20 / (playerNum + 1)) + (index * Math.round((20 - playerNum + 1) / playerNum)) - 1, 
            direction: directions.north 
        },
        inventory: []
    };
    players.humans.push(player);
  }
  let positionC = 0, positionR = 0;
  players.humans.forEach(el => { 
      for(let z = 0; z < 4; z++) {
          while (obstacles.find(dt => arrayEquals(dt, [positionR, positionC])) 
            || searchables.find(dt => arrayEquals(dt, [positionR, positionC])))
          {
            positionC++;
            positionR += Math.floor(positionC / 19);
            positionC %= 19;
          }
          let zombie = { 
              name: `Zombie #${el.player}${z}`, 
              player: playerNum++, 
              playerType: playerType.zombie, 
              live: true, 
              turnsAvailable: 2, 
              turnPlayed: 0,
              currentPosition: { 
                  row: 0 + positionR, 
                  col: 0 + positionC++, 
                  direction: directions.south 
              } 
          };
          players.zombies.push(zombie); 
      }
  });

  players.allPlayers = players.humans.concat(players.zombies);
  
  return players;
}

module.exports = { BoardSetup, SetupPlayer };