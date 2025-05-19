import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/db';
import { SpaceTradersClient, SpaceTradersEndpoint } from '@/lib/spacetraders/client';
import * as Sentry from '@sentry/nextjs';
import { Agent } from '@/lib/spacetraders/agent';

// POST /api/agents/add-existing
// Adds an existing SpaceTraders agent to the authenticated user's account after verifying the agent's token and symbol.
// Returns the created agent as JSON, or an error JSON on failure.
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { symbol, token } = await req.json();
    if (!symbol || !token) {
      return NextResponse.json({ error: 'Missing symbol or token' }, { status: 400 });
    }

    // Verify agent with SpaceTradersClient
    const stClient = new SpaceTradersClient(token);
    let agent: Agent;
    try {
      agent = await stClient.request(SpaceTradersEndpoint.MyAgent);
    } catch (err) {
      return NextResponse.json({ error: 'Invalid token or agent not found' }, { status: 400 });
    }
    if (!agent || agent.symbol.toLowerCase() !== symbol.toLowerCase()) {
      return NextResponse.json({ error: 'Agent symbol does not match token' }, { status: 400 });
    }

    // Get user from DB
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if agent is already associated with an account
    const existingAgent = await prisma.agent.findUnique({ where: { symbol } });
    if (existingAgent) {
      return NextResponse.json({ error: 'Agent already associated with an account.' }, { status: 400 });
    }

    // Create agent
    const dbAgent = await prisma.agent.create({
      data: {
        accountId: agent.accountId,
        symbol,
        token,
        startingFaction: agent.startingFaction,
        headquarters: agent.headquarters,
        credits: agent.credits,
        shipCount: agent.shipCount,
        userId: user.id,
      },
    });

    return NextResponse.json(dbAgent);
  } catch (err) {
    Sentry.captureException(err);
    return NextResponse.json({ error: 'Internal server error', details: String(err) }, { status: 500 });
  }
} 