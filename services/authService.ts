import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET!;

export function generateToken(userId: number) {

  return jwt.sign(
    { id: userId },
    SECRET,
    { expiresIn: "1h" }
  );

}