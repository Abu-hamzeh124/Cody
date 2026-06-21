import * as argon2 from "argon2";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";

dotenv.config();

const secret = process.env.ACCESS_SECRET as string;

export async function hashPassword(password: string): Promise<string> {
  try {
    const hashedPassword = await argon2.hash(password);
    return hashedPassword;
  } catch (error) {
    throw new Error("Hashing failed");
  }
}

export function genAccessToken(id: string) {
  try {
    const signedJwt = jwt.sign({ userID: id }, secret, {
      expiresIn: "7d",
    });
    return signedJwt;
  } catch (error) {
    throw error;
  }
}

export function UserAuthentecation(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers["authorization"];
  try {
    if (!auth) {
      res.status(403).send();
    } else {
      const auth1= auth.split(' ')[1];
      const token = jwt.verify(auth1, secret);
      (req as any).user = token;
      next();
    }
  } catch (error) {
    res.status(403).send();
  }
}
