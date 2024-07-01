const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  time: { type: Date, required: true },
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

PostSchema.virtual("formattedDateTime").get(function () {
  const dateTime = this.time.toUTCString();
  return dateTime;
});

// Export model
module.exports = mongoose.model("Post", PostSchema);
