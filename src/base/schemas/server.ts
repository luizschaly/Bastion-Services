import { model, Schema } from "mongoose";


let guildSchema = new Schema({
  GuildID: String,
  LastTicketNum: String,
  AdminRoles: [String],
  SupportRoles: [String],
  CustomerRole: String,
});

export default model("Guild", guildSchema);