"use client";

import { SessionProvider } from "next-auth/react";
import StyledThemeProvider from "@/app/components/StyledThemeProvider";
import { AgentProvider } from "@/app/components/AgentContext";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <StyledThemeProvider>
      <SessionProvider>
        <AgentProvider>
          {children}
        </AgentProvider>
      </SessionProvider>
    </StyledThemeProvider>
  );
} 