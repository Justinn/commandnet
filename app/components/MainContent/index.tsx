"use client";

import { useSession } from "next-auth/react";
import { PrimaryLinkButton } from "@/app/components/Buttons";
import { Container, Title, Subtitle } from "./MainContent.styles";

export default function MainContent({ children }: { children?: React.ReactNode }) {
  const { data: session, status } = useSession();

  return (
    <Container>
      {status === "authenticated" && (
        <div style={{ marginBottom: "2rem", fontSize: "1.3rem", color: "#fff", fontFamily: "inherit" }}>
          Welcome, {session.user?.name || session.user?.email}!
        </div>
      )}
      <Title>Welcome to CommandNet</Title>
      <Subtitle>
        CommandNet is your gateway to the SpaceTraders universe. Manage your fleet, trade resources, and automate your journey through the stars—all with a modern, sci-fi inspired interface.
      </Subtitle>
      {status !== "authenticated" && <PrimaryLinkButton href="/login">Sign In</PrimaryLinkButton>}
      {children}
    </Container>
  );
} 