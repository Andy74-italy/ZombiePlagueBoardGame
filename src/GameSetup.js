import { cellStatus, playerType, directions } from "./GameDefinitions"

// this code is for load cards dinamically
// const search_cards = [];
// function pad(num, size) {
//   var s = "00" + num;
//   return s.substring(s.length-size);
// }
// function LoadCards(count) {
//   try {
//     import(`${location.protocol + '//' + location.host}/search_cards/sc_${pad(count, 3)}.js`)
//     .then((module) => { debugger;
//       search_cards.push(module.default);
//       module.default.execute();
//       LoadCards(count + 1);
//     });
//   } catch (error) {
//   }
// }
// LoadCards(0);

/*****************************************************************
 * This is the list of the available cards.
 * TODO: In this list is missed the behaviour of the card. Have
 *       to evaluate the system to apply a sort of modificators
 *       for the player turns.
 ****************************************************************/
const search_cards = [{ object: "Kitchen Knife", description: "kills zombies with a 6 (Headshot)." },
                      { object: "Baseball Bat", description: "kills zombies with a 5 or 6 (Body Shot or Headshot)." },
                      { object: "Hockey Stick", description: "kills zombies with a 5 or 6 (Body Shot or Headshot)." },
                      { object: "Chainsaw", description: "kills zombies with a 3,4,5 or 6. If you roll an OOPS when attacking with the Chainsaw you get a wound immediately. Roll a dice; another OOPS and the zombie has you ! Make peace with your god and replace the human token with a zombie. " },
                      { object: "Pistol", description: "shoot up to 5 squares in a straight line. With an OOPS you run out of ammo. The pistol becomes unusable until it is reloaded." },
                      { object: "Shotgun", description: "shoot up to 10 squares in a straight line. With an OOPS you run out of ammo and is used as a baseball bat until reloaded." },
                      { object: "Shotgun", description: "fires up to 5 squares in a straight line and 3 squares to the side (so it also hits adjacent squares). Anything within these 5 squares is within range. Roll a single die for any target hit. Humans can also be hit if they are too close to the target, so be careful. With an OOPS you run out of ammo and is used as a Baseball Bat until it is reloaded .. "},
                      { object: "Double Shotgun", description: "like a Shotgun but ignores the first OOPS fired." },
                      { object: "Ammo", description: "reload a weapon (or eliminate an OOPS result with a firearm). The card can be carried by humans as long as it is not used." },
                      { object: "Med Kit", description: "heals a wound (or nullifies a result when it exits so no roll to see if the human is killed / zombified). The card can be carried by humans until it is used. " },
                      { object: "Energy Drink", description: "grants the human 8 AP for a turn instead of the usual 4 AP. The card must be used at the start of your turn. The card can be carried by humans until it is used . " },
                      { object: "Car Keys", description: "grab them, get in the car and VOILA! You managed to escape! Your human friends weren't fast enough to do this ... But if you're not fast enough your human companion can spend 4 AP by standing near the car door and getting inside it. " },
                      { object: "SURPRISE !!", description: "a Zombie appears near a Research Square (or as close as possible that it can be occupied). This Zombie does NOT count towards the maximum number of zombies on the board. this zombie is killed draws another card. " },
                      { object: "Assaulted by Fear", description: "All zombies have double the AP, but only for their next turn." },
                      { object: "Dead Resident", description: "place an additional zombie in any room in the house that is not occupied by a human. This Zombie does NOT count towards the maximum number of zombies on the board." },
                      { object: "Smash!", description: "The zombie player can destroy one (S) barricade square of his choice immediately. Remove the barricade from the game." },
                      { object: "Lucky Coincidence", description: "the human player can immediately erect a barricade without spending AP. This barricade can be placed anywhere EXCEPT on the garage door." },
                      { object: "Eureka !!", description: "the human player draws two more cards." }
                    ];

/*****************************************************************
 * This arrays contain:
 *  1. The coordinates of the board where obstacles are located
 *     (used to generate the map).
 *  2. The coordinates of the board that identify indoors places
 *     (used to identify if the human player win).
 *  3. The coordinates of the board that identify searchable 
 *     places; the third value identify the humans that have
 *     already search in that position. The value start with 0 
 *     (noone player have search in that position). When a 
 *     player search the place, a bitwise operation with his
 *     player number is made (described in the "CheckSearch"
 *     function of the "GameMoves.js" file).
 *  4. The coordinates of the board with a wall and the direction 
 *     where the wall is located inside the cell. Considering 
 *     that the wall is between two cell, to semplify the search, 
 *     both the cell have to be saved in this list. If a cell
 *     have more that one wall in different directions, the string
 *     will contains the initials of the directions ("ws"
 *     identify two wall on the west and the south directions):
 *  5. Like for the walls, the coordinates for the doors and 
 *     the windows that can be barricade, are included in this
 *     array.
 ****************************************************************/
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
const indoors = [[5, 2], [5, 3], [5, 4], [6, 2], [6, 3], [7, 2], [7, 3], [7, 4], [6, 10], [6, 11], [6, 15]
            , [7, 10], [7, 11], [7, 14], [7, 15], [7, 16], [7, 17], [8, 3], [8, 4], [8, 5], [9, 2], [9, 3]
            , [9, 4], [9, 8], [9, 9], [11, 9], [12, 8], [12, 9], [13, 9], [14, 9], [15, 9], [8, 10], [8, 11]
            , [8, 13], [8, 14], [8, 15], [8, 16], [8, 17], [9, 10], [9, 11], [9, 12], [9, 13], [10, 11]
            , [10, 12], [10, 13], [10, 14], [10, 15], [10, 16], [10, 17], [11, 11], [11, 12], [11, 13]
            , [11, 17], [12, 10], [12, 11], [12, 12], [12, 13], [13, 10], [13, 13], [13, 15], [13, 16]
            , [13, 17], [14, 10], [14, 12], [14, 13], [14, 15], [14, 16], [14, 17], [15, 10], [15, 11]
            , [15, 12], [15, 13], [15, 14], [15, 15], [15, 16], [15, 17], [16, 9], [16, 10], [16, 11]
            , [16, 12], [16, 13], [16, 16], [16, 17]];
const searchables = [[4, 2, 0], [8, 18, 0], [10, 10, 0], [11, 14, 0], [19, 3, 0], [16, 18, 0]];
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

/**************************************************************
 * This function check if two arrays are equals
 *************************************************************/
function arrayEquals(a, b) {
    return Array.isArray(a) &&
        Array.isArray(b) &&
        a.length === b.length &&
        a.every((val, index) => val === b[index]);
}

/*************************************************************
 * This function setup the board.
 * It fill a board of 24x20 cells and initialize with the 
 * string ";[];[]". The format of the content of the cell will 
 * be the follow:
 *    <a>;<b>;<c>
 * where:
 *  <a> identify the content of the cell (empty, obstacle,
 *      searchable or player)
 *  <b> identify an array whith the directions where walls 
 *      are present ("ws" identify two wall on the west and 
 *      the south directions).
 *  <c> Same for the walls, but with the barricable doors 
 *      and windows. The additional element identify if the
 *      barricades is active or not.
 *      n0: the passage is open
 *      n1: the passage is barricade
 *      n0e1: the passage on the north side is open, the 
 *            passage on the east side is barricade
 ************************************************************/
function BoardSetup(){
  let board =  Array(24).fill(null).map(() => Array(20).fill(cellStatus.empty + ";[];[]"));

  obstacles.forEach(el => board[el[0]][el[1]] = cellStatus.obstacle + ";[];[]");
  searchables.forEach(el => board[el[0]][el[1]] = cellStatus.searchable + ";[];[]");

  walls.forEach(el => board[el[0]][el[1]] = board[el[0]][el[1]].replace(";[];", ";[" + el[2] + "];"));
  barricades.forEach(el => board[el[0]][el[1]] = board[el[0]][el[1]].replace("];[]", "];[" + el[2].replace(/./g, '$&0') + "]"));

  return board;
}

/*************************************************************
 * This function setup the players.
 * Players are splitted in two different kind: zombies and 
 * humans.
 * For each human, 4 zombies are placed in the game.
 * Human players start from the bottom of the map, spaced 
 * according to the number of participants; one player in 
 * the center of the map, two 1/3 players, three 1/4 players 
 * and so on, up to a maximum of 6 players.
 * Zombies players start from the top of the map (placed as
 * is, where an empty space is available)
 ************************************************************/
function SetupPlayer(playerNumTot){
  let playerNum = playerNumTot -1;
  let players = {
    humans: [],
    zombies: []
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

  return players;
}

module.exports = { BoardSetup, SetupPlayer, indoors, searchables, search_cards };