import { createUser, getUser } from "../db/queries/users.js";
import { Request, Response } from "express";
import { hashPassword, genAccessToken } from "./auth/auth.js";
import Database from "better-sqlite3";
import * as argon from "argon2";
import { z, ZodError } from "zod";
import { db } from "../db/index.js";
import { eq } from "drizzle-orm";
import { users } from "../db/schema.js";

export async function handlerCreateUser(req: Request, res: Response) {
  const parameters = z.object({
    email: z.email(),
    password: z.string().min(8),
  });

  try {
    const parsedReq = parameters.parse(req.body);
    const hashedPassword = await hashPassword(parsedReq.password);
    const [user] = await createUser(parsedReq.email, hashedPassword);
    res.status(201).send({
      accessToken: genAccessToken(user.id, false),
    });
  } catch (error) {
    if (error instanceof Database.SqliteError) {
      res.status(409).send(error.message);
    } else if (error instanceof ZodError) {
      res.status(400).send();
    } else {
      throw error;
    }
  }
}

export async function handlerLogin(req: Request, res: Response) {
  const parameters = z.object({
    email: z.email(),
    password: z.string().min(8),
  });

  try {
    const parsedReq = parameters.parse(req.body);
    const user = await getUser(parsedReq.email);
    if (!user) {
      res.status(404).send("Invalid email");
    } else {
      if (await argon.verify(user.hashedPassword, parsedReq.password)) {
        res.status(200).send({
          accessToken: genAccessToken(user.id, Boolean(user.isAdmin)),
        });
      } else {
        res.status(403).send("Invalid password");
      }
    }
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).send();
    }
    throw error;
  }
}

