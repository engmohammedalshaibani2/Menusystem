import { existsSync, mkdirSync, cpSync, rmSync, readdirSync } from "fs";
import { join } from "path";
import { execSync } from "child_process";

const ROOT = process.cwd();
const DB_PATH = join(ROOT, "prisma", "database.db");
const UPLOADS_PATH = join(ROOT, "uploads");
const BACKUPS_DIR = join(ROOT, "backups");
const MAX_BACKUPS = 30;

function formatTimestamp(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const h = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  return `${y}-${m}-${d}_${h}-${min}`;
}

function backup(): void {
  const timestamp = formatTimestamp(new Date());
  const backupDir = join(BACKUPS_DIR, timestamp);
  const dbBackup = join(backupDir, "database.db");
  const uploadsBackup = join(backupDir, "uploads");
  const zipFile = join(BACKUPS_DIR, `${timestamp}.zip`);

  if (!existsSync(BACKUPS_DIR)) mkdirSync(BACKUPS_DIR, { recursive: true });
  mkdirSync(backupDir, { recursive: true });

  if (existsSync(DB_PATH)) {
    cpSync(DB_PATH, dbBackup);
    console.log(`Database backed up to ${dbBackup}`);
  } else {
    console.warn("Database file not found, skipping.");
  }

  if (existsSync(UPLOADS_PATH)) {
    cpSync(UPLOADS_PATH, uploadsBackup, { recursive: true });
    console.log(`Uploads backed up to ${uploadsBackup}`);
  } else {
    console.warn("Uploads directory not found, skipping.");
  }

  execSync(`powershell -Command "Compress-Archive -Path '${backupDir}' -DestinationPath '${zipFile}' -Force"`);
  console.log(`Compressed to ${zipFile}`);

  rmSync(backupDir, { recursive: true, force: true });
  console.log(`Temporary directory ${backupDir} removed`);

  const allBackups = readdirSync(BACKUPS_DIR)
    .filter((f) => f.endsWith(".zip"))
    .sort()
    .reverse();

  if (allBackups.length > MAX_BACKUPS) {
    const toRemove = allBackups.slice(MAX_BACKUPS);
    for (const f of toRemove) {
      rmSync(join(BACKUPS_DIR, f));
      console.log(`Removed old backup: ${f}`);
    }
  }

  console.log(`Backup complete: ${zipFile}`);
}

backup();
