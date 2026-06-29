import { NextResponse } from "next/server";
import { getSettings, updateSettings } from "@/lib/utils";
import { requireAuth, requireAdmin } from "@/lib/auth";
import { handleApiError } from "@/lib/api-utils";

export async function GET() {
  try {
    await requireAuth();
    const settings = await getSettings();
    return NextResponse.json(settings);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    await updateSettings(body);
    const settings = await getSettings();
    return NextResponse.json(settings);
  } catch (error) {
    return handleApiError(error);
  }
}
