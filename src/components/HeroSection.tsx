"use client";

import Button from "./Button";
import { urlFor } from "@/lib/sanity";
import Image from "next/image";

interface HeroData {
  title?: string;
  subtitle?: string;
  description?: string;
  buttonText?: string;
  image?: {
    asset?: { _ref: string };
    alt?: string;
    [key: string]: unknown;
  };
}

interface HeroSectionProps {
  initialHeroData?: HeroData;
}

export default function HeroSection({ initialHeroData }: HeroSectionProps) {
  const hero = initialHeroData;

  return (
    <section
      className="bg-gray-100 h-screen flex items-center"
      style={{ height: "calc(100vh - 4rem)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <div className="space-y-8">
            {hero?.title && (
              <h1 className="text-4xl lg:text-6xl font-bold text-black leading-tight">
                {hero.title}
              </h1>
            )}

            <div className="space-y-4">
              {hero?.subtitle && (
                <p className="text-lg text-gray-600">{hero.subtitle}</p>
              )}
              {hero?.description && (
                <p className="text-gray-600">{hero.description}</p>
              )}
            </div>

            {hero?.buttonText && (
              <div className="pt-4">
                <Button width="medium">{hero.buttonText}</Button>
              </div>
            )}
          </div>

          {/* Right side - Image */}
          <div className="flex justify-center lg:justify-end">
            <div className="bg-white rounded-2xl p-8 shadow-lg w-full max-w-md">
              {hero?.image ? (
                <div className="relative h-64 rounded-xl overflow-hidden">
                  <Image
                    src={urlFor(hero.image).width(400).height(256).url()}
                    alt={hero.image.alt || "Hero image"}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="bg-gray-200 rounded-xl h-64 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-4"></div>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-300 rounded w-24 mx-auto"></div>
                      <div className="h-3 bg-gray-300 rounded w-16 mx-auto"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
