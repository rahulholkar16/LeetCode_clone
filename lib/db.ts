import { PrismaClient } from "../prisma/generated/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    throw new Error("ERROR:: Connection String not found. Please set DATABASE_URL.");
}

const adapter = new PrismaPg({ connectionString });
const globalForPrisma = globalThis;
export const db = globalForPrisma.prisma ?? new PrismaClient({ adapter });
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;