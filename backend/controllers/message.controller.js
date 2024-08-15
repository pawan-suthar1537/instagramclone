import { trycatchasyncerror } from "../middlewares/trycatchasync.js";
import CustomError from "../middlewares/customerror.js";
import { Conversation } from "../models/conversation-model.js";
import { Message } from "../models/message-model.js";
import { getreceiversocketid, io } from "../socket/socket.js";

export const sendmessage = trycatchasyncerror(async (req, res, next) => {
  try {
    const senderid = req.user.userid;
    const receiverid = req.params.id;
    const { message } = req.body;

    //! check if ahave any coinversation with  users

    let conversation = await Conversation.findOne({
      particiapants: { $all: [senderid, receiverid] },
    });

    //!if not have conversation then create a new conversation
    if (!conversation) {
      conversation = await Conversation.create({
        particiapants: [senderid, receiverid],
      });
    }

    const newMessage = Message.create({
      senderid,
      receiverid,
      message,
    });

    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }

    await Promise.all([newMessage.save(), conversation.save()]);

    //  send message ovr socketio

    const receiversocketid = getreceiversocketid(receiverid);
    if(receiversocketid){
      io.to(receiversocketid).emit('newmsg',newMessage)
    }

    res.status(200).json({
      success: true,
      message: "Message sent successfully",
      data: newMessage,
    });
  } catch (error) {
    return next(new CustomError(error.message, 500));
  }
});

export const getmessages = trycatchasyncerror(async (req, res, next) => {
  try {
    const senderid = req.user.userid;
    const receiverid = req.params.id;

    const conversation = await Conversation.findOne({
      particiapants: { $all: [senderid, receiverid] },
    });

    if (!conversation) {
      return next(new CustomError("Conversation not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Messages fetched successfully",
      data: conversation.messages,
    });
  } catch (error) {
    return next(new CustomError(error.message, 500));
  }
});
