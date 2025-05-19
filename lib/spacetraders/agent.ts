// TypeScript type for a SpaceTraders Agent
export type Agent = {
  id: string; // Internal unique ID
  accountId: string;
  symbol: string;
  headquarters: string;
  credits: number;
  startingFaction: string;
  shipCount: number;
  token: string; // Add token property to match backend and DB
}; 