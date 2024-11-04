import { model, Schema } from "mongoose";

let productSchema = new Schema({
  GuildID: String,
  ProductName: String,
  ProductDescription: String,
  ProductOptions: Object,
  ProductStatus: String,
  ProductStatusImage: String,
  ProductStock: String,
  MessageID: String,
  ChannelID: String
});

export default model("Product", productSchema);