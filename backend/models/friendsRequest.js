import mongoose, { Schema } from "mongoose";

const friendRequestSchema = Schema(
  {
    requestTo: {
      type: Schema.Types.ObjectId,
      ref: "Users"
    },
    requestFrom: {
      type: Schema.Types.ObjectId,
      ref: "Users"
    },
    friend: {
      type: Schema.Types.ObjectId,
      ref: "Users"
    },
    requestStatus: {
      type: String,
      default: "Pending"
    }
  },
  { timestamps: true }
);

const FriendRequest = mongoose.model("FriendRequest", friendRequestSchema);

export default FriendRequest;