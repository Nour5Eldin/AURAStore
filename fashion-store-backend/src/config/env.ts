const required = (key: string): string => {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Missing required env variable: ${key}`);
    }
    return value;
};
export const env = {
    port: parseInt(process.env.PORT || "5000"),
    nodeEnv: process.env.NODE_ENV || "development",
    isDev: process.env.NODE_ENV === "development",
    defaultAvatarUrl: process.env.DEFAULT_AVATAR_URL || "",

    mongodb: {
        uri: required("MONGODB_URI"),
    },
    auth0: {
        domain: required("AUTH0_DOMAIN"),
        audience: required("AUTH0_AUDIENCE"),
    },
    // The single email address that receives the ADMIN role on every sync.
    // Everyone else is assigned the USER role.
    adminEmail: (process.env.ADMIN_EMAIL || "").toLowerCase().trim(),
    cloudinary: {
        cloudName: required("CLOUDINARY_CLOUD_NAME"),
        apikey: required("CLOUDINARY_API_KEY"),
        apiSecret: required("CLOUDINARY_API_SECRET")
    },
    store: {
        name: process.env.STORE_NAME || "Fashion Store",
        email: process.env.STORE_EMAIL || "",
    },
} as const;
