import * as argon2 from "argon2";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";
import z from "zod";
import { getToken } from "../../db/queries/refreshToken.js";
import Database from "better-sqlite3";
import { getUser } from "../../db/queries/users.js";

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

export function genAccessToken(id: string, isAdmin: boolean) {
  try {
    const signedJwt = jwt.sign({ userID: id, isAdmin: isAdmin }, secret, {
      expiresIn: "7d",
    });
    return signedJwt;
  } catch (error) {
    throw error;
  }
}

export function UserAuthentication(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const auth = req.headers["authorization"];
  try {
    if (!auth) {
      res.status(403).send();
    } else {
      const auth1 = auth.split(" ")[1];
      const token = jwt.verify(auth1, secret);
      (req as any).user = token;
      next();
    }
  } catch (error) {
    res.status(403).send();
  }
}

export async function handlerRefresh(req: Request, res: Response) {
  const parameters = z.object({
    token: z.string(),
  });

  try {
    const parsedReq = parameters.parse(req.body);
    const [token] = await getToken(parsedReq.token);
    if (!token || token.revoked || token.expiresIn < Date.now()) {
      res.status(403).send("Invalid token");
    } else {
      const isAdmin = (await getUser(token.userId)).isAdmin;
      res.status(200).send({
        accessToken: genAccessToken(token.userId, Boolean(isAdmin)),
      });
    }
  } catch (error) {
    if (error instanceof Database.SqliteError) {
      res.status(403).send(error.message);
    }
  }
}

export async function isAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const auth = req.headers["authorization"];
    if (!auth) {
      res.status(403).send();
    } else {
      const token = auth.split(" ")[1];
      const payload = JSON.parse(
        Buffer.from(token.split(".")[1], "base64").toString(),
      );
      if (!payload.isAdmin) {
        res.status(403).send();
      } else {
        next();
      }
    }
  } catch (error) {
    res.status(403).send();
  }
}
