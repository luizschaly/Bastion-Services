import { model, Schema } from "mongoose";



let inviteSchema = new Schema({
  GuildID: String,
  InvitedBy: String,
  InviteCode: String,
  Uses: Number
});

export default model("Invite", inviteSchema);