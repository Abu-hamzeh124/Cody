import { rateLimit } from "express-rate-limit";

export const registerRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
});