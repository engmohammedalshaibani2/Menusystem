import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, hashPassword, getSession } from "@/lib/auth";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await request.json();
    const { username, password, role, isActive } = body;

    const updateData: Record<string, unknown> = {};
    if (username !== undefined) updateData.username = username;
    if (password !== undefined) updateData.password = await hashPassword(password);
    if (role !== undefined) updateData.role = role;
    if (isActive !== undefined) updateData.isActive = isActive;

    if (username !== undefined) {
      const existing = await prisma.user.findUnique({ where: { username } });
      if (existing && existing.id !== Number(id)) {
        return NextResponse.json(
          { success: false, error: "Username already exists" },
          { status: 409 }
        );
      }
    }

    const user = await prisma.user.update({
      where: { id: Number(id) },
      data: updateData,
      select: { id: true, username: true, role: true, isActive: true, updatedAt: true },
    });

    return NextResponse.json(user);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Unauthorized") {
        return NextResponse.json(
          { success: false, error: "Unauthorized" },
          { status: 401 }
        );
      }
      if (error.message === "Forbidden") {
        return NextResponse.json(
          { success: false, error: "Forbidden" },
          { status: 403 }
        );
      }
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
    const session = await requireAdmin();
    const { id } = await params;

    if (session.id === Number(id)) {
      return NextResponse.json(
        { success: false, error: "Cannot delete yourself" },
        { status: 400 }
      );
    }

    await prisma.user.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Unauthorized") {
        return NextResponse.json(
          { success: false, error: "Unauthorized" },
          { status: 401 }
        );
      }
      if (error.message === "Forbidden") {
        return NextResponse.json(
          { success: false, error: "Forbidden" },
          { status: 403 }
        );
      }
    }
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
