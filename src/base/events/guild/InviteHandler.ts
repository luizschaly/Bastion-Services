import { EmbedBuilder, Events, GuildMember, Message } from "discord.js";
import CustomClient from "../../classes/CustomClient";
import Event from "../../classes/Event";
import Colors from "../../enums/Colors";
import Emojis from "../../enums/Emojis";
import inviteSchema from "../../schemas/invite";
export default class StickyMessageHandler extends Event {
  constructor(client: CustomClient) {
    super(client, {
      name: Events.GuildMemberAdd,
      description: "Member join event",
      once: false,
    });
  }
  async Execute(member: GuildMember): Promise<void> {
    const cachedInvites = this.client.invites.get(member.guild.id);
    if (!cachedInvites) return;

    const newInvites = await member.guild.invites.fetch();
    const usedInvite = newInvites.find((invite) => {
      const cachedInvite = cachedInvites.get(invite.code);
      return cachedInvite && cachedInvite.uses !== invite.uses;
    });

    if (usedInvite) {
        const embed = new EmbedBuilder()
        .setTitle(`${member.user.tag} Joined`)
        .setFields({name:`${Emojis.BlurpleDot}Invite Code`, value: `${Emojis.BlurpleArrow} ${usedInvite.code}`}, {name:`${Emojis.BlurpleDot}Invited By`, value: `${Emojis.BlurpleArrow} ${usedInvite.inviter?.tag || "Unknown"}`}, {name:`${Emojis.BlurpleDot}Invite Count`, value: `${Emojis.BlurpleArrow} ${usedInvite.uses! + 1}`})
      
      const usesIncrement = usedInvite.uses! - (cachedInvites.get(usedInvite.code)?.uses || 0);

      await inviteSchema.updateOne(
        { GuildID: member.guild.id, InviteCode: usedInvite.code },
        { $inc: { uses: usesIncrement } }
      );

      await inviteSchema.create({
        GuildID: member.guild.id,
        InvitedBy: usedInvite.inviter?.id || 'Unknown',
        InviteCode: usedInvite.code,
      });
    } else {
      console.log(`${member.user.tag} joined, but the invite used couldn't be determined.`);
    }

    this.client.invites.set(member.guild.id, newInvites);
  }
}
