import { PrismaClient } from "@prisma/client";

export default class DB {
    static instance: PrismaClient
    static getInstance() {
        if (!this.instance) this.instance = new PrismaClient();
        return this.instance
    }
} 