import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pots and Stones Coffee & Eatery | Specialty Coffee, Dimsums & Thin Crust Pizzas",
  description: "Order handcrafted dimsums, pasta, summer salads, artisanal shakes, and thin crust pizzas online from Pots and Stones Coffee & Eatery in Haldwani.",
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>☕</text></svg>',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#231b15',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#f8f6f2] selection:bg-amber-700 selection:text-white">
        {children}
      </body>
    </html>
  );
}
