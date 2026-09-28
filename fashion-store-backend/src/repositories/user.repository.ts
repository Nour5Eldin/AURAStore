import { User, IUser } from "../models/user.model";
import { BaseRepository } from "./base.repository";

export class UserRepository extends BaseRepository<IUser> {
  constructor() {
    super(User);
  }

  async findByMobile(mobile: string): Promise<IUser | null> {
    return User.findOne({ mobile })
      .select("+password +loginAttempts +lockUntil")
      .exec();
  }
  async findByEmailWithAuth(email: string): Promise<IUser | null> {
    return User.findOne({ email })
      .select("+password +loginAttempts +lockUntil")
      .exec();
  }
  async findByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ email }).exec();
  }

  async findByAuth0Id(auth0Id: string): Promise<IUser | null> {
    return User.findOne({ auth0Id }).exec();
  }
  async findBySocialId(socialId: string): Promise<IUser | null> {
    return User.findOne({ socialId }).exec();
  }
  async isMobileTaken(
    mobile: string,
    excludeId?: string
  ): Promise<boolean> {
    const filter: Record<string, unknown> = { mobile };
    if (excludeId) filter._id = { $ne: excludeId };
    return this.exists(filter);
  }

  async isUsernameTaken(
    username: string,
    excludeId?: string
  ): Promise<boolean> {
    const filter: Record<string, unknown> = { username };
    if (excludeId) filter._id = { $ne: excludeId };
    return this.exists(filter);
  }

  async isEmailTaken(
    email: string,
    excludeId?: string
  ): Promise<boolean> {
    const filter: Record<string, unknown> = { email };
    if (excludeId) filter._id = { $ne: excludeId };
    return this.exists(filter);
  }

  async getTotalUsers(): Promise<number> {
    return this.countDocuments({ role: "user" });
  }

  async deactivate(userId: string): Promise<IUser | null> {
    return this.updateById(userId, { isActive: false });
  }

  async activate(userId: string): Promise<IUser | null> {
    return this.updateById(userId, { isActive: true });
  }
}

export const userRepository = new UserRepository();
