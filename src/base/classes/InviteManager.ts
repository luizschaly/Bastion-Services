import CustomClient from "./CustomClient";
import IInviteManager from "../interfaces/IInviteManager";
import inviteSchema from "../schemas/invite";

export default class InviteManager implements IInviteManager {
    client: CustomClient;
    constructor(client: CustomClient){
        this.client = client
    }
    async LoadInvites(): Promise<void> {
        for (const guild of this.client.guilds.cache.values()) {
            const invites = await guild.invites.fetch();
            this.client.invites.set(guild.id, invites);
      
            for (const invite of invites.values()) {
              const existingInvite = await inviteSchema.findOne({
                GuildID: guild.id,
                InviteCode: invite.code,
              });
      
              if (existingInvite) {
                const useDifference = invite.uses! - (existingInvite.Uses! || 0);
                if (useDifference > 0) {
                  await inviteSchema.updateOne(
                    { GuildID: guild.id, InviteCode: invite.code },
                    { $inc: { uses: useDifference } }
                  );
                }
              } else {
                await inviteSchema.create({
                  GuildID: guild.id,
                  InviteCode: invite.code,
                  InvitedBy: invite.inviter?.id || 'Unknown',
                  Uses: invite.uses,
                });
              }
            }
          }
        console.log("Invites loaded")
    }
}