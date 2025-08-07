import jwt from "jsonwebtoken";

export const generateAdminToken = (admin) => {
  const payload = {
    id: admin._id,
    email: admin.email,
    role: admin.role,
  };

  const token = jwt.sign(payload, process.env.TOKEN_SECRET, {
    expiresIn: "30days",
  });

  return token;
};
