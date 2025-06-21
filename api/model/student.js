const mongoose = require("mongoose");
const studentSchema = new mongoose.Schema(
  {
    _id : mongoose.Schema.Types.ObjectId,
    name: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: Number,
      required: true,
    },
   imageUrl: String,
  },
  { timestamps: true }
);
module.exports = mongoose.model("Student", studentSchema);