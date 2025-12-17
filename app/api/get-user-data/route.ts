import { checkRateLimit } from "@/lib/limiter";
import { NextResponse } from "next/server";

export async function GET() {
    const rateLimitError = await checkRateLimit("general");
    if (rateLimitError) return rateLimitError;

    return NextResponse.json({ message: "Hello world" }, { status: 200 })
}
