import type { ReactNode } from "react";
import "./globals.css";
import Link from "next/link";
import { Toaster } from "react-hot-toast";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?display=swap&family=Noto+Sans:wght@400;500;700;900&family=Plus+Jakarta+Sans:wght@400;500;700;800"
        />
        <style>{`:root{--font-plus-jakarta:'Plus Jakarta Sans',sans-serif;--font-noto-sans:'Noto Sans',sans-serif;}`}</style>
      </head>
      <body className="bg-white text-[#181111]">
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              fontFamily:
                "var(--font-plus-jakarta), var(--font-noto-sans), sans-serif",
            },
          }}
        />
        <header className="border-b border-[#f4f0f0] sticky top-0 bg-white z-10">
          <nav className="container mx-auto px-4 py-3 flex items-center justify-between">
            <Link
              href="/"
              className="font-bold text-lg tracking-[-0.015em] text-[#181111] hover:opacity-90"
            >
              Video Manager
            </Link>
            <div className="flex items-center gap-9">
              <Link
                href="/"
                className="text-sm font-medium text-[#181111] hover:text-black"
              >
                My Library
              </Link>
              <Link
                href="/new"
                className="flex h-10 items-center justify-center btn btn-primary px-2.5 text-sm font-bold"
              >
                New Video
              </Link>
            </div>
          </nav>
        </header>
        <main className="container mx-auto px-4 py-5">{children}</main>
      </body>
    </html>
  );
}
