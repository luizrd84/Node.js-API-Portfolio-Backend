import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET!;

export function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
) {

    console.log("authenticateToken chamado"); // ✅
  const authHeader = req.headers.authorization;

  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.sendStatus(401);
  }

  try {

    const decoded = jwt.verify(token, SECRET);

    (req as any).user = decoded;

    next();

  } catch {

    return res.sendStatus(403);

  }

}