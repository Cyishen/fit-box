import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { PracticeModal } from "@/components/modals/practice-modal";
import { MenuModal } from "@/components/modals/menu-modal";
import { DeleteMenuModal } from "@/components/modals/delete-menu-modal";

import { QueryProvider } from "@/components/query-provider";
import AuthProvider from "@/components/form/AuthProvider";


const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "FitBox",
  description: "FitBox App",
  icons: {
    icon: "/icons/workout.svg"
  },
  viewport: "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta 
          name="viewport" 
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" 
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <QueryProvider>
            {children}

            <PracticeModal />
            <MenuModal />
            <DeleteMenuModal />
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
