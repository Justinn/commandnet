"use client";

import { useState, useEffect } from "react";
import styled from "styled-components";
import { signIn } from "next-auth/react";
import { PrimaryButton } from "@/app/components/PrimaryButton";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  font-family: ${({ theme }) => theme.fonts.main};
`;

const Title = styled.h4`
  margin-bottom: 2rem;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 2rem;
  text-shadow: 0 0 0.75rem ${({ theme }) => theme.colors.primary};
  font-family: ${({ theme }) => theme.fonts.main};
`;

const Form = styled.form`
  width: 20rem;
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 1rem;
  margin-bottom: 0.5rem;
  font-family: ${({ theme }) => theme.fonts.main};
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  background: ${({ theme }) => theme.colors.paper};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 1rem;
  font-family: ${({ theme }) => theme.fonts.main};
  margin-bottom: 1.5rem;
  outline: none;
  transition: border 0.2s;
  &:focus {
    border-color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

const Alert = styled.div<{ $severity: 'success' | 'error' }>`
  margin-top: 1.5rem;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-family: ${({ theme }) => theme.fonts.main};
  color: ${({ $severity, theme }) =>
    $severity === 'success' ? '#0a0' : theme.colors.primary};
  background: ${({ $severity, theme }) =>
    $severity === 'success' ? 'rgba(0,255,128,0.08)' : 'rgba(0,191,255,0.08)'};
  border: 1px solid
    ${({ $severity, theme }) =>
      $severity === 'success' ? '#0a0' : theme.colors.primary};
`;

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