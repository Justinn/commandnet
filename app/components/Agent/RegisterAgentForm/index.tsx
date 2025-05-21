"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { PrimaryButton } from "@/app/components/Buttons";
import { FACTIONS } from "@/lib/spacetraders/factions";
import { AgentApiEndpoint } from "@/lib/constants";
import { useAgent } from "@/app/context/AgentContext";
import {
  Form,
  ContentWrapper,
  Field,
  Label,
  Input,
  EmailDisplay,
  SuccessMsg,
  ErrorMsg
} from './RegisterAgentForm.styles';

export function RegisterAgentForm() {
  const { data: session } = useSession();
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