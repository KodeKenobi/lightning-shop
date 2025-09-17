import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const { productId, channelName } = await request.json();

    if (!productId || !channelName) {
      return NextResponse.json(
        { success: false, message: "productId and channelName are required" },
        { status: 400 }
      );
    }

    // First, get all publications to find the Lightning channel
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

    console.log("Fetching publications to find channel:", channelName);

    const publicationsResponse = await fetch(
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

    const publicationsData = await publicationsResponse.json();
    console.log(
      "Publications response:",
      JSON.stringify(publicationsData, null, 2)
    );

    if (!publicationsResponse.ok) {
      console.error("Failed to fetch publications:", publicationsData);
      return NextResponse.json(
        {
          success: false,
          message: "Failed to fetch publications",
          error: publicationsData,
        },
        { status: 400 }
      );
    }

    // Find the Lightning channel publication
    const publications = publicationsData.data?.publications?.edges || [];
    const lightningChannel = publications.find((edge: { node: { name: string } }) =>
      edge.node.name.toLowerCase().includes(channelName.toLowerCase())
    );

    if (!lightningChannel) {
      console.log(
        "Available channels:",
        publications.map((p: { node: { name: string } }) => p.node.name)
      );
      return NextResponse.json(
        {
          success: false,
          message: `Channel '${channelName}' not found`,
          availableChannels: publications.map((p: { node: { name: string } }) => p.node.name),
        },
        { status: 404 }
      );
    }

    const publicationId = lightningChannel.node.id;
    console.log(`Found ${channelName} channel with ID:`, publicationId);

    // Now publish the product to the Lightning channel
    const publishMutation = `
      mutation publishablePublish($id: ID!, $input: [PublicationInput!]!) {
        publishablePublish(id: $id, input: $input) {
          userErrors {
            field
            message
          }
        }
      }
    `;

    const publishResponse = await fetch(
      `https://df1qgb-iw.myshopify.com/admin/api/2025-07/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": process.env.SHOPIFY_ADMIN_ACCESS_TOKEN!,
        },
        body: JSON.stringify({
          query: publishMutation,
          variables: {
            id: productId,
            input: [{ publicationId }],
          },
        }),
      }
    );

    const publishData = await publishResponse.json();
    console.log("Publish response:", JSON.stringify(publishData, null, 2));

    if (!publishResponse.ok || publishData.errors) {
      console.error("Failed to publish product to channel:", publishData);
      return NextResponse.json(
        {
          success: false,
          message: "Failed to publish product to channel",
          error: publishData,
        },
        { status: 400 }
      );
    }

    if (publishData.data?.publishablePublish?.userErrors?.length > 0) {
      console.error(
        "Publish user errors:",
        publishData.data.publishablePublish.userErrors
      );
      return NextResponse.json(
        {
          success: false,
          message: "Failed to publish product to channel",
          errors: publishData.data.publishablePublish.userErrors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Product successfully published to ${channelName} channel`,
      publicationId,
    });
  } catch (error) {
    console.error("Error publishing product to channel:", error);
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
