import { ChatInputCommandInteraction, EmbedBuilder, Events, GuildMember, Invite, User } from "discord.js";
import CustomClient from "../../classes/CustomClient";
import Event from "../../classes/Event";
import inviteSchema from "../../schemas/invite";
import Channels from "../../enums/Channels";
import Emojis from "../../enums/Emojis";
import Colors from "../../enums/Colors";

export default class MemberLeaveHandler extends Event {
    constructor(client: CustomClient) {
        super(client, {
            //@ts-ignore
            name: "memberLeave",
            description: "Command handler event",
            once: false

        })
    }
    async Execute(member: GuildMember, inviter: User, invite: Invite): Promise<void> {
        const role = member.guild.roles.cache.find(role => role.name === "Verified")
        //@ts-ignore
        const channel = await member.guild.channels.fetch(Channels.InvitesLogs)
        const embed = new EmbedBuilder()
            .setTitle("Member left")
            .setColor(Colors.Invisible)
            .setFields(
                {
                    name: `${Emojis.BlurpleDot}Member Left`,
                    value: `${Emojis.BlurpleArrow} <@${member.id}>`,
                },
                {
                    name: `${Emojis.BlurpleDot}Invited By`,
                    value: `${Emojis.BlurpleArrow} ${inviter.displayName || "Unknown"
                        }`,
                },
                {
                    name: `${Emojis.BlurpleDot}Invite Count`,
                    value: `${Emojis.BlurpleArrow} ${invite!.uses! || "Unknown"}`,
                },
            );
        //@ts-ignore
        if (member.guild.vanityURLCode === inviter) {
            embed.addFields({
                name: `${Emojis.BlurpleDot}Invite Code`,
                value: `${Emojis.BlurpleArrow} ${invite.code}`,
            })
        } else {
            let inviteused
            if (member.roles.cache.has(role!.id)) {
                inviteused = await inviteSchema.findOne({ InviteCode: invite.code, GuildID: member.guild.id })
                if (inviteused?.UsersInvited.length == 1) {
                    inviteused!.UsersInvited = []
                } else {
                    const index = inviteused!.UsersInvited.indexOf(member.id);
                    if (index !== -1) {
                        inviteused?.UsersInvited.splice(index, 1);
                    }
                }
                inviteused!.RealUses!--
                await inviteSchema.updateOne({ InviteCode: invite.code, GuildID: member.guild.id }, inviteused!)
            }
            embed
            .setThumbnail(inviter.avatarURL!())
            .addFields(
                {
                    name: `${Emojis.BlurpleDot} ${inviter.displayName} Real Invites`,
                    value: `${Emojis.BlurpleArrow} ${inviteused?.RealUses}`,
                }, {
                name: `${Emojis.BlurpleDot} ${inviter.displayName} Invites`,
                value: `${Emojis.BlurpleArrow} ${invite.uses}`,
            },
                {
                    name: `${Emojis.BlurpleDot}Invite Code`,
                    value: `${Emojis.BlurpleArrow} ${invite.code}`,
                })
        }
        //@ts-ignore
        channel.send({ embeds: [embed] })

    }

}