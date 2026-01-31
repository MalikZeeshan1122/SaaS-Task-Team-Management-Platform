import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SaaS Platform | Muhammad Zeeshan",
  description: "Advanced Task & Team Management Platform created by Muhammad Zeeshan",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <main className="min-h-screen flex flex-col">
          <div className="flex-1">
            {children}
          </div>
          <footer className="w-full py-6 text-center border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950">
            <p className="text-sm text-gray-500">
              Created by <span className="font-semibold text-gray-900 dark:text-gray-100">Muhammad Zeeshan</span>
              <span className="mx-2">|</span>
              <a
                href="https://www.linkedin.com/in/muhammadzeeshan007/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-500 hover:underline transition-colors"
              >
                LinkedIn Profile
              </a>
            </p>
          </footer>
        </main>
      </body>
    </html>
  );
}
