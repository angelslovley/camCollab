const mongoose = require("mongoose");

const Chat = new mongoose.Schema({
   user: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
        required: true
      },
  text:{
    type:String,
    required:true,
  },
  group:{
    type:String,
    required:true
  }

}, { timestamps: true });

module.exports = mongoose.model("Chat", Chat);
