import { ChatInputCommandInteraction, Events, GuildMember, Invite, User } from "discord.js";
import CustomClient from "../../classes/CustomClient";
import Event from "../../classes/Event";
import inviteSchema from "../../schemas/invite";

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
        if (member.roles.cache.has(role!.id)) {
            const inviteused = await inviteSchema.findOne({ InviteCode: invite.code, GuildID: member.guild.id })
            if (inviteused?.UsersInvited.length == 1) {
                inviteused!.UsersInvited = []
            } else {
                const index = inviteused!.UsersInvited.indexOf(member.id);
                if (index !== -1) {
                    inviteused?.UsersInvited.splice(index, 1);
                }
            }
            inviteused!.RealUses!--
            await inviteSchema.updateOne({InviteCode: invite.code, GuildID: member.guild.id}, inviteused!)
        
        }

    }

}