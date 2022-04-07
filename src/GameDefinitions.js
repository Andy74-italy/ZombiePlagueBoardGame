/*********************************************************
 * The cellStatus struct contains the first letter of the 
 * board cell to identify immediate the status and
 * its behavious:
 * 1. an empty cell can be walked by the players
 * 2. an obstacle identify a place where players can't 
 *    walk
 * 3. searchable is a place where players can search for
 *    objects
 * When a player move on an empty cell, the cell change its
 * value with the player identifier
 ***********************************************************/
const cellStatus = {
    empty: "+",
    obstacle: "-",
    searchable: "x"
};

/**************************************************************
 * There's two different type of players, zombies and humans
 * each ones with different caratteristics and behaviours
 **************************************************************/
const playerType = {
    human: 0,
    zombie: 1
};

/*************************************************************
 * This identify the direction where the player are looking.
 * Enumerating the direction have the possibility to index
 * additional array and aceess fast and simply data in the
 * structure. Additional explanation will be provided in the
 * specific part of the code
 *************************************************************/
const directions = {
    north: 0,
    east: 1,
    south: 2,
    west: 3,
    length: 4
};

/**************************************************************
 * It could be useful to have the name of the four directions.
 * Until now, not yet used.
 ***************************************************************/
/*
north: "north",
east: "east",
south: "south",
west: "west"
 */


module.exports = { cellStatus, playerType, directions };