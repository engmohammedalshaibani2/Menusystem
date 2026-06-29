import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { handleApiError } from "@/lib/api-utils";

export async function GET() {
  try {
    await requireAuth();
    const offers = await prisma.offer.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        items: { include: { item: true } },
      },
    });

    return NextResponse.json(offers);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    await requireAuth();
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

    const offer = await prisma.offer.create({
      data: {
        titleAr,
        titleEn,
        descriptionAr: descriptionAr ?? null,
        descriptionEn: descriptionEn ?? null,
        imagePath: imagePath ?? null,
        discountType: discountType ?? "percentage",
        discountValue,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        isActive: isActive ?? true,
        items: {
          create: ((itemIds || []) as number[]).map((itemId: number) => ({ itemId })),
        },
      },
      include: { items: { include: { item: true } } },
    });

    return NextResponse.json(offer, { status: 201 });
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
