// Faction type and list for SpaceTraders registration and agent management
export type Faction = {
  symbol: string;
  name: string;
  description: string;
};

export const FACTIONS: Faction[] = [
  { symbol: "COSMIC", name: "Cosmic Federation", description: "A federation of explorers and traders." },
  { symbol: "VOID", name: "Void Collective", description: "A mysterious and secretive faction." },
  { symbol: "GALACTIC", name: "Galactic Empire", description: "A powerful and expansive empire." },
  { symbol: "QUANTUM", name: "Quantum Assembly", description: "Technologically advanced and innovative." },
  { symbol: "DOMINION", name: "Dominion", description: "A militaristic and disciplined faction." },
  { symbol: "ASTRO", name: "Astro Mining Syndicate", description: "Resource-focused and industrial." },
  { symbol: "CORSAIRS", name: "Corsairs", description: "Rogues, pirates, and opportunists." },
  { symbol: "OBSIDIAN", name: "Obsidian Syndicate", description: "Shadowy and influential." },
  { symbol: "AEGIS", name: "Aegis Security", description: "Defenders and protectors." },
  { symbol: "UNITED", name: "United Planets", description: "A coalition of planets working together." },
  { symbol: "SOLITARY", name: "Solitary", description: "Lone wolves and independent agents." },
]; 