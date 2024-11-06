import { Collection } from "discord.js";
import IConfig from "./IConfig";
import Command from "../classes/Command";
import SubCommand from "../classes/SubCommand";
import { Invite } from "discord.js";

export default interface ICustomClient {
  config: IConfig;
  commands: Collection<string, Command>
  subCommands: Collection<string, SubCommand>
  invites: Collection<string, Collection<string, Invite>>

  Init(): void;
  LoadHandlers(): void
}
