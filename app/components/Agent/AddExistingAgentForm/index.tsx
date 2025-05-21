"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { PrimaryButton } from "@/app/components/Buttons";
import {
  Form,
  ContentWrapper,
  Field,
  Label,
  Input,
  EmailDisplay,
  SuccessMsg,
  ErrorMsg
} from "./AddExistingAgentForm.styles";

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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSymbol(e.target.value)}
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
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setToken(e.target.value)}
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