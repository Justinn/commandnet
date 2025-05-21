"use client";

import React from "react";
import { FaTrash } from 'react-icons/fa';
import {
  List,
  ContentWrapper,
  AgentCard,
  AgentHeader,
  AgentSymbol,
  ActiveBadge,
  AgentDetails,
  RemoveButton,
  DialogOverlay,
  DialogBox,
  DialogTitle,
  DialogActions,
  DialogButton,
  CancelButton
} from "./AgentSelector.styles";
import { Agent } from "@/lib/spacetraders/agent";

export function AgentSelector({
  agents,
  onRemove,
  removingId,
  selectedAgent,
  setSelectedAgent,
}: {
  agents: Agent[];
  onRemove: (agent: Agent) => void;
  removingId?: string | null;
  selectedAgent: Agent | null;
  setSelectedAgent: (agent: Agent) => void;
}) {
  const [pendingRemove, setPendingRemove] = React.useState<Agent | null>(null);

  if (!agents.length) {
    return <div>No agents found for your account.</div>;
  }

  return (
    <>
      <List>
        <ContentWrapper>
          {agents.map((agent) => (
            <AgentCard
              key={agent.id}
              $active={selectedAgent?.id === agent.id}
              className={removingId === agent.id ? 'slide-out' : ''}
              onClick={() => setSelectedAgent(agent)}
              tabIndex={0}
              aria-selected={selectedAgent?.id === agent.id}
            >
              <AgentHeader>
                <AgentSymbol>{agent.symbol}</AgentSymbol>
                {selectedAgent?.id === agent.id && <ActiveBadge>Active</ActiveBadge>}
              </AgentHeader>
              <AgentDetails>
                <span key="hq">HQ: {agent.headquarters}</span>
                <span key="credits">Credits: {agent.credits.toLocaleString()}</span>
                <span key="faction">Faction: {agent.startingFaction}</span>
                <span key="ships">Ships: {agent.shipCount}</span>
              </AgentDetails>
              <RemoveButton
                title="Remove agent"
                onClick={e => {
                  e.stopPropagation();
                  setPendingRemove(agent);
                }}
                aria-label={`Remove agent ${agent.symbol}`}
              >
                <FaTrash />
              </RemoveButton>
            </AgentCard>
          ))}
        </ContentWrapper>
      </List>
      {pendingRemove && (
        <DialogOverlay>
          <DialogBox>
            <DialogTitle>Remove Agent?</DialogTitle>
            <div style={{ marginBottom: '0.7rem' }}>
              Are you sure you want to remove <b>{pendingRemove.symbol}</b> from your account?
            </div>
            <DialogActions>
              <CancelButton onClick={() => setPendingRemove(null)}>Cancel</CancelButton>
              <DialogButton onClick={() => {
                onRemove(pendingRemove);
                setPendingRemove(null);
              }}>Remove</DialogButton>
            </DialogActions>
          </DialogBox>
        </DialogOverlay>
      )}
    </>
  );
} 