import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/db';
import { SpaceTradersClient, SpaceTradersEndpoint } from '@/lib/spacetraders/client';
import * as Sentry from '@sentry/nextjs';

// POST /api/agents/register
// Registers a new SpaceTraders agent using the SpaceTraders API, saves it to the database, and associates it with the authenticated user.
// Expects { symbol, faction, token } in the request body. Returns the created agent as JSON, or an error JSON on failure.
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { symbol, faction, token } = await req.json();
    if (!symbol || !faction || !token) {
      return NextResponse.json({ error: 'Missing symbol, faction, or token' }, { status: 400 });
    }

    // Call SpaceTraders API to register a new agent
    let data;
    try {
      const stClient = new SpaceTradersClient(token);
      data = await stClient.request(SpaceTradersEndpoint.Register, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol, faction })
      });
    } catch (err: any) {
      if (err && err.message) {
        if (err.message.includes('401') || err.message.toLowerCase().includes('unauthorized')) {
          return NextResponse.json({
            error: 'Agent registration now requires an existing SpaceTraders token. Please register your first agent directly at https://spacetraders.io, then add it to CommandNet using the token.'
          }, { status: 401 });
        }
        if (err.message.startsWith('API error:')) {
          console.error(err);
          return NextResponse.json({
            error: 'Failed to register agent. Note: SpaceTraders now requires a valid token to register new agents. If you do not have an agent, please register at https://spacetraders.io.'
          }, { status: 400 });
        }
      }
      return NextResponse.json({ error: 'Failed to reach SpaceTraders API' }, { status: 502 });
    }
    if (!data || !data.token || !data.agent) {
      return NextResponse.json({ error: 'Invalid response from SpaceTraders API' }, { status: 500 });
    }

    // Get user from DB
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Save agent to DB
    const dbAgent = await prisma.agent.create({
      data: {
        accountId: data.agent.accountId,
        symbol: data.agent.symbol,
        token: data.token,
        startingFaction: data.agent.startingFaction,
        headquarters: data.agent.headquarters,
        credits: data.agent.credits,
        shipCount: data.agent.shipCount,
        userId: user.id,
      },
    });

    return NextResponse.json(dbAgent);
  } catch (err) {
    Sentry.captureException(err);
    return NextResponse.json({ error: 'Internal server error', details: String(err) }, { status: 500 });
  }
} 