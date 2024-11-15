import { EmbedBuilder, Events, GuildMember, Invite, Message, User } from "discord.js";
import CustomClient from "../../classes/CustomClient";
import Event from "../../classes/Event";
import Colors from "../../enums/Colors";
import Emojis from "../../enums/Emojis";
import inviteSchema from "../../schemas/invite";
import Channels from "../../enums/Channels";
export default class StickyMessageHandler extends Event {
  constructor(client: CustomClient) {
    super(client, {
      name: Events.GuildMemberUpdate,
      description: "Guild Member Update event",
      once: false,
    });
  }
  async Execute(oldMember: GuildMember, newMember: GuildMember): Promise<void> {
    if(oldMember.roles.cache.size >= newMember.roles.cache.size) return
    const addedRoles = newMember.roles.cache.filter(role => !oldMember.roles.cache.has(role.id));
    addedRoles.forEach(async role => {
        if(role.name === "Verified"){      
            const userInviteUsed = await inviteSchema.findOne({
                GuildID: oldMember.guild.id,
                UsersInvited: { $in: [newMember.id] }
              });
              if(!userInviteUsed) return
              if(typeof userInviteUsed?.RealUses !== "number"){
                userInviteUsed!.RealUses = 0
              }
            await inviteSchema.updateOne({GuildID: newMember.guild.id, InviteCode: userInviteUsed?.InviteCode!}, {RealUses: userInviteUsed?.RealUses! + 1})
        }    
    })
  }
}
