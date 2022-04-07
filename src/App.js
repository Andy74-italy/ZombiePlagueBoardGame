import { cellStatus, playerType } from "./GameDefinitions"
import { Client } from 'boardgame.io/client';
import { ZombiePlague } from './Game';

/// Return all human players
function HelperAllPlayer(players){
  return players.humans.concat(players.zombies);
}

class ZombiePlagueClient {
  constructor() {
    this.client = Client({ game: ZombiePlague, numPlayers: 5 });
    this.client.start();
    this.rootElement = document.getElementById("app");
    this.createBoard();
    this.attachListeners();
    this.client.subscribe(state => this.update(state));
  }

  update(state) {
    const players = HelperAllPlayer(state.G.players);
    players.forEach(ply => {
      // Draw each player on the board with the arrow in the direction he is looking
      let htmlElem = this.rootElement.querySelector(`#${ply.name.replace(" ", "\\ ").replace("#", "\\#")}`);
      htmlElem.classList.remove(`arrow-0${ply.name[0]}`);
      htmlElem.classList.remove(`arrow-1${ply.name[0]}`); 
      htmlElem.classList.remove(`arrow-2${ply.name[0]}`); 
      htmlElem.classList.remove(`arrow-3${ply.name[0]}`);
      htmlElem.classList.add(`arrow-${ply.currentPosition.direction}${ply.name[0]}`);
      // The pawn is moved in the new position of the board
      let newParent = this.rootElement.querySelector(`.cell[data-id="${ply.currentPosition.row}-${ply.currentPosition.col}"]`);
      newParent.appendChild(htmlElem);
    });
  }

  /**************************************
   * This draw the board the first time
   **************************************/
  createBoard() {
    let boardgame = this.client.initialState.G.cells;
    let players = HelperAllPlayer(this.client.initialState.G.players);
    const rows = [];
    for (let i = 0; i < boardgame.length; i++) {
      const cells = [];
      for (let j = 0; j < boardgame[i].length; j++) {
        const id = 3 * i + j;
        let marker = "", searchBoxClass = "";
        let pos;
        // If a player is on the specific cell...
        if (pos = players.find(el => el.currentPosition.row == i && el.currentPosition.col == j))
          // He is created as HTML element.
          // The id of the html element that identify the pawn is the name of the player
          // The class starting with "arrow-" identify the direction the player is watching
          // The class with boxH and boxZ identify the pawn kind (human or zombie)
          // The name show into the pawn is the letter Z or H (zombie or human) followed by the player number
          marker = `<div id="${pos.name}" class="box arrow-${pos.currentPosition.direction}${pos.name[0]} box${pos.name[0]}">${pos.name[0] + pos.player.toString()}</div>`;
        // A yellow highlighted box is drawed if the cell is searchable
        if (boardgame[i][j].startsWith(cellStatus.searchable))
          searchBoxClass = "searchBox";
        cells.push(`<td class="cell ${searchBoxClass}" data-id="${i}-${j}">${marker}</td>`);
      }
      rows.push(`<tr>${cells.join('')}</tr>`);
    }

    this.rootElement.innerHTML = `
      <table style="border-spacing: 0px">${rows.join('')}</table>
      <p class="winner"></p>
      <div id="control-panel" style="text-align: center; border-color: red; border-width: 2px; width: 200px; position: fixed; top: 10px; left: 920px; border-style: solid;">
        <br/>
        <div class="controller" id="_MoveForward">forward</div><br/>
        <div class="controller" id="_MoveBackward">backward</div><br/>
        <div class="controller" id="_TurnOnTheLeft">turn left</div><br/>
        <div class="controller" id="_TurnOnTheRight">turn right</div><br/>
        <div class="controller" id="_Search">search</div><br/>
        <div class="controller" id="_Attack">attack</div><br/>
        <div class="controller" id="_Barricade">barricade</div><br/>
        <div class="controller" id="_DestroyBarricade">destroy the barricade</div><br/>
        <br/>
      </div>
      <div id="search_cards_place" style="border-color: green; border-width: 2px; width: 200px; height: 300px; position: fixed; top: 380px; left: 920px; border-style: solid;">
        <br/>
        <div id="Object" style="text-align: center;"></div><br />
        <div id="Description" style="padding: 5px"></div>
      </div>
    `;
  }

  attachListeners() {
    const handleCellClick = event => {
      this.client.moves[event.target.id](this.rootElement);
    };
    
    const cells = this.rootElement.querySelectorAll('.controller');
    cells.forEach(cell => {
      cell.onclick = handleCellClick;
    });
  }
}

const app = new ZombiePlagueClient();