import { model, Schema } from "mongoose";

let claimSchema = new Schema({
  GuildID: String,
  Claims: Object,
});

export default model("Claim", claimSchema);
