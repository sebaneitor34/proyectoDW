import mongoose from "mongoose";

const receiptSchema = new mongoose.Schema({
  relations: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CartRelation",
    },
  ],
  total: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const receiptModel = mongoose.model("receipt", receiptSchema);

export default receiptModel;
