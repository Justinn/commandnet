"use client";

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { AgentSelector } from "./AgentSelector";
import { RegisterAgentForm } from "./RegisterAgentForm";
import { AddExistingAgentForm } from "./AddExistingAgentForm";
import { Tabs, Tab } from "@/app/components/Tabs";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Agent } from "@/lib/spacetraders/agent";
import { AgentApiEndpoint } from "@/lib/constants";
import { useAgent } from "@/app/components/AgentContext";

const Container = styled.div`
  width: 100%;
  max-width: 60rem;
  margin: 0 auto;
  padding: 2.5rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  box-sizing: border-box;
  @media (max-width: 600px) {
    padding: 1.2rem 0.5rem;
    height: 100dvh;
  }
`;

const Title = styled.h2`
  color: ${({ theme }) => theme.colors.primary};
  font-family: var(--font-share-tech-mono);
  font-size: 2.2rem;
  font-weight: 800;
  margin-bottom: 2.5rem;
  text-align: center;
  text-shadow: 0 0 1.2rem ${({ theme }) => theme.colors.primary};
  @media (max-width: 600px) {
    font-size: 1.3rem;
    margin-bottom: 1.2rem;
  }
`;

const SlideWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 56rem;
  flex: 1 1 auto;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  margin: 0 auto;
  border: 0.12rem solid ${({ theme }) => theme.colors.primary};
  border-radius: 0.7rem;
  box-shadow: 0 0 1.2rem ${({ theme }) => theme.colors.primary}22;
  background: ${({ theme }) => theme.colors.background};
  /* Custom scrollbar styles */
  &::-webkit-scrollbar {
    width: 0.7rem;
    background: ${({ theme }) => theme.colors.background};
    border-radius: 0.7rem;
  }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.primary};
    border-radius: 0.7rem;
    box-shadow: 0 0 0.7rem ${({ theme }) => theme.colors.primary};
    border: 2px solid ${({ theme }) => theme.colors.background};
  }
  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.background};
    border-radius: 0.7rem;
  }
  /* Firefox */
  scrollbar-width: thin;
  scrollbar-color: ${({ theme }) => theme.colors.primary} ${({ theme }) => theme.colors.background};
  @media (max-width: 600px) {
    height: 100%;
    max-width: 100vw;
  }
`;

const SlideView = styled.div<{ $active: boolean; $direction: 'left' | 'right' }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  transition: transform 0.45s cubic-bezier(0.7, 0.2, 0.2, 1), opacity 0.3s;
  transform: ${({ $active, $direction }) => {
    if ($active) return 'translateX(0%)';
    return $direction === 'right' ? 'translateX(-100%)' : 'translateX(100%)';
  }};
  opacity: ${({ $active }) => ($active ? 1 : 0)};
  pointer-events: ${({ $active }) => ($active ? 'auto' : 'none')};
`;

export default function AgentsPage() {
  const { status } = useSession();
  const router = useRouter();
  const [mode, setMode] = useState<'select' | 'register' | 'add'>('select');
  const [lastMode, setLastMode] = useState<'select' | 'register' | 'add'>('select');

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
  const direction =
    modeOrder.indexOf(mode) > modeOrder.indexOf(lastMode) ? 'right' : 'left';

  const handleToggle = (newMode: string) => {
    if (newMode !== mode) setLastMode(mode);
    setMode(newMode as 'select' | 'register' | 'add');
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
      <SlideWrapper>
        <SlideView $active={mode === 'select'} $direction={direction}>
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
        <SlideView $active={mode === 'register'} $direction={direction}>
          <RegisterAgentForm />
        </SlideView>
        <SlideView $active={mode === 'add'} $direction={direction}>
          <AddExistingAgentForm
            onAgentAdded={handleAddExistingAgent}
            loading={addLoading}
            success={addSuccess}
            error={addError}
          />
        </SlideView>
      </SlideWrapper>
    </Container>
  );
} 