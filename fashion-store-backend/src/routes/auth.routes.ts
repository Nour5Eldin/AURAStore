import { Router } from "express";
import { authController } from "../controllers";
import { authenticate, authenticateAuth0 } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { updateProfileSchema } from "../validators/auth.validator";
import { uploadImage } from "../middleware/upload.middleware";
import Joi from "joi";

const router = Router();

// JWT-protected but no DB lookup required — creates the user on first call.
// Uses authenticateAuth0 (not authenticate) intentionally: the DB user
// may not exist yet at the point this endpoint is called.
router.post("/sync", authenticateAuth0, validate(Joi.object({
  email: Joi.string().email().required(),
  name: Joi.string().min(1).max(120).optional(),
  picture: Joi.string().uri().optional(),
})), authController.syncAuth0User);

// Protected routes
router.get("/me", authenticate, authController.getMe);
router.patch("/profile", authenticate, validate(updateProfileSchema), authController.updateProfile);
router.post(
  "/avatar",
  authenticate,
  uploadImage.single("avatar"),
  authController.uploadAvatar
);
router.delete(
  "/avatar",
  authenticate,
  authController.removeAvatar
);

export default router;
