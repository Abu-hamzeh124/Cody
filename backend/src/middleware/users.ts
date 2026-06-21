import { createUser, getUser } from "../db/queries/users.js";
import { Request, Response } from "express";
import { hashPassword, genAccessToken } from "./auth.js";
import Database from "better-sqlite3";
import * as argon from "argon2";

export async function handlerCreateUser(req: Request, res: Response) {
  type parameters = {
    email: string;
    password: string;
  };

  try {
    const parsedReq: parameters = req.body;
    if (
      !parsedReq.email ||
      typeof parsedReq.email !== "string" ||
      !parsedReq.password ||
      typeof parsedReq.password !== "string"
    ) {
      res.status(400).send("Invalid email or password");
    } else {
      const hashedPassword = await hashPassword(parsedReq.password);
      const [user] = await createUser(parsedReq.email, hashedPassword);
      res.status(201).send({
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });
    }
  } catch (error) {
    if (error instanceof Database.SqliteError) {
      res.status(409).send(error.message);
    } else {
      throw error;
    }
  }
}

export async function handlerLogin(req: Request, res: Response) {
  type parameters = {
    email: string;
    password: string;
  };

  try {
    const parsedReq: parameters = req.body;
    if (!parsedReq.email || !parsedReq.password) {
      res.status(401).send("Invalid emai or password");
    } else {
      const user = await getUser(parsedReq.email);
      if (!user) {
        res.status(404).send("Invalid email");
      } else {
        if (await argon.verify(user.hashedPassword, parsedReq.password)) {
          res.status(200).send({
            id: user.id,
            accessToken: genAccessToken(user.id),
          });
        } else {
          res.status(403).send("Invalid password");
        }
      }
    }
  } catch (error) {
    res.status(500).send("Internal server error");
  }
}
