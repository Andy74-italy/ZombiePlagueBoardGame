import { cellStatus, playerType } from "./GameDefinitions"
import { Client } from 'boardgame.io/client';
import { ZombiePlague } from './Game';

function HelperAllPlayer(players){
  return players.humans.concat(players.zombies);
}

class ZombiePlagueClient {
  constructor() {
    this.client = Client({ game: ZombiePlague, numPlayers: 4 });
    this.client.start();
    this.rootElement = document.getElementById("app");
    this.createBoard();
    this.attachListeners();
    this.client.subscribe(state => this.update(state));
  }

  update(state) {
    const players = HelperAllPlayer(state.G.players);
    players.forEach(ply => {
      let htmlElem = this.rootElement.querySelector(`#${ply.name.replace(" ", "\\ ").replace("#", "\\#")}`);
      htmlElem.classList.remove(`arrow-0${ply.name[0]}`);
      htmlElem.classList.remove(`arrow-1${ply.name[0]}`); 
      htmlElem.classList.remove(`arrow-2${ply.name[0]}`); 
      htmlElem.classList.remove(`arrow-3${ply.name[0]}`);
      htmlElem.classList.add(`arrow-${ply.currentPosition.direction}${ply.name[0]}`);
      let newParent = this.rootElement.querySelector(`.cell[data-id="${ply.currentPosition.row}-${ply.currentPosition.col}"]`);
      newParent.appendChild(htmlElem);
    });
  }

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
        if (pos = players.find(el => el.currentPosition.row == i && el.currentPosition.col == j))
          marker = `<div id="${pos.name}" class="box arrow-${pos.currentPosition.direction}${pos.name[0]} box${pos.name[0]}">${((pos.playerType == playerType.human) ? "H" : "Z") + pos.player.toString()}</div>`;
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