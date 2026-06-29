import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { handleApiError } from "@/lib/api-utils";

export async function GET() {
  try {
    await requireAuth();
    const menuItems = await prisma.menuItem.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      include: {
        category: true,
        _count: { select: { offers: true } },
      },
    });

    return NextResponse.json(menuItems);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    await requireAuth();
    const body = await request.json();
    const {
      categoryId,
      nameAr,
      nameEn,
      descriptionAr,
      descriptionEn,
      price,
      imagePath,
      isAvailable,
      isFeatured,
      sortOrder,
    } = body;
    const maxSort = await prisma.menuItem.aggregate({ _max: { sortOrder: true } });
    const nextSort = (maxSort._max.sortOrder ?? 0) + 1;

    const menuItem = await prisma.menuItem.create({
      data: {
        categoryId,
        nameAr,
        nameEn,
        descriptionAr: descriptionAr ?? null,
        descriptionEn: descriptionEn ?? null,
        price,
        imagePath: imagePath ?? null,
        isAvailable: isAvailable ?? true,
        isFeatured: isFeatured ?? false,
        sortOrder: sortOrder ?? nextSort,
      },
    });

    return NextResponse.json(menuItem, { status: 201 });
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
