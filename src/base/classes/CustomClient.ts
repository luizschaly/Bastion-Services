import { Client, Collection, GatewayIntentBits, Invite, Partials } from "discord.js";
import ICustomClient from "../interfaces/ICustomClient";

import IConfig from "../interfaces/IConfig";
import Handler from "./Handler";
import Command from "./Command";
import SubCommand from "./SubCommand";
import { connect } from "mongoose";
import GiveawayManager from "./GiveawayManager";

import InviteManager from "discord-invite";
import InviteMan from "./InviteManager";
import IInviteManager from "../interfaces/IInviteManager";
export default class CustomClient extends Client implements ICustomClient {
  config: IConfig;
  handler: Handler;
  giveawayManager: GiveawayManager;
  commands: Collection<string, Command>;
  subCommands: Collection<string, SubCommand>;
  invitemanager: InviteManager
  invman: IInviteManager
  invites: Collection<string, Collection<string, number>>
  constructor() {
    super({ intents: [Object.keys(GatewayIntentBits) as any], partials: [Object.keys(Partials) as any] });
    this.config = require(`${process.cwd()}/data/config.json`);
    this.handler = new Handler(this);
    this.giveawayManager = new GiveawayManager(this)
    this.commands = new Collection();
    this.subCommands = new Collection();
    this.invitemanager = new InviteManager(this);
    this.invman = new InviteMan(this)
    this.invites = new Collection()
  }
  Init(): void {
    this.LoadHandlers();
    this.login(this.config.token).catch((err) => console.log(err));
    connect(this.config.mongoURI)
      .then(() => console.log("Connected to mongodb"))
      .catch((err) => console.log(err));
    this.giveawayManager.LoadGiveaways()
    this.invman.LoadInvites()
  }
  LoadHandlers(): void {
    this.handler.LoadEvents();
    this.handler.LoadCommands();
  }
}
