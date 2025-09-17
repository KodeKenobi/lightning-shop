import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  try {
    // Query to get all available publications (sales channels)
    const publicationsQuery = `
      query getPublications {
        publications(first: 50) {
          edges {
            node {
              id
              name
              supportsFuturePublishing
            }
          }
        }
      }
    `;

    console.log("Fetching all available sales channels...");

    const response = await fetch(
      `https://df1qgb-iw.myshopify.com/admin/api/2025-07/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": process.env.SHOPIFY_ADMIN_ACCESS_TOKEN!,
        },
        body: JSON.stringify({ query: publicationsQuery }),
      }
    );

    const data: { data?: { publications?: { edges?: Array<{ node: { id: string; name: string; supportsFuturePublishing?: boolean } }> } } } = await response.json();
    console.log("Channels response:", JSON.stringify(data, null, 2));

    if (!response.ok) {
      console.error("Failed to fetch channels:", data);
      return NextResponse.json(
        {
          success: false,
          message: "Failed to fetch sales channels",
          error: data,
        },
        { status: 400 }
      );
    }

    const channels =
      data.data?.publications?.edges?.map((edge: { node: { id: string; name: string; supportsFuturePublishing?: boolean } }) => ({
        id: edge.node.id,
        name: edge.node.name,
        supportsFuturePublishing: edge.node.supportsFuturePublishing,
      })) || [];

    return NextResponse.json({
      success: true,
      channels,
      count: channels.length,
    });
  } catch (error) {
    console.error("Error fetching channels:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
