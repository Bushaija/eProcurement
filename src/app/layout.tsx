import {
  ClerkProvider,
} from '@clerk/nextjs';
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import type { Metadata } from "next";
import "./globals.css";

import QueryProvider from "@/providers/query-provider";
import KBar from "@/components/kbar";

export const metadata: Metadata = {
  title: "RBC - Procurement",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
  <ClerkProvider>
    <html lang="en">
      <body>
          <KBar>
            <QueryProvider>
              <NuqsAdapter>
                {children}
              </NuqsAdapter>
            </QueryProvider>
          </KBar>
      </body>
    </html>
  </ClerkProvider>
  );
}
