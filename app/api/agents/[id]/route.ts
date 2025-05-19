import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/db';

// DELETE /api/agents/[id]
// Deletes the agent with the specified id if it belongs to the authenticated user.
// Returns 204 No Content on success, or an error JSON on failure.
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const agentId = parseInt(params.id, 10);
  if (isNaN(agentId)) {
    return NextResponse.json({ error: 'Invalid agent id' }, { status: 400 });
  }

  try {
    // Find the agent and ensure it belongs to the user
    const agent = await prisma.agent.findUnique({
      where: { id: agentId },
    });
    if (!agent || agent.userId !== user.id) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
    }

    await prisma.agent.delete({ where: { id: agentId } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete agent' }, { status: 500 });
  }
} 