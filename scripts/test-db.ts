import { prisma } from "../app/lib/prisma";

async function testConnection() {
  try {
    await prisma.$connect();
    console.log("✅ Database connection successful!");
    console.log("✅ Prisma + Neon setup complete!");
    
  } catch (error) {
    console.error("❌ Database connection failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
