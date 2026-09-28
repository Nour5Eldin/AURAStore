import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { authService } from "../services/auth.service";
import { ApiError } from "../utils/ApiError";
import { env } from "../config/env";

export class AuthController {
  syncAuth0User = asyncHandler(async (req: Request, res: Response) => {
    const auth0Id = req.auth?.payload.sub;
    if (!auth0Id) throw ApiError.unauthorized("Auth0 user identity is missing.");

    // Grant ADMIN role if the signing-in email matches the configured admin email.
    const isAdmin = env.adminEmail !== "" &&
      req.body.email?.toLowerCase().trim() === env.adminEmail;

    const user = await authService.syncAuth0User(auth0Id, req.body, isAdmin);
    res.status(200).json(ApiResponse.ok(user, "Profile synchronized successfully."));
  });
  getMe = asyncHandler(async (req: Request, res: Response) => {
    const user = await authService.updateProfile(req.user!.userId, {});

    res.status(200).json(
      ApiResponse.ok(user, "Profile fetched successfully.")
    );
  });
  uploadAvatar = asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) {
      res.status(400).json(ApiResponse.badRequest("Image is required."));
      return;
    }

    const user = await authService.uploadAvatar(
      req.user!.userId,
      req.file.path
    );

    res.status(200).json(
      ApiResponse.ok(user, "Profile picture updated successfully.")
    );
  });
  removeAvatar = asyncHandler(async (req: Request, res: Response) => {
    const user = await authService.removeAvatar(req.user!.userId);

    res.status(200).json(
      ApiResponse.ok(user, "Profile picture removed successfully.")
    );
  });
  updateProfile = asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.updateProfile(
      req.user!.userId,
      req.body
    );
    res.status(200).json(
      ApiResponse.ok(result, "Profile updated successfully.")
    );
  });
}
export const authController = new AuthController();
