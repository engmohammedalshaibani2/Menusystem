import { NextResponse } from "next/server";

export function handleApiError(error: unknown) {
  const message = error instanceof Error ? error.message : "Internal server error";

  if (message === "Unauthorized") {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  if (message === "Forbidden") {
    return NextResponse.json(
      { success: false, error: "Forbidden" },
      { status: 403 }
    );
  }

  return NextResponse.json(
    { success: false, error: "Internal server error" },
    { status: 500 }
  );
}
