import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PartPilot",
  description: "CAD/CNC parametric project assistant for mechanical parts."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt">
      <body>{children}</body>
    </html>
  );
}
