import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/toaster";
import ReactQueryProvider from "@/components/ReactQueryProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Learning Hub",
  description:
    "Introducing LearnHub, the revolutionary learning hub project app that empowers students, educators, and lifelong learners to thrive in a dynamic and ever-evolving educational landscape. LearnHub is not just an app; it's your personalized gateway to knowledge, collaboration, and growth.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <ReactQueryProvider>
            <main>{children}</main>
          </ReactQueryProvider>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
