import type { Request, Response } from "express";
import Admin from "../Models/adminModel.js"
import { comparePassword } from "../utils/passwordUtils.js";
import { generateToken } from "../services/authService.js";

export async function login(req: Request, res: Response) {

  const { username, password } = req.body;

  const user = await Admin.findOne({
    where: { username }
  });

  if (!user) {
    return res.status(401).json({ message: "Usuário inválido" });
  }

  const validPassword = await comparePassword(
    password,
    user.getDataValue("password")
  );

  if (!validPassword) {
    return res.status(401).json({ message: "Senha inválida" });
  }

  const token = generateToken(user.getDataValue("id"));

  return res.json({
    token
  });

}