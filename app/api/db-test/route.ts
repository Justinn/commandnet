import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(req: NextRequest) {
  const now = await prisma.$queryRaw<{ now: Date }[]>`SELECT NOW()`
  return NextResponse.json({ time: now[0].now })
}