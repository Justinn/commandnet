"use client";

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Agent } from "@/lib/spacetraders/agent";
import { AgentApiEndpoint } from "@/lib/constants";
import { FaTrash } from 'react-icons/fa';

const List = styled.ul`
  width: 100%;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

const ContentWrapper = styled.div`
  padding: 2rem 1.5rem 1.5rem 1.5rem;
  @media (max-width: 600px) {
    padding: 1rem 0.5rem 0.7rem 0.5rem;
  }
`;

const AgentCard = styled.li<{ $active: boolean }>`
  background: ${({ theme, $active }) =>
    $active
      ? `linear-gradient(90deg, ${theme.colors.primary}22 0%, ${theme.colors.primary}11 100%)`
      : theme.colors.background};
  border: 0.12rem solid
    ${({ theme, $active }) =>
      $active ? theme.colors.primary : theme.colors.textSecondary + "33"};
  border-radius: 0.25rem;
  box-shadow: ${({ $active, theme }) =>
    $active ? `0 0 1.2rem ${theme.colors.primary}` : "none"};
  padding: 1.2rem 2rem;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: box-shadow 0.2s, border 0.2s, background 0.2s, transform 0.3s, opacity 0.3s, max-height 0.3s, margin 0.3s, padding 0.3s;
  opacity: ${({ $active }) => ($active ? 1 : 0.85)};
  position: relative;
  &:hover {
    box-shadow: 0 0 1.5rem ${({ theme }) => theme.colors.primary};
    border: 0.12rem solid ${({ theme }) => theme.colors.primary};
  }
  &.slide-out {
    opacity: 0;
    transform: translateX(40%) scale(0.95);
    max-height: 0 !important;
    margin: 0 !important;
    padding-top: 0 !important;
    padding-bottom: 0 !important;
    pointer-events: none;
  }
  @media (max-width: 600px) {
    padding: 0.8rem 0.7rem;
  }
`;

const AgentHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
`;

const AgentSymbol = styled.span`
  font-family: var(--font-share-tech-mono);
  font-size: 1.3rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
`;

const ActiveBadge = styled.span`
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.background};
  font-size: 0.9rem;
  font-weight: 700;
  border-radius: 0.5rem;
  padding: 0.2rem 0.8rem;
  margin-left: 1rem;
  box-shadow: 0 0 0.5rem ${({ theme }) => theme.colors.primary};
`;

const AgentDetails = styled.div`
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 1.05rem;
  display: flex;
  flex-wrap: wrap;
  gap: 1.2rem;
  margin-top: 0.2rem;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #ff4d4f;
  cursor: pointer;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  transition: box-shadow 0.2s, text-shadow 0.2s;
  position: absolute;
  right: 1.2rem;
  bottom: 1.2rem;
  z-index: 2;
  @media (max-width: 600px) {
    right: 0.7rem;
    bottom: 0.7rem;
  }
  &:hover {
    box-shadow: 0 0 0.7rem ${({ theme }) => theme.colors.primary};
    text-shadow: 0 0 0.7rem ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const DialogOverlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.45);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const DialogBox = styled.div`
  background: ${({ theme }) => theme.colors.background};
  border: 2px solid ${({ theme }) => theme.colors.primary};
  border-radius: 0.7rem;
  box-shadow: 0 0 2rem ${({ theme }) => theme.colors.primary}55;
  padding: 2.2rem 2.5rem 1.5rem 2.5rem;
  min-width: 22rem;
  max-width: 90vw;
  text-align: center;
  z-index: 1001;
`;

const DialogTitle = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 1.1rem;
`;

const DialogActions = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 1.5rem;
`;

const DialogButton = styled.button`
  padding: 0.7rem 1.5rem;
  border-radius: 0.4rem;
  border: none;
  font-size: 1.05rem;
  font-family: ${({ theme }) => theme.fonts.main};
  font-weight: 600;
  cursor: pointer;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.background};
  box-shadow: 0 0 0.5rem ${({ theme }) => theme.colors.primary}55;
  transition: background 0.2s, color 0.2s;
  &:hover {
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.primary};
    border: 2px solid ${({ theme }) => theme.colors.primary};
  }
`;

const CancelButton = styled(DialogButton)`
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.primary};
  border: 2px solid ${({ theme }) => theme.colors.primary};
  &:hover {
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.background};
  }
`;

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