import { NextResponse } from "next/server";
import {
  getHeroContent,
  getAboutContent,
  getContactContent,
} from "@/lib/sanity";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  console.log(`🔍 API: Fetching content type: ${type}`);

  try {
    let content;

    switch (type) {
      case "hero":
        content = await getHeroContent();
        break;
      case "about":
        content = await getAboutContent();
        break;
      case "contact":
        content = await getContactContent();
        break;
      default:
        console.error("❌ Invalid content type:", type);
        return NextResponse.json(
          { error: "Invalid content type" },
          { status: 400 }
        );
    }

    console.log(`✅ API: Content fetched for type ${type}:`, content);

    return NextResponse.json(
      { content },
      {
        status: 200,
        headers: {
          "Cache-Control":
            "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  } catch (error) {
    console.error("❌ API: Error fetching content:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch content",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
