import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import NextTopLoader from "nextjs-toploader";
import { ThemeProvider } from "@/components/theme/theme-provider"
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NoteSync",
  description: "Capture your ideas, anytime, anywhere.",
  keywords: [
    "NoteSync",
    "note-taking app",
    "online notes",
    "cloud notes",
    "secure notes",
    "productivity",
  ],
  authors: [{ name: "Vinod Kumar", url: "https://www.vinodjangid.site" }],
  creator: "Vinod Kumar",
  openGraph: {
    title: "NoteSync - Capture Your Ideas, Anytime, Anywhere",
    description:
      "A cloud-based note-taking app that helps you organize and access your notes securely from anywhere.",
    url: "https://notesync-site.netlify.app/",
    siteName: "NoteSync",
    images: [
      {
        url: "https://notesync-site.netlify.app/images/ogimage.png",
        width: 1200,
        height: 630,
        alt: "NoteSync - Capture Your Ideas, Anytime, Anywhere",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NoteSync - Cloud-Based Note-Taking App",
    description:
      "Capture your ideas effortlessly with NoteSync. Secure, fast, and accessible anytime, anywhere.",
    images: ["https://notesync-site.netlify.app/images/ogimage.png"],
    creator: "@Vinod_Jangid07",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
          <NextTopLoader color="#9333ea" showSpinner={false} />
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
