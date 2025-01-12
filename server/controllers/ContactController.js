import User from "../models/UserModel.js";

export const searchContacts = async (req, res, next) => {
  try {
    const { searchItem } = req.body;
    if (searchItem === undefined || searchItem === null) {
      return res.status(400).send("Search item is required!");
    }
    const sanitizedSearchItem = searchItem.replace(
      /[.&+?^${}()|[\][\\]/g,
      "\\$&"
    );
    const regex = new RegExp(sanitizedSearchItem, "i");
    const contacts = await User.find({
      $and: [{ _id: { $ne: req.userId } }],
      $or: [{ firstName: regex }, { lastName: regex }, { email: regex }],
    });
    return res.status(200).json({ contacts });
  } catch (error) {
    console.log({ error });
    return res.status(500).send("Internal Server Error!");
  }
};
