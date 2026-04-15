import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "FoodBridge | Food Donation Platform",
  description: "FoodBridge is a full-stack donation platform connecting donors and NGOs through a Next.js frontend and Express backend.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${montserrat.variable} h-full antialiased`}>
      <body className="min-h-full bg-slate-50 text-slate-900">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
