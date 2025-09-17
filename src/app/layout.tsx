import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lightning Shop",
  description: "Lightning-fast Next.js ecommerce boilerplate",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light">
      <body className={`${inter.className} text-gray-900 bg-gray-50`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
