const mongoose = require("mongoose");
const memberSchema = new mongoose.Schema({
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
        required: true
      },
    role: {
        type: String,
        enum: ['admin', 'member'],
        default: 'member'
    }
});
const Group = new mongoose.Schema({
  groupcode: {
    type: String,
    required: true,
  },
  description:{
    type:String,
    required:true,
  },
  members:{
    type:[memberSchema],
    required:true
  }

}, { timestamps: true });

module.exports = mongoose.model("Group", Group);
