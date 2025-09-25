import { type SchemaTypeDefinition } from "sanity";
import hero from "./hero";
import about from "./about";
import contact from "./contact";
import product from "./product";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [hero, about, contact, product],
};
