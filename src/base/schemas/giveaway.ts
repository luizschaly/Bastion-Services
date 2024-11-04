import { model, Schema } from "mongoose";

let giveawaySchema = new Schema({
    prize: String,
    duration: Number,
    video: String,
    setWinners: Boolean,
    winners: [String],
    winnersAmount: Number,
    participants: [String],
    ChannelID: String,
    MessageID: String,
    GiveawayID: String,
    GuildID: String,
});

export default model("Giveaway", giveawaySchema);
