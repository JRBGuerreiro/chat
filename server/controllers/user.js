import makeValidation from "@withvoid/make-validation";
import UserModel, { USER_TYPES } from "../models/User.js";
export default {
  onGetAllUsers: async (req, res) => {
    try {
      const users = await UserModel.getAllUsers();
      return res.status(200).json({ success: true, users });
    } catch (error) {
      return res.status(500).json({ success: false, error: error });
    }
  },
  onGetUserById: async (req, res) => {
    try {
      const user = await UserModel.getUserById(req.params.id);
      return res.status(200).json({ success: true, user });
    } catch (error) {
      return res.status(500).json({ success: false, error: error });
    }
  },
  onCreateUser: async (req, res) => {
    try {
      //validate user response
      const validation = makeValidation((types) => ({
        //our payload is the body of the request
        payload: req.body,
        //add an object against each key and specify the type
        checks: {
          firstName: { type: types.string },
          lastName: { type: types.string },
          type: { type: types.enum, options: { enum: USER_TYPES } },
        },
      }));
      if (!validation.success) return res.status(400).json(validation);
      //data is valid, destructure the body from the request and pass the values to our UserModel
      const { firstName, lastName, type } = req.body;
      const user = await UserModel.createUser(firstName, lastName, type);
      return res.status(200).json({ success: true, user });
    } catch (error) {
      return res.status(500).json({ success: false, error: error });
    }
  },
  onDeleteUserById: async (req, res) => {
    try {
      const user = await UserModel.deleteUserById(req.params.id);
      return res.status(200).json({
        success: true,
        message: `Deleted account of ${user.deletedCount} user`,
      });
    } catch (error) {
      return res.status(500).json({ success: false, error: error });
    }
  },
};
