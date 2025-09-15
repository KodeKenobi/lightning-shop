import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schema } from "../sanity/schemaTypes";

export default defineConfig({
  name: "lightning-shop",
  title: "Lightning Shop",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  plugins: [structureTool()],
  schema,
});
