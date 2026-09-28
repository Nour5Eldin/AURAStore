import { NextFunction, Request, Response } from "express";
import { auth } from "express-oauth2-jwt-bearer";
import { env } from "../config/env";
import { ApiError } from "../utils/ApiError";
import { userRepository } from "../repositories";
import { UserRole } from "../types/enum";

declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: string;
                role: UserRole;
            };
        }
    }
}

export const authenticateAuth0 = auth({
    issuerBaseURL: `https://${env.auth0.domain}/`,
    audience: env.auth0.audience,
});

export const authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    authenticateAuth0(req, res, async (error?: unknown) => {
        if (error) {
            next(ApiError.unauthorized("Invalid or expired Auth0 access token."));
            return;
        }

        try {
            const auth0Id = req.auth?.payload.sub;
            if (!auth0Id) throw ApiError.unauthorized("Auth0 user identity is missing.");

            const user = await userRepository.findByAuth0Id(auth0Id);
            if (!user || !user.isActive) {
                throw ApiError.unauthorized("Account not found or deactivated.");
            }
            req.user = { userId: user._id.toString(), role: user.role as UserRole };
            next();
        } catch (lookupError) {
            next(lookupError);
        }
    });
};

export const authorizeAdmin = (req: Request, _res: Response, next: NextFunction): void => {
    if (req.user?.role !== UserRole.ADMIN) {
        next(ApiError.forbidden("Admin access required."));
        return;
    }
    next();
};
