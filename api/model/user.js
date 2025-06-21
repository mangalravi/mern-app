const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    userType: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("User", userSchema);
