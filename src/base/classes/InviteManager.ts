import CustomClient from "./CustomClient";
import IInviteManager from "../interfaces/IInviteManager";
import inviteSchema from "../schemas/invite";

const wait = require("timers/promises").setTimeout;
export default class InviteMan implements IInviteManager {
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
          await inviteSchema.create({GuildID: guild.id, InviteCode: invite[1].code, InviteCreator: invite[1].inviterId, Uses: invite[1].uses, RealUses: 0, UsersInvited: []})
        }
      }
      
    });
    console.log("Invites loaded")
  }
}
