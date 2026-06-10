import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VoiceDocs — Speak it. Get the document.",
  description:
    "Turn your voice into professionally formatted business documents — invoices, care notes, quotes and reports — in seconds. Built in Australia.",
  applicationName: "VoiceDocs",
  appleWebApp: { capable: true, title: "VoiceDocs", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  themeColor: "#6C3CE1",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

// Set the theme class before paint to avoid a flash of the wrong theme.
const themeScript = `(function(){try{var t=localStorage.getItem('vd-theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark');}}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-canvas text-ink">
        {children}
      </body>
    </html>
  );
}
