"use client";

import React, { useState, useEffect } from "react";
import { AgentSelector, RegisterAgentForm, AddExistingAgentForm } from "@/app/components/Agent";
import { Tabs } from "@/app/components/Tabs";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Agent } from "@/lib/spacetraders/agent";
import { useAgent } from "@/app/context/AgentContext";
import { Container, Title } from "./AgentsPage.styles";
import { Slide, SlideView } from "@/app/components/Slide";

export type AgentPageMode = 'select' | 'register' | 'add';

export default function AgentsPage() {
  const { status } = useSession();
  const router = useRouter();
  const [mode, setMode] = useState<AgentPageMode>('select');
  const [lastMode, setLastMode] = useState<AgentPageMode>('select');

  // AGENT CONTEXT
  const {
    agents,
    agentsLoading,
    agentsError,
    addAgent,
    removeAgent,
    selectedAgent,
    setSelectedAgent,
  } = useAgent();

  // UI state for removing
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [removeError, setRemoveError] = useState("");

  // UI state for add existing
  const [addLoading, setAddLoading] = useState(false);
  const [addSuccess, setAddSuccess] = useState("");
  const [addError, setAddError] = useState("");

  // Add Existing Agent handler (wraps context addAgent)
  const handleAddExistingAgent = async (symbol: string, token: string) => {
    setAddSuccess("");
    setAddError("");
    setAddLoading(true);
    try {
      await addAgent(symbol, token);
      setAddSuccess(`Agent '${symbol}' added!`);
    } catch (err: any) {
      setAddError(err.message || "Failed to add agent.");
    } finally {
      setAddLoading(false);
    }
  };

  // Remove agent handler (wraps context removeAgent)
  const handleRemoveAgent = async (agent: Agent) => {
    setRemoveError("");
    setRemovingId(agent.id);
    try {
      await removeAgent(agent);
    } catch (err: any) {
      setRemoveError(err.message || "Failed to remove agent.");
    } finally {
      setRemovingId(null);
    }
  };

  // Determine slide direction for three tabs
  const modeOrder = ['select', 'add', 'register'] as const;
  const activeIndex = modeOrder.indexOf(mode);
  const direction =
    modeOrder.indexOf(mode) > modeOrder.indexOf(lastMode) ? 'right' : 'left';

  const handleToggle = (newMode: string) => {
    if (newMode !== mode) setLastMode(mode);
    setMode(newMode as AgentPageMode);
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/");
    }
  }, [status, router]);

  return (
    <Container>
      <Title>Agent Management</Title>
      <Tabs
        tabs={[
          { label: 'Select Agent', value: 'select' },
          { label: 'Add Existing Agent', value: 'add' },
          { label: 'Register Agent', value: 'register' },
        ]}
        active={mode}
        onChange={handleToggle}
      />
      <Slide activeIndex={activeIndex} direction={direction}>
        {/* @ts-expect-error Props injected by Slide */}
        <SlideView>
          {agentsLoading ? (
            <div>Loading agents...</div>
          ) : agentsError ? (
            <div style={{ color: 'red' }}>Error: {agentsError}</div>
          ) : (
            <>
              {removeError && <div style={{ color: 'red', marginBottom: '1rem' }}>{removeError}</div>}
              <AgentSelector
                agents={agents}
                onRemove={handleRemoveAgent}
                removingId={removingId}
                selectedAgent={selectedAgent}
                setSelectedAgent={setSelectedAgent}
              />
            </>
          )}
        </SlideView>
        {/* @ts-expect-error Props injected by Slide */}
        <SlideView>
          <RegisterAgentForm />
        </SlideView>
        {/* @ts-expect-error Props injected by Slide */}
        <SlideView>
          <AddExistingAgentForm
            onAgentAdded={handleAddExistingAgent}
            loading={addLoading}
            success={addSuccess}
            error={addError}
          />
        </SlideView>
      </Slide>
    </Container>
  );
} 