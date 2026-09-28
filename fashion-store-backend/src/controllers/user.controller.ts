import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { User } from "../models/user.model";

export class UserController {
  getAdminUsers = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    // Build filter
    const filter: Record<string, unknown> = {};
    if (req.query.role) filter.role = req.query.role;
    if (req.query.isActive !== undefined) {
      filter.isActive = req.query.isActive === 'true';
    }
    if (req.query.search) {
      const s = req.query.search as string;
      filter.$or = [
        { name: { $regex: s, $options: 'i' } },
        { username: { $regex: s, $options: 'i' } },
        { email: { $regex: s, $options: 'i' } },
        { mobile: { $regex: s, $options: 'i' } },
      ];
    }

    const [users, total] = await Promise.all([
      User.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);

    res.status(200).json(
      ApiResponse.ok({
        data: users,
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      })
    );
  });

  createUser = asyncHandler(async (req: Request, res: Response) => {
    const user = await User.create(req.body);
    res.status(201).json(ApiResponse.created(user, "User created successfully."));
  });

  updateUser = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    // Don't update password through this standard route
    const { password, ...updateData } = req.body; 
    
    const user = await User.findByIdAndUpdate(id, updateData, { new: true });
    if (!user) {
      res.status(404).json(ApiResponse.notFound("User not found."));
      return;
    }
    res.status(200).json(ApiResponse.ok(user, "User updated successfully."));
  });

  deleteUser = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      res.status(404).json(ApiResponse.notFound("User not found."));
      return;
    }
    res.status(200).json(ApiResponse.ok(null, "User deleted successfully."));
  });

  toggleActive = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { isActive } = req.body;
    
    const user = await User.findByIdAndUpdate(id, { isActive }, { new: true });
    if (!user) {
      res.status(404).json(ApiResponse.notFound("User not found."));
      return;
    }
    res.status(200).json(ApiResponse.ok(user, "User status updated successfully."));
  });
}
export const userController = new UserController();
