import mongoose from "mongoose";

const blackListTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  blacklistedAt: {
    type: Date,
    default: Date.now,
  },
});

const BlackListToken = mongoose.model("BlackListToken", blackListTokenSchema);

export default BlackListToken;
