import { Client } from 'boardgame.io/client';
import { ZombiePlague } from './Game';

class ZombiePlagueClient {
  constructor() {
    this.client = Client({ game: ZombiePlague, numPlayers: 4 });
    this.client.start();
  }
}

const app = new ZombiePlagueClient();