import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LADDER TO THE MOON",
  description: "A cinematic 3D visualization of a token's climb to $1,000,000 market cap.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
