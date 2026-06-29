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
      titleAr,
      titleEn,
      descriptionAr,
      descriptionEn,
      imagePath,
      discountType,
      discountValue,
      startDate,
      endDate,
      isActive,
      itemIds,
    } = body;

    const targetItemIds = itemIds as number[] | undefined;

    await prisma.offerItem.deleteMany({ where: { offerId: Number(id) } });

    const offer = await prisma.offer.update({
      where: { id: Number(id) },
      data: {
        ...(titleAr !== undefined && { titleAr }),
        ...(titleEn !== undefined && { titleEn }),
        ...(descriptionAr !== undefined && { descriptionAr }),
        ...(descriptionEn !== undefined && { descriptionEn }),
        ...(imagePath !== undefined && { imagePath }),
        ...(discountType !== undefined && { discountType }),
        ...(discountValue !== undefined && { discountValue }),
        ...(startDate !== undefined && { startDate: new Date(startDate) }),
        ...(endDate !== undefined && { endDate: new Date(endDate) }),
        ...(isActive !== undefined && { isActive }),
        ...(targetItemIds !== undefined && {
          items: { create: targetItemIds.map((itemId: number) => ({ itemId })) },
        }),
      },
      include: { items: { include: { item: true } } },
    });

    return NextResponse.json(offer);
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

    await prisma.offer.delete({ where: { id: Number(id) } });
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
