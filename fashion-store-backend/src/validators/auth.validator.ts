import Joi from "joi";
import { UserGender } from "../types/enum";

export const updateProfileSchema = Joi.object({
  name: Joi.string().min(2).max(60).optional(),
  email: Joi.string().email().optional(),
  gender: Joi.string().valid(...Object.values(UserGender)).optional(),
  emailConsent: Joi.boolean().optional(),
});
