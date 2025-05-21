import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Share_Tech_Mono } from "next/font/google";
import "@/app/globals.css";
import Header from "@/app/components/Header";
import Sidebar from "@/app/components/Sidebar";
import StyledComponentsRegistry from "@/app/components/StyledComponentsRegistry";
import ClientProviders from "@/app/components/ClientProviders";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const shareTechMono = Share_Tech_Mono({
  variable: "--font-share-tech-mono",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "CommandNet",
  description: "CommandNet: A SpaceTraders automation and dashboard app.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${shareTechMono.variable} antialiased`}
      >
        <StyledComponentsRegistry>
          <ClientProviders>
            <Header />
            <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
              <Sidebar />
              <main
                style={{
                  flexGrow: 1,
                  minHeight: "100vh",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {children}
              </main>
            </div>
          </ClientProviders>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
