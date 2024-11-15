import { model, Schema } from "mongoose";

let cartSchema = new Schema({
  GuildID: String,
  TotalPrice: Number,
  Products: [{Name: String, Api: String, PlanOption: String, PlanOptionPrice: String}],
  UserID: String,
  ChannelID: String
});

export default model("Cart", cartSchema);
