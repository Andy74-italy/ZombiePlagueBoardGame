import { Client } from 'boardgame.io/client';
import { ZombiePlague } from './Game';

class ZombiePlagueClient {
  constructor() {
    this.client = Client({ game: ZombiePlague, numPlayers: 2 });
    this.client.start();
    this.rootElement = document.getElementById("app");
    this.createBoard();
  }

  createBoard() {
    let boardgame = this.client.initialState.G.cells;
    const rows = [];
    for (let i = 0; i < boardgame.length; i++) {
      const cells = [];
      for (let j = 0; j < boardgame[i].length; j++) {
        const id = 3 * i + j;
        cells.push(`<td class="cell" data-id="${id}"></td>`);
      }
      rows.push(`<tr>${cells.join('')}</tr>`);
    }

    this.rootElement.innerHTML = `
    <style>
      .cell {
        border: 1px solid #555;
        width: 41px;
        height: 41px;
        line-height: 50px;
        text-align: center;
      }
    </style>
      <table style="border-spacing: 0px">${rows.join('')}</table>
      <p class="winner"></p>
    `;
  }
}

const app = new ZombiePlagueClient();