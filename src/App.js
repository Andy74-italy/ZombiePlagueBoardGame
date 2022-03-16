import { cellStatus, playerType } from "./GameDefinitions"
import { Client } from 'boardgame.io/client';
import { ZombiePlague } from './Game';

class ZombiePlagueClient {
  constructor() {
    this.client = Client({ game: ZombiePlague, numPlayers: 4 });
    this.client.start();
    this.rootElement = document.getElementById("app");
    this.createBoard();
    this.attachListeners();
  }

  createBoard() {
    let boardgame = this.client.initialState.G.cells;
    let players = this.client.initialState.G.players.allPlayers;
    const rows = [];
    for (let i = 0; i < boardgame.length; i++) {
      const cells = [];
      for (let j = 0; j < boardgame[i].length; j++) {
        const id = 3 * i + j;
        let marker = "", searchBoxClass = "";
        let pos;
        if (pos = players.find(el => el.currentPosition.x == i && el.currentPosition.y == j))
          marker = `<div class="box arrow-${pos.currentPosition.direction}${pos.name[0]} box${pos.name[0]}">${((pos.playerType == playerType.human) ? "H" : "Z") + pos.player.toString()}</div>`;
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
    `;
  }

  attachListeners() {
    const handleCellClick = event => {
      console.dir(this.client.moves);
      // const id = parseInt(event.target.dataset.id);
      // this.client.moves.clickCell(id);
      // console.log("event:");
      // console.dir(event);
      // console.log("event.target:");
      // console.dir(event.target);
      // console.log("event.target.dataset:");
      // console.dir(event.target.dataset);
      // console.log("client.moves:");
      // console.dir(this.client.moves);
      // console.log(`--- event.target.dataset.id: ${event.target.dataset.id}`);
      this.client.moves[event.target.id]();
    };
    
    const cells = this.rootElement.querySelectorAll('.controller');
    cells.forEach(cell => {
      cell.onclick = handleCellClick;
    });
  }
}

const app = new ZombiePlagueClient();