import { model, Schema } from "mongoose";

let cartSchema = new Schema({
  GuildID: String,
  TotalPrice: Number,
  Products: [{Name: String, Api: String}],
  UserID: String
});

export default model("Cart", cartSchema);
