import { rateLimit } from "express-rate-limit";

export const submitRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
});
