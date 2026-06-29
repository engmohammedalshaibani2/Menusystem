import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { handleApiError } from "@/lib/api-utils";

export async function GET() {
  try {
    await requireAuth();
    const categories = await prisma.category.findMany({
      orderBy: [{ sortOrder: "asc" }],
      include: { _count: { select: { menuItems: true } } },
    });

    return NextResponse.json(categories);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    await requireAuth();
    const body = await request.json();
    const { nameAr, nameEn, imagePath, sortOrder, isActive } = body;
    const maxSort = await prisma.category.aggregate({ _max: { sortOrder: true } });
    const nextSort = (maxSort._max.sortOrder ?? 0) + 1;

    const category = await prisma.category.create({
      data: {
        nameAr,
        nameEn,
        imagePath: imagePath ?? null,
        sortOrder: sortOrder ?? nextSort,
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
