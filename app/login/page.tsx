"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { PrimaryButton } from "@/app/components/Buttons";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Container, Title, Form, Label, Input, Alert } from "./LoginPage.styles";

export default function LoginPage() {
  const { status } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/");
    }
  }, [status, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);
    try {
      const res = await signIn("email", { email, redirect: false });
      if (res && res.ok) {
        setMessage("Check your email for a magic link to sign in.");
      } else {
        setError(res?.error || "Failed to send magic link.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Title>Sign in to CommandNet</Title>
      <Form onSubmit={handleSubmit}>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          name="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
        <PrimaryButton type="submit" disabled={loading} style={{ width: '100%', marginTop: '0.5rem' }}>
          {loading ? "Sending..." : "Send Magic Link"}
        </PrimaryButton>
        {message && <Alert $severity="success">{message}</Alert>}
        {error && <Alert $severity="error">{error}</Alert>}
      </Form>
    </Container>
  );
} 