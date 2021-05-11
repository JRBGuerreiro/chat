import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

export const CHAT_ROOM_TYPES = {
  CONSUMER_TO_CONSUMER: "consumer-to-consumer",
  CONSUMER_TO_SUPPORT: "consumer-to-support",
};

const chatRoomSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => uuidv4().replace(/\-/g, ""),
    },
    userIds: Array, //array of users
    type: String, //type of chatroom as per the object above
    chatInitiator: String, //who initiated the chat?
  },
  {
    timestamps: true,
    collection: "chatrooms",
  }
);

//initiate our chat room
chatRoomSchema.statics.initiateChat = async function (
  userIds,
  type,
  chatInitiator
) {
  try {
    //find all the chatrooms where the below criteria is met
    const availableRoom = await this.findOne({
      userIds: {
        $size: userIds.length,
        $all: [...userIds],
      },
      type,
    });
    //return an existing chatroom if it exists
    if (availableRoom) {
      return {
        isNew: false,
        message: "retrieving an old chat room",
        chatRoomId: availableRoom._doc._id,
        type: availableRoom._doc._type,
      };
    }

    //create a new chat room if the above is false
    const newRoom = await this.create({ userIds, type, chatInitiator });
    return {
      isNew: true,
      message: "creating a new chatroom",
      chatRoomId: newRoom._doc._id,
      type: newRoom._doc.type,
    };
  } catch (error) {
    console.log("error on chat method", error);
    throw error;
  }
};
