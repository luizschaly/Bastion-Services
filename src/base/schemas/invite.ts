import { model, Schema } from "mongoose";



let inviteSchema = new Schema({
  GuildID: String,
  InviteCreator: String,
  InviteCode: String,
  UsersInvited: [String],
  RealUses: Number,
  Uses: Number
});

export default model("Invite", inviteSchema);
