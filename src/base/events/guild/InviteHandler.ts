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
      //@ts-ignore
      name: "memberJoin",
      description: "Member join event",
      once: false,
    });
  }
  async Execute(member: GuildMember, inviter: User, invite: Invite): Promise<void> {
    const role = member.guild.roles.cache.find(role => role.name === "Member");
    member.roles.add(role!)
    const channel = await member.guild.channels.fetch(Channels.InvitesLogs)
    let inviteCode
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
          name: `${Emojis.BlurpleDot}Invited By`,
          value: `${Emojis.BlurpleArrow} ${
            inviter.displayName || "Unknown"
          }`,
        },
        {
          name: `${Emojis.BlurpleDot}Invite Count`,
          value: `${Emojis.BlurpleArrow} ${invite!.uses! || "Unknown"}`,
        },
      );
    //@ts-ignore
    if(member.guild.vanityURLCode == inviter){
      inviteCode = member.guild.vanityURLCode
      embed.addFields({
        name: `${Emojis.BlurpleDot}Invite Code`,
        value: `${Emojis.BlurpleArrow} ${inviteCode}`,
      })
    } else {

      let invNum 
      inviteCode = invite.code
      const userInvites = await inviteSchema.find({GuildID: member.guild.id, InviteCreator: inviter.id})
      console.log(userInvites)
    for(const invite of userInvites){
      console.log(invite.Uses)
      invNum =+ invite.Uses!
      console.log("Invnum = " + invNum)
    }
    embed.addFields({
      name: `${Emojis.BlurpleDot} ${inviter.displayName} Invites`,
      value: `${Emojis.BlurpleArrow} ${invNum! + 1}`,
    },
    {
      name: `${Emojis.BlurpleDot}Invite Code`,
      value: `${Emojis.BlurpleArrow} ${inviteCode}`,
    },)
    await inviteSchema.updateOne({GuildID: member.guild.id, InviteCode: invite!.code}, {Uses: invNum! + 1})
    }
    
    //@ts-ignore
    channel.send({embeds: [embed]})
    
  }
}
