const cellStatus = {
    empty: "+",
    obstacle: "-",
    searchable: "x"
};

const playerType = {
    human: 0,
    zombie: 1
};

const directions = {
    north: 0,
    east: 1,
    south: 2,
    west: 3,
    length: 4
};
/*
north: "north",
east: "east",
south: "south",
west: "west"
 */


module.exports = { cellStatus, playerType, directions };