import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();
    const { id } = await params;
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

    const menuItem = await prisma.menuItem.update({
      where: { id: Number(id) },
      data: {
        ...(categoryId !== undefined && { categoryId }),
        ...(nameAr !== undefined && { nameAr }),
        ...(nameEn !== undefined && { nameEn }),
        ...(descriptionAr !== undefined && { descriptionAr }),
        ...(descriptionEn !== undefined && { descriptionEn }),
        ...(price !== undefined && { price }),
        ...(imagePath !== undefined && { imagePath }),
        ...(isAvailable !== undefined && { isAvailable }),
        ...(isFeatured !== undefined && { isFeatured }),
        ...(sortOrder !== undefined && { sortOrder }),
      },
    });

    return NextResponse.json(menuItem);
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

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();
    const { id } = await params;

    await prisma.menuItem.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true });
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
