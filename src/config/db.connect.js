import mongoose from "mongoose";

export const dbConnect = async () => {
  await mongoose.connect(process.env.DATABASE);
  console.log(`The Mongodb database is connected successfully`);
};
