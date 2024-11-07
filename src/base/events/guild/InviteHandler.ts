import { EmbedBuilder, Events, GuildMember, Invite, Message } from "discord.js";
import CustomClient from "../../classes/CustomClient";
import Event from "../../classes/Event";
import Colors from "../../enums/Colors";
import Emojis from "../../enums/Emojis";
import inviteSchema from "../../schemas/invite";
import Channels from "../../enums/Channels";
export default class StickyMessageHandler extends Event {
  constructor(client: CustomClient) {
    super(client, {
      name: Events.GuildMemberAdd,
      description: "Member join event",
      once: false,
    });
  }
  async Execute(member: GuildMember): Promise<void> {
    const cachedInvites = this.client.invites.get(member.guild.id)
    setTimeout(async () => {
        const newInvites = await member.guild.invites.fetch();
        const usedInvite = newInvites!.find((invite: Invite) => {
            const cachedInvite = cachedInvites!.get(invite.code);
            return cachedInvite && cachedInvite.uses !== invite.uses;
          });
          const embed = new EmbedBuilder()
          .setTitle(`${member.user.tag} Joined`)
          .setColor(Colors.Invisible)
          if (usedInvite) {
              embed.setFields({name:`${Emojis.BlurpleDot}Invite Code`, value: `${Emojis.BlurpleArrow} ${usedInvite.code}`}, {name:`${Emojis.BlurpleDot}Invited By`, value: `${Emojis.BlurpleArrow} ${usedInvite.inviter?.tag || "Unknown"}`}, {name:`${Emojis.BlurpleDot}Invite Count`, value: `${Emojis.BlurpleArrow} ${usedInvite.uses! + 1}`})
            await inviteSchema.updateOne(
              { GuildID: member.guild.id, InviteCode: usedInvite.code },
              { $inc: { uses: 1 } }
            );
      
            await inviteSchema.create({
              GuildID: member.guild.id,
              InvitedBy: usedInvite.inviter?.id || 'Unknown',
              InviteCode: usedInvite.code,
            });
          } else {
              embed.setDescription("Invite used couldn't be determined.")
          }
          const channel = await member.guild.channels.fetch(Channels.InvitesLogs)
        //@ts-ignore
          channel.send({embeds: [embed]})
          this.client.invites.set(member.guild.id, newInvites!);
    }, 5000);
  }
}
