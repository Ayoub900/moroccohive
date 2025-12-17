import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/lib/prisma";


export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "mongodb",
    }),
    emailAndPassword: {
        enabled: true
    },
    session: {
        cookieCache: {
            enabled: true,
            maxAge: 5 * 60, // Cache session for 5 minutes
        },
    },
    user: {
        additionalFields: {
            role: {
                type: "string",
            },
        },
    },
});
