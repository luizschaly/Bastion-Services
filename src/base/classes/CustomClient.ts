import { Client, Collection, GatewayIntentBits, Partials } from "discord.js";
import ICustomClient from "../interfaces/ICustomClient";

import IConfig from "../interfaces/IConfig";
import Handler from "./Handler";
import Command from "./Command";
import SubCommand from "./SubCommand";
import { connect } from "mongoose";
import GiveawayManager from "./GiveawayManager";

export default class CustomClient extends Client implements ICustomClient {
  config: IConfig;
  handler: Handler;
  giveawayManager: GiveawayManager;
  commands: Collection<string, Command>;
  subCommands: Collection<string, SubCommand>;
  constructor() {
    super({ intents: [Object.keys(GatewayIntentBits) as any], partials: [Object.keys(Partials) as any] });
    this.config = require(`${process.cwd()}/data/config.json`);
    this.handler = new Handler(this);
    this.giveawayManager = new GiveawayManager(this)
    this.commands = new Collection();
    this.subCommands = new Collection();
  }
  Init(): void {
    this.LoadHandlers();
    this.login(this.config.token).catch((err) => console.log(err));
    connect(this.config.mongoURI)
      .then(() => console.log("Connected to mongodb"))
      .catch((err) => console.log(err));
    this.giveawayManager.LoadGiveaways()
  }
  LoadHandlers(): void {
    this.handler.LoadEvents();
    this.handler.LoadCommands();
  }
}
