"use client";

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useSession } from "next-auth/react";
import { PrimaryButton } from "@/app/components/PrimaryButton";
import { AgentApiEndpoint } from "@/lib/constants";
import { Agent } from "@/lib/spacetraders/agent";

const Form = styled.form`
  width: 100%;
  background: none;
  border-radius: 0;
  box-shadow: none;
  display: flex;
  flex-direction: column;
  gap: 0;
  align-items: stretch;
`;

const ContentWrapper = styled.div`
  width: 32rem;
  max-width: 100%;
  margin: 0 auto;
  padding: 2rem 1.5rem 1.5rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  @media (max-width: 600px) {
    width: 100%;
    padding: 1rem 0.5rem 0.7rem 0.5rem;
    max-width: 100%;
  }
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
`;

const Label = styled.label`
  color: ${({ theme }) => theme.colors.primary};
  font-family: var(--font-share-tech-mono);
  font-size: 1.05rem;
  font-weight: 600;
`;

const Input = styled.input`
  padding: 0.7rem 1rem;
  border-radius: 0.4rem;
  border: 1px solid ${({ theme }) => theme.colors.primary + "55"};
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 1.1rem;
  font-family: ${({ theme }) => theme.fonts.main};
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0.3rem ${({ theme }) => theme.colors.primary};
  }
`;

const EmailDisplay = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 1rem;
`;

const SuccessMsg = styled.div`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1.1rem;
  margin-top: 0.7rem;
  text-align: center;
  min-height: 2.2rem;
  word-break: break-word;
`;

const ErrorMsg = styled.div`
  color: #ff4d4f;
  font-size: 1.05rem;
  margin-top: 0.7rem;
  text-align: center;
  min-height: 2.2rem;
  word-break: break-word;
`;

export function AddExistingAgentForm({ onAgentAdded, loading, success, error }: {
  onAgentAdded: (symbol: string, token: string) => void;
  loading: boolean;
  success: string;
  error: string;
}) {
  const { data: session } = useSession();
  const [symbol, setSymbol] = useState("");
  const [token, setToken] = useState("");

  // Clear fields when success message appears
  useEffect(() => {
    if (success) {
      setSymbol("");
      setToken("");
    }
  }, [success]);

  const email = session?.user?.email || "(unknown)";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAgentAdded(symbol.trim(), token.trim());
  };

  return (
    <Form onSubmit={handleSubmit}>
      <ContentWrapper>
        <EmailDisplay>
          Adding for: <b>{email}</b>
        </EmailDisplay>
        <Field>
          <Label htmlFor="symbol">Agent Symbol</Label>
          <Input
            id="symbol"
            type="text"
            value={symbol}
            onChange={e => setSymbol(e.target.value)}
            placeholder="e.g. JUSTINN"
            autoComplete="off"
            required
          />
        </Field>
        <Field>
          <Label htmlFor="token">Token</Label>
          <Input
            id="token"
            type="password"
            value={token}
            onChange={e => setToken(e.target.value)}
            placeholder="Enter your SpaceTraders token"
            autoComplete="off"
            required
          />
        </Field>
        <PrimaryButton type="submit" disabled={loading} style={{ marginTop: "1.2rem", width: "100%" }}>
          {loading ? "Adding..." : "Add Existing Agent"}
        </PrimaryButton>
        {success && <SuccessMsg>{success}</SuccessMsg>}
        {error && <ErrorMsg>{error}</ErrorMsg>}
      </ContentWrapper>
    </Form>
  );
} 