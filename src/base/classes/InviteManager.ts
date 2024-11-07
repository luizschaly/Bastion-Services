import CustomClient from "./CustomClient";
import IInviteManager from "../interfaces/IInviteManager";
import inviteSchema from "../schemas/invite";
import { Collection, Invite } from "discord.js";

const wait = require("timers/promises").setTimeout;
export default class InviteManager implements IInviteManager {
  client: CustomClient;
  constructor(client: CustomClient) {
    this.client = client;
  }
  async LoadInvites(): Promise<void> {
    await wait(1000);

    this.client.guilds.cache.forEach(async (guild) => {
      const firstInvites = await guild.invites.fetch();
      for(const invite of firstInvites){
        const inviteObj = await inviteSchema.findOne({GuildID: guild.id, InviteCode:invite[1].code})
        if(!inviteObj){
          await inviteSchema.create({GuildID: guild.id, InviteCode: invite[1].code, InviteCreator: invite[1].inviterId, Uses: invite[1].uses})
        }
      }
      this.client.invites.set(
        guild.id,
        new Collection(
          firstInvites.map((invite) => [invite.code, invite.uses!])
        )
      );
    });
  }
}
