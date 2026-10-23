import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import HeaderTitle from "@/components/HeaderTitle";
import ThemeToggle from "@/components/ThemeToggle";
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
  title: "Geoquiz",
  description: "Test your geography with flags and capitals.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
  // The phone's status bar matches the page background in each system theme.
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#0c0c0e" },
  ],
};

// Applies the saved (or system) theme before the first paint, so it never flashes.
const themeScript = `try{var t=localStorage.getItem("theme");if(t==="dark"||(!t&&matchMedia("(prefers-color-scheme: dark)").matches))document.documentElement.classList.add("dark")}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: themeScript }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-4 sm:px-8 lg:py-6">
          <HeaderTitle />
          <ThemeToggle />
        </header>
        {children}
      </body>
    </html>
  );
}
