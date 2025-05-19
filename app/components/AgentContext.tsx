"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { Agent } from "@/lib/spacetraders/agent";
import { AgentApiEndpoint } from "@/lib/constants";

interface AgentContextType {
  agents: Agent[];
  agentsLoading: boolean;
  agentsError: string | null;
  selectedAgent: Agent | null;
  setSelectedAgent: (agent: Agent | null) => void;
  addAgent: (symbol: string, token: string) => Promise<void>;
  removeAgent: (agent: Agent) => Promise<void>;
}

const AgentContext = createContext<AgentContextType | undefined>(undefined);

export function AgentProvider({ children }: { children: React.ReactNode }) {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [agentsLoading, setAgentsLoading] = useState(true);
  const [agentsError, setAgentsError] = useState<string | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  // Fetch agents on mount
  useEffect(() => {
    async function fetchAgents() {
      setAgentsLoading(true);
      setAgentsError(null);
      try {
        const res = await fetch(AgentApiEndpoint.Agents);
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to fetch agents");
        }
        const data: Agent[] = await res.json();
        setAgents(data);
        // Auto-select the first agent if none selected
        setSelectedAgent((prev) => prev || data[0] || null);
      } catch (err: any) {
        setAgentsError(err.message || "Unknown error");
      } finally {
        setAgentsLoading(false);
      }
    }
    fetchAgents();
  }, []);

  // Add Existing Agent
  const addAgent = useCallback(async (symbol: string, token: string) => {
    setAgentsError(null);
    try {
      const res = await fetch(AgentApiEndpoint.AddExisting, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbol, token }),
      });
      let data: Agent | { error: string };
      if (res.ok) {
        data = await res.json() as Agent;
      } else {
        data = await res.json();
      }
      if (!res.ok) {
        throw new Error((data as { error: string }).error || "Failed to add agent.");
      }
      setAgents((prev) => [...prev, data as Agent]);
      setSelectedAgent(data as Agent);
    } catch (err: any) {
      setAgentsError(err.message || "Failed to add agent.");
      throw err;
    }
  }, []);

  // Remove Agent
  const removeAgent = useCallback(async (agent: Agent) => {
    setAgentsError("");
    try {
      const res = await fetch(`${AgentApiEndpoint.Agents}/${agent.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to remove agent.");
      }
      setAgents(prev => prev.filter(a => a.id !== agent.id));
      setSelectedAgent(prev => (prev?.id === agent.id ? null : prev));
    } catch (err: any) {
      setAgentsError(err.message || "Failed to remove agent.");
      throw err;
    }
  }, []);

  const value = useMemo(() => ({
    agents,
    agentsLoading,
    agentsError,
    selectedAgent,
    setSelectedAgent,
    addAgent,
    removeAgent,
  }), [agents, agentsLoading, agentsError, selectedAgent, addAgent, removeAgent]);

  return (
    <AgentContext.Provider value={value}>
      {children}
    </AgentContext.Provider>
  );
}

export function useAgent() {
  const ctx = useContext(AgentContext);
  if (!ctx) throw new Error("useAgent must be used within an AgentProvider");
  return ctx;
} 