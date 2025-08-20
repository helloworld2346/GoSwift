import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthInitializer } from "@/components/auth/auth-initializer";
import { ToastProvider } from "@/hooks/use-toast"; // Import ToastProvider

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GoSwift - Real-time Chat",
  description: "A real-time webchat application built with Go and Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ToastProvider> {/* Wrap toàn bộ app với ToastProvider */}
          <AuthInitializer />
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
