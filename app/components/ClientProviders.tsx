"use client";

import { SessionProvider } from "next-auth/react";
import StyledThemeProvider from "@/app/components/StyledThemeProvider";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <StyledThemeProvider>
      <SessionProvider>
        {children}
      </SessionProvider>
    </StyledThemeProvider>
  );
} 