import { env } from "../config/env";
import { ApiError } from "../utils/ApiError";
import { userRepository } from "../repositories/user.repository";
import { IUser } from "../models/user.model";
import { UserRole } from "../types/enum";
import { cloudinary } from "../config/cloudinary";

export class AuthService {

    async syncAuth0User(
        auth0Id: string,
        profile: { email: string; name?: string; picture?: string },
        isAuth0Admin: boolean,
    ): Promise<Partial<IUser>> {
        const email = profile.email.toLowerCase();
        let user = await userRepository.findByAuth0Id(auth0Id);
        const name = profile.name?.trim() || email.split("@")[0];
        const username = `${email.split("@")[0]}_${auth0Id.slice(-8)}`.slice(0, 60);

        if (!user) {
            // Check if there's an existing user with the same email (e.g. seeded user)
            const existingEmail = await userRepository.findByEmail(email);
            if (existingEmail) {
                // Link the seeded account to this Auth0 identity
                existingEmail.auth0Id    = auth0Id;
                existingEmail.authProvider = "auth0";
                if (existingEmail.avatar?.includes("ui-avatars") && profile.picture) {
                    existingEmail.avatar = profile.picture;
                }
                if (isAuth0Admin) existingEmail.role = UserRole.ADMIN;
                await existingEmail.save();
                return this.formatUser(existingEmail);
            }
            // Brand-new user — create fresh
            user = await userRepository.create({
                auth0Id,
                name,
                username,
                email,
                avatar: profile.picture,
                role: isAuth0Admin ? UserRole.ADMIN : UserRole.USER,
                isActive: true,
                authProvider: "auth0",
                emailConsent: false,
            });
        } else {
            user.authProvider = "auth0";
            if (isAuth0Admin) user.role = UserRole.ADMIN;
            await user.save();
        }

        return this.formatUser(user);
    }

    private formatUser(user: IUser): Partial<IUser> {
        return {
            _id: user._id,
            name: user.name,
            username: user.username,
            mobile: user.mobile,
            email: user.email,
            avatar: user.avatar,
            gender: user.gender,
            role: user.role,
            authProvider: user.authProvider,
            auth0Id: user.auth0Id,
            emailConsent: user.emailConsent,
            isActive: user.isActive,
            createdAt: user.createdAt,
        };
    }
    async updateProfile(
        userId: string,
        data: {
            name?: string;
            email?: string;
            gender?: "male" | "female";
            emailConsent?: boolean;
        }
    ): Promise<Partial<IUser>> {
        if (data.email) {
            const emailTaken = await userRepository.isEmailTaken(data.email, userId);
            if (emailTaken) {
                throw ApiError.badRequest(
                    "This email is already associated with another account."
                );
            }
        }
        const user = await userRepository.findById(userId);
        if (!user) throw ApiError.notFound("User not found.");

        Object.assign(user, data);
        await user.save();

        return this.formatUser(user);
    }
    async uploadAvatar(
        userId: string,
        imagePath: string,
    ): Promise<Partial<IUser>> {
        const user = await userRepository.findById(userId);
        if (!user) throw ApiError.notFound("User not found.");
        if (user.avatar && user.avatar !== env.defaultAvatarUrl) {
            try {
                const urlParts = user.avatar.split("/");
                const fileName = urlParts[urlParts.length - 1];
                const publicId = `fashion-store/avatars/${fileName.split(".")[0]}`;
                await cloudinary.uploader.destroy(publicId);
            } catch {
                console.warn("Could not delete old avatar from Cloudinary.");
            }
        }
        const uploadResult = await cloudinary.uploader.upload(imagePath, {
            folder: "fashion-store/avatars",
            transformation: [
                { width: 400, height: 400, crop: "fill", gravity: "face" },
                { quality: "auto", fetch_format: "auto" },
            ]
        });
        user.set("avatar", uploadResult.secure_url);
        await user.save();
        return this.formatUser(user);
    }
    async removeAvatar(userId: string): Promise<Partial<IUser>> {
        const user = await userRepository.findById(userId);
        if (!user) throw ApiError.notFound("User not found");
        if (user.avatar && user.avatar !== env.defaultAvatarUrl) {
            try {
                const urlParts = user.avatar.split("/");
                const fileName = urlParts[urlParts.length - 1];
                const publicId = `fashion-store/avatars/${fileName.split(".")[0]}`;
                await cloudinary.uploader.destroy(publicId);
            } catch (err) {
                console.warn("Could not delete avatar from Cloudinary.");
            }
        }
        user.set("avatar", env.defaultAvatarUrl);
        await user.save();
        return this.formatUser(user);

    }
}
export const authService = new AuthService();
