import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  useCdn: process.env.NODE_ENV === "production", // Only use CDN in production
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION!,
  token: process.env.SANITY_API_TOKEN, // Add token for better reliability
});

const builder = imageUrlBuilder(client);

export const sanityClient = client;

export function urlFor(
  source: { asset?: { _ref: string }; _ref?: string } | string
) {
  return builder.image(source);
}

export interface SanityHero {
  _id: string;
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  image: {
    asset: {
      _ref: string;
    };
    alt: string;
  };
}

export interface SanityAbout {
  _id: string;
  title: string;
  content: {
    _type: string;
    children?: { text: string }[];
    style?: string;
  }[];
  image: {
    asset: {
      _ref: string;
    };
    alt: string;
  };
}

export async function getHeroContent(): Promise<SanityHero | null> {
  try {
    console.log("🔍 Fetching hero content from Sanity...");
    const query = `*[_type == "hero"][0]`;
    const hero = await client.fetch(
      query,
      {},
      {
        cache: "no-store", // Disable caching for fresh data
        next: { revalidate: 0 }, // Force revalidation
      }
    );
    console.log("✅ Hero content fetched:", hero);
    return hero;
  } catch (error) {
    console.error("❌ Error fetching hero content from Sanity:", error);
    return null;
  }
}

export async function getAboutContent(): Promise<SanityAbout | null> {
  try {
    console.log("🔍 Fetching about content from Sanity...");
    const query = `*[_type == "about"][0]`;
    const about = await client.fetch(
      query,
      {},
      {
        cache: "no-store",
        next: { revalidate: 0 },
      }
    );
    console.log("✅ About content fetched:", about);
    return about;
  } catch (error) {
    console.error("❌ Error fetching about content from Sanity:", error);
    return null;
  }
}

export async function getContactContent(): Promise<{
  _id: string;
  title: string;
  description: string;
  email: string;
  phone: string;
  address: string;
} | null> {
  try {
    console.log("🔍 Fetching contact content from Sanity...");
    const query = `*[_type == "contact"][0]`;
    const contact = await client.fetch(
      query,
      {},
      {
        cache: "no-store",
        next: { revalidate: 0 },
      }
    );
    console.log("✅ Contact content fetched:", contact);
    return contact;
  } catch (error) {
    console.error("❌ Error fetching contact content from Sanity:", error);
    return null;
  }
}
