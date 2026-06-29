import { prisma } from "./prisma";

export type Settings = {
  restaurantName: string;
  welcomeMessage: string;
  logoPath: string;
  coverPath: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  bgColor: string;
  textPrimary: string;
  borderColor: string;
  fontHeading: string;
  fontBody: string;
  phone: string;
  address: string;
};

const defaultSettings: Settings = {
  restaurantName: "بيت المندي",
  welcomeMessage: "أهلاً وسهلاً بكم في مطعم بيت المندي",
  logoPath: "",
  coverPath: "",
  primaryColor: "#74133A",
  secondaryColor: "#8E1F47",
  accentColor: "#C59B5F",
  bgColor: "#F4EFE6",
  textPrimary: "#3A2318",
  borderColor: "#E3D9CE",
  fontHeading: "Cairo",
  fontBody: "Tajawal",
  phone: "",
  address: "",
};

export async function getSettings(): Promise<Settings> {
  const rows = await prisma.setting.findMany();
  const map: Record<string, string> = {};
  for (const row of rows) map[row.key] = row.value;
  return { ...defaultSettings, ...map } as Settings;
}

export async function updateSetting(key: string, value: string): Promise<void> {
  await prisma.setting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
}

export async function updateSettings(data: Record<string, string>): Promise<void> {
  for (const [key, value] of Object.entries(data)) {
    await updateSetting(key, value);
  }
}

export function formatPrice(price: number): string {
  return price.toLocaleString("ar-SA", { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + " ر.ي";
}

export function calculateDiscount(price: number, type: string, value: number): number {
  if (type === "percentage") return price - (price * value) / 100;
  return price - value;
}

export function isExpired(date: Date): boolean {
  return new Date() > new Date(date);
}
