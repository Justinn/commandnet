"use client";

import React, { useState } from "react";
import styled from "styled-components";
import { useSession } from "next-auth/react";
import { PrimaryButton } from "@/app/components/PrimaryButton";
import { FACTIONS } from "@/lib/spacetraders/factions";
import { AgentApiEndpoint } from "@/lib/constants";
import { useAgent } from "@/app/components/AgentContext";

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
  margin-bottom: 0.3rem;
`;

const Input = styled.input`
  padding: 0.7rem 1rem;
  border-radius: 0.4rem;
  border: 1px solid ${({ theme }) => theme.colors.primary + "55"};
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 1.1rem;
  font-family: ${({ theme }) => theme.fonts.main};
  margin-bottom: 0.7rem;
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0.3rem ${({ theme }) => theme.colors.primary};
  }
`;

const EmailDisplay = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 1rem;
  margin-bottom: 0.5rem;
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

export function RegisterAgentForm() {
  const { data: session } = useSession();
  const { selectedAgent } = useAgent();
  const [symbol, setSymbol] = useState("");
  const [faction, setFaction] = useState(FACTIONS[0].symbol);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [accountToken, setAccountToken] = useState("");

  const email = session?.user?.email || "(unknown)";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    setLoading(true);
    if (!symbol.trim() || !faction) {
      setError("Please provide Symbol and Faction.");
      setLoading(false);
      return;
    }
    if (!accountToken.trim()) {
      setError("Please provide your SpaceTraders Account Token.");
      setLoading(false);
      return;
    }
    if (symbol.length > 14) {
      setError("Symbol must be at most 14 characters.");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(AgentApiEndpoint.Register, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbol, faction, token: accountToken }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to register agent.");
        setLoading(false);
        return;
      }
      setSuccess(`Agent '${data.symbol}' registered with faction '${data.startingFaction}'!`);
      setSymbol("");
      setFaction(FACTIONS[0].symbol);
      setAccountToken("");
    } catch (err: any) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <ContentWrapper>
        <EmailDisplay>
          Registering as: <b>{email}</b>
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
            maxLength={14}
          />
        </Field>
        <Field>
          <Label htmlFor="faction">Faction</Label>
          <select
            id="faction"
            value={faction}
            onChange={e => setFaction(e.target.value)}
            required
            style={{ padding: "0.7rem 1rem", borderRadius: "0.4rem", border: `1px solid #00bfff55`, background: "#101624", color: "#fff", fontSize: "1.1rem", fontFamily: "inherit", marginBottom: "0.7rem" }}
          >
            {FACTIONS.map(f => (
              <option key={f.symbol} value={f.symbol}>{f.name}</option>
            ))}
          </select>
        </Field>
        <Field>
          <Label htmlFor="accountToken">Account Token</Label>
          <Input
            id="accountToken"
            type="text"
            value={accountToken}
            onChange={e => setAccountToken(e.target.value)}
            placeholder="Paste your SpaceTraders Account Token"
            autoComplete="off"
            required
          />
          <div style={{ color: '#aaa', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
            You must register at <a href="https://spacetraders.io" target="_blank" rel="noopener noreferrer" style={{ color: '#00bfff' }}>spacetraders.io</a> and paste your Account Token here.
          </div>
        </Field>
        <PrimaryButton type="submit" disabled={loading} style={{ marginTop: "1.2rem", width: "100%" }}>
          {loading ? "Registering..." : "Register Agent"}
        </PrimaryButton>
        {success && <SuccessMsg>{success}</SuccessMsg>}
        {error && <ErrorMsg>{error}</ErrorMsg>}
      </ContentWrapper>
    </Form>
  );
} 