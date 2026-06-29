import { PrismaClient } from "@prisma/client";
import { existsSync } from "fs";
import { join } from "path";

const prisma = new PrismaClient();

async function healthCheck() {
  const results: any[] = [];

  try {
    await prisma.$queryRaw`SELECT 1`;
    results.push({ check: "Database", status: "✅ ok" });
  } catch (e) {
    results.push({ check: "Database", status: "❌ failed", error: String(e) });
  }

  const files = [
    { path: join(process.cwd(), "prisma", "schema.prisma"), name: "Prisma Schema" },
    { path: join(process.cwd(), "prisma", "database.db"), name: "Database File" },
    { path: join(process.cwd(), "next.config.ts"), name: "Next Config" },
    { path: join(process.cwd(), "uploads"), name: "Uploads Dir" },
  ];
  for (const f of files) {
    results.push({ check: f.name, status: existsSync(f.path) ? "✅ ok" : "❌ missing" });
  }

  const mem = process.memoryUsage();
  results.push({
    check: "Memory",
    status: `Heap: ${Math.round(mem.heapUsed / 1024 / 1024)}MB / RSS: ${Math.round(mem.rss / 1024 / 1024)}MB`,
  });

  console.log(
    JSON.stringify({ timestamp: new Date().toISOString(), status: "completed", checks: results }, null, 2)
  );
  await prisma.$disconnect();
}

healthCheck().catch((e) => {
  console.error(e);
  process.exit(1);
});
