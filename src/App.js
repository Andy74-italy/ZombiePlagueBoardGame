import { cellStatus, playerType } from "./GameDefinitions"
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
        cells.push(`<td class="cell ${searchBoxClass}" data-id="${id}">${marker}</td>`);
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

      .box {
        border-radius: 15%;
        width: 35px;
        height: 35px;
        color: #fff;
        position: relative;
        line-height: 35px;
      }
      .boxH {
        border: 3px solid #00f;
        background: #09f;
      }
      .boxZ {
        border: 3px solid #f00;
        background: #f60;
      }      
      
      .box.arrow-0Z:after {
        content: " ";
        position: absolute;
        right: 3px;
        top: -10px;
        border-top: none;
        border-right: 15px solid transparent;
        border-left: 15px solid transparent;
        border-bottom: 10px solid #f60;
      }
      .box.arrow-0H:after {
        content: " ";
        position: absolute;
        right: 3px;
        top: -10px;
        border-top: none;
        border-right: 15px solid transparent;
        border-left: 15px solid transparent;
        border-bottom: 10px solid #09f;
      }
      .box.arrow-1Z:after {
        content: " ";
        position: absolute;
        right: -15px;
        top: 3px;
        border-top: 15px solid transparent;
        border-right: none;
        border-left: 15px solid #f60;
        border-bottom: 15px solid transparent;
      }
      .box.arrow-1H:after {
        content: " ";
        position: absolute;
        right: -15px;
        top: 3px;
        border-top: 15px solid transparent;
        border-right: none;
        border-left: 15px solid #09f;
        border-bottom: 15px solid transparent;
      }
      .box.arrow-2Z:after {
        content: " ";
        position: absolute;
        right: 3px;
        bottom: -10px;
        border-top: 10px solid #f60;
        border-right: 15px solid transparent;
        border-left: 15px solid transparent;
        border-bottom: none;
      }
      .box.arrow-2H:after {
        content: " ";
        position: absolute;
        right: 3px;
        bottom: -10px;
        border-top: 10px solid #09f;
        border-right: 15px solid transparent;
        border-left: 15px solid transparent;
        border-bottom: none;
      }
      .box.arrow-3Z:after {
        content: " ";
        position: absolute;
        left: -15px;
        top: 3px;
        border-top: 15px solid transparent;
        border-right: 15px solid #f60;
        border-left: none;
        border-bottom: 15px solid transparent;
      }
      .box.arrow-3H:after {
        content: " ";
        position: absolute;
        left: -15px;
        top: 3px;
        border-top: 15px solid transparent;
        border-right: 15px solid #09f;
        border-left: none;
        border-bottom: 15px solid transparent;
      }

      @-webkit-keyframes blinkZ {  
        0% { background-color: #f90; }
        50% { background-color: #f90; }
        51% { background-color: #f60; }
        100% { background-color: #f60; }
      }
      @-webkit-keyframes blinkH {  
        0% { background-color: #06f; }
        50% { background-color: #06f; }
        51% { background-color: #09f; }
        100% { background-color: #09f; }
      }
      .blinkdivZ {
        background-color: black;
        -webkit-animation-name: blinkZ;  
        -webkit-animation-iteration-count: infinite;  
        -webkit-animation-duration: 1s; 
      }
      .blinkdivH {
        background-color: black;
        -webkit-animation-name: blinkH;
        -webkit-animation-iteration-count: infinite;  
        -webkit-animation-duration: 1s; 
      }

      .searchBox {
        background-color: #FFFF00;
        border-radius: 5px;
        opacity: 0.5;
      }
    </style>
      <table style="border-spacing: 0px">${rows.join('')}</table>
      <p class="winner"></p>
    `;
  }
}

const app = new ZombiePlagueClient();