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
      name: Events.InviteCreate,
      description: "Invite create event",
      once: false,
    });
  }
  async Execute(invite: Invite): Promise<void> {
    //@ts-ignore
    this.client.invites!.get(invite.guild!.id).set(invite.code, invite.uses!);
    inviteSchema.create({GuildID: invite.guild!.id, InviteCode: invite.code, Uses: invite.uses!, InviteCreator: invite.inviter!.id, RealUses: 0, UsersInvited: []})
  }
}
