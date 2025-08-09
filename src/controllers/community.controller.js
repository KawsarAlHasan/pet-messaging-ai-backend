import communityModal from "../models/community.modal";

export const createCommunity = async (req, res) => {
  try {
    const community = await communityModal.create(req.body);
    return res.status(200).json(community);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
