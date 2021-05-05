import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

//2 types of users
export const USER_TYPES = {
  CONSUMER: "consumer",
  SUPPORT: "support",
};

// defines how a single document will look inside the user collection
const userSchema = new mongoose.Schema(
  {
    //our id is a random string thanks to uuidv4
    _id: {
      type: String,
      default: () => uuidv4().replace(/\-/g, ""),
    },
    firstName: String,
    lastName: String,
    type: String,
  },
  {
    //timestamps add 2 values: createdAt and updatedAt
    timestamps: true,
    //name of the collection in the db
    collection: "users",
  }
);

/**
 *
 * @param {*user firstName} firstName
 * @param {user lastName} lastName
 * @param {type as per the enum above} type
 * @returns static method hooked up to our userSchema that takes the above parameters
 */
userSchema.statics.createUser = async function (firstName, lastName, type) {
  try {
    const user = await this.create({ firstName, lastName, type });
    return user;
  } catch (error) {
    throw error;
  }
};

userSchema.statics.getUserById = async function (id) {
  try {
    //use mongoose findOne methos to find the single user with the id passed in
    const user = await this.findOne({ _id: id });
    if (!user) throw { error: "No user with this id found" };
    return user;
  } catch (error) {
    throw error;
  }
};

userSchema.statics.getAllUsers = async function () {
  try {
    //mongoose method find allows us to retrieve all record of the users
    const users = await this.find();
    return users;
  } catch (error) {
    throw error;
  }
};

userSchema.statics.deleteUserById = async function (id) {
  try {
    const result = await this.remove({ _id: id });
    return result;
  } catch (error) {
    throw error;
  }
};
/**
 * Export our object:
 * User is the name of the model
 * userSchema is the schema associated with the model itself
 */
export default mongoose.model("User", userSchema);
