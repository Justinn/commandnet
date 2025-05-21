import React from "react";
import { render, waitFor, act } from "@testing-library/react";
import { AgentProvider, useAgent } from "../AgentContext";

// Mock AgentApiEndpoint
jest.mock("@/lib/constants", () => ({
  AgentApiEndpoint: {
    Agents: "/api/agents",
    AddExisting: "/api/agents/add-existing",
  },
}));

// Mock Agent type
const mockAgents = [
  { id: 1, symbol: "AGENT1", token: "token1" },
  { id: 2, symbol: "AGENT2", token: "token2" },
];

// Helper test component
function TestComponent() {
  const {
    agents,
    agentsLoading,
    agentsError,
    selectedAgent,
    setSelectedAgent,
    addAgent,
    removeAgent,
  } = useAgent();
  return (
    <div>
      <div data-testid="loading">{agentsLoading ? "loading" : "loaded"}</div>
      <div data-testid="error">{agentsError}</div>
      <div data-testid="agents">{agents.map((a) => a.symbol).join(",")}</div>
      <div data-testid="selected">{selectedAgent?.symbol || "none"}</div>
      <button onClick={() => setSelectedAgent(agents[1])} data-testid="select">Select AGENT2</button>
      <button onClick={() => addAgent("NEWAGENT", "newtoken").catch(() => {})} data-testid="add">Add Agent</button>
      <button onClick={() => { if (agents.length > 0) removeAgent(agents[0]).catch(() => {}); }} data-testid="remove">Remove AGENT1</button>
    </div>
  );
}

describe("AgentContext", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("fetches and provides agents, selects first by default", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => mockAgents,
    });
    const { getByTestId } = render(
      <AgentProvider>
        <TestComponent />
      </AgentProvider>
    );
    expect(getByTestId("loading").textContent).toBe("loading");
    await waitFor(() => expect(getByTestId("loading").textContent).toBe("loaded"));
    expect(getByTestId("agents").textContent).toBe("AGENT1,AGENT2");
    expect(getByTestId("selected").textContent).toBe("AGENT1");
  });

  it("handles fetch error", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "fail" }),
    });
    const { getByTestId } = render(
      <AgentProvider>
        <TestComponent />
      </AgentProvider>
    );
    await waitFor(() => expect(getByTestId("error").textContent).toBe("fail"));
  });

  it("can select another agent", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => mockAgents,
    });
    const { getByTestId } = render(
      <AgentProvider>
        <TestComponent />
      </AgentProvider>
    );
    await waitFor(() => {
      expect(getByTestId("agents").textContent).toContain("AGENT2");
    });
    act(() => {
      getByTestId("select").click();
    });
    await waitFor(() => {
      expect(getByTestId("selected").textContent).toBe("AGENT2");
    });
  });

  it("can add an agent", async () => {
    global.fetch = jest.fn()
      .mockResolvedValueOnce({ ok: true, json: async () => mockAgents })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ id: 3, symbol: "NEWAGENT", token: "newtoken" }) });
    const { getByTestId } = render(
      <AgentProvider>
        <TestComponent />
      </AgentProvider>
    );
    await waitFor(() => getByTestId("add"));
    await act(async () => {
      getByTestId("add").click();
    });
    await waitFor(() => {
      expect(getByTestId("agents").textContent).toContain("NEWAGENT");
      expect(getByTestId("selected").textContent).toBe("NEWAGENT");
    });
  });

  it("handles add agent error", async () => {
    global.fetch = jest.fn()
      .mockResolvedValueOnce({ ok: true, json: async () => mockAgents })
      .mockResolvedValueOnce({ ok: false, json: async () => ({ error: "addfail" }) });
    const { getByTestId } = render(
      <AgentProvider>
        <TestComponent />
      </AgentProvider>
    );
    await waitFor(() => getByTestId("add"));
    await act(async () => {
      try {
        await getByTestId("add").click();
      } catch (e) {}
    });
    await waitFor(() => {
      expect(getByTestId("error").textContent).toContain("addfail");
    });
  });

  it("can remove an agent", async () => {
    global.fetch = jest.fn()
      .mockResolvedValueOnce({ ok: true, json: async () => mockAgents })
      .mockResolvedValueOnce({ ok: true, json: async () => ({}) });
    const { getByTestId } = render(
      <AgentProvider>
        <TestComponent />
      </AgentProvider>
    );
    await waitFor(() => {
      expect(getByTestId("agents").textContent).toContain("AGENT1");
    });
    await act(async () => {
      getByTestId("remove").click();
    });
    await waitFor(() => {
      expect(getByTestId("agents").textContent).not.toContain("AGENT1");
    });
  });

  it("handles remove agent error", async () => {
    global.fetch = jest.fn()
      .mockResolvedValueOnce({ ok: true, json: async () => mockAgents })
      .mockResolvedValueOnce({ ok: false, json: async () => ({ error: "removefail" }) });
    const { getByTestId } = render(
      <AgentProvider>
        <TestComponent />
      </AgentProvider>
    );
    await waitFor(() => {
      expect(getByTestId("agents").textContent).toContain("AGENT1");
    });
    await act(async () => {
      getByTestId("remove").click();
    });
    await waitFor(() => {
      expect(getByTestId("error").textContent).toBe("removefail");
    });
  });

  it("throws if useAgent is used outside provider", () => {
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<TestComponent />)).toThrow();
    spy.mockRestore();
  });
});
