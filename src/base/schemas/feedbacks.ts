import { model, Schema } from "mongoose";

let feedbackSchema = new Schema({
  GuildID: String,
  FeedbackedMembers: [String],
});

export default model("Feedback", feedbackSchema);
