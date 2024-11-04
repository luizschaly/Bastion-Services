import { model, Schema } from "mongoose";


let ticketSchema = new Schema({
  GuildID: String,
  UserID: String,
  ChannelID: String,
  TicketNum: String,
  TicketType: String
});

export default model("Ticket", ticketSchema);

