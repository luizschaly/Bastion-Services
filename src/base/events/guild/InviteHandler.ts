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
    const newInvites = await member.guild.invites.fetch();
    const oldInvites = this.client.invites.get(member.guild.id);
    const invite = newInvites.find((i) => i.uses! > oldInvites!.get(i.code)!);
    const inviter = await this.client.users.fetch(invite!.inviter!.id);
    const channel = await member.guild.channels.fetch(Channels.InvitesLogs)
    const userInvites = await inviteSchema.find({GuildID: member.guild.id, InviteCreator: inviter.id})
    let invNum = 0
    for(const invite of userInvites){
      invNum =+ invite.Uses!
    }
    const embed = new EmbedBuilder()
    .setTitle(`Member Joined`)
    .setColor(Colors.Invisible)
    .setThumbnail(member.displayAvatarURL())
    .setFields(
      {
        name: `${Emojis.BlurpleDot}Member Joined`,
        value: `${Emojis.BlurpleArrow} <@${member.id}>`,
      },
        {
          name: `${Emojis.BlurpleDot}Invite Code`,
          value: `${Emojis.BlurpleArrow} ${invite!.code || "Unknown"}`,
        },
        {
          name: `${Emojis.BlurpleDot}Invited By`,
          value: `${Emojis.BlurpleArrow} ${
            inviter.tag || "Unknown"
          }`,
        },
        {
          name: `${Emojis.BlurpleDot}Invite Count`,
          value: `${Emojis.BlurpleArrow} ${invite!.uses! + 1 || "Unknown"}`,
        },
        {
          name: `${Emojis.BlurpleDot} ${inviter.tag} Invites`,
          value: `${Emojis.BlurpleArrow} ${invNum}`,
        }
      );
    //@ts-ignore
    channel.send({embeds: [embed]})
    if(inviter){
      inviteSchema.updateOne({GuildID: member.guild.id, InviteCode: invite!.code}, {$inc: {Uses: 1}})
    }
    
  }
}
