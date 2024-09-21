import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    <body>
        <div className="min-h-screen bg-blue-100 flex flex-col items-center pt-16">
          <header className="w-full bg-gradient-to-r from-blue-500 to-green-500 py-6">
            <h1 className="text-4xl font-bold text-center text-white">Weather Info</h1>
          </header>
          <main className="bg-white p-8 rounded-lg shadow-md max-w-lg w-full mt-10">
            {children}
          </main>
        </div>
      </body>
  </html>
  );
}
