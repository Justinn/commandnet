import { SpaceTradersClient } from '@/lib/spacetraders/client';  

// Mock Upstash Redis client
jest.mock('@upstash/redis', () => {
  const mRedis = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
  };
  return { Redis: jest.fn(() => mRedis) };
});


// Helper to mock Headers object
function mockHeaders(headersObj: Record<string, string | null>) {
  return {
    get: (name: string) => headersObj[name.toLowerCase()] ?? null,
    entries: () => Object.entries(headersObj),
  };
}

// Mock fetch globally
const globalAny: any = global;
const { Redis } = require('@upstash/redis');
const redisMock = new Redis();

beforeEach(() => {
  jest.resetAllMocks();
  redisMock.get.mockReset();
  redisMock.set.mockReset();
  redisMock.del.mockReset();
  // Default: no global rate limit set
  redisMock.get.mockResolvedValue(null);
});

describe('SpaceTradersClient', () => {
  // Test that requests are processed in the order they are made
  it('processes requests in order', async () => {
    const fetchMock = jest.fn()
      .mockResolvedValueOnce({ ok: true, json: async () => ({ result: 1 }), headers: mockHeaders({}), status: 200 })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ result: 2 }), headers: mockHeaders({}), status: 200 });
    globalAny.fetch = fetchMock;
    const client = new SpaceTradersClient('FAKE_TOKEN');
    const p1 = client.request('/test1');
    const p2 = client.request('/test2');
    const r1 = await p1;
    const r2 = await p2;
    expect(r1).toEqual({ result: 1 });
    expect(r2).toEqual({ result: 2 });
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[0][0]).toContain('/test1');
    expect(fetchMock.mock.calls[1][0]).toContain('/test2');
  });

  // Test that the client pauses the request queue on rate limit (429), waits for the reset time, and then resumes processing
  it('pauses queue on rate limit and resumes after reset', async () => {
    jest.useFakeTimers();
    const now = Date.now();
    jest.spyOn(Date, 'now').mockImplementation(() => now);
    // First call returns 429 with X-RateLimit-Reset header 2 seconds in the future
    const fetchMock = jest.fn()
      .mockResolvedValueOnce({
        ok: false,
        status: 429,
        headers: mockHeaders({ 'x-ratelimit-reset': ((now / 1000) + 2).toString() }),
        json: async () => ({}),
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: mockHeaders({}),
        json: async () => ({ result: 'after-wait' }),
      });
    globalAny.fetch = fetchMock;
    const client = new SpaceTradersClient('FAKE_TOKEN');
    const p = client.request('/rate-limited');
    // First call should throw, but queue should pause
    await expect(p).rejects.toThrow('Rate limit exceeded');
    // Next request should be queued and only processed after 2s
    const p2 = client.request('/after-reset');
    // Fast-forward timers by 2 seconds
    jest.advanceTimersByTime(2000);
    await jest.runOnlyPendingTimersAsync();
    await Promise.resolve(); // flush microtasks
    const r2 = await p2;
    expect(r2).toEqual({ result: 'after-wait' });
    expect(fetchMock).toHaveBeenCalledTimes(2);
    jest.useRealTimers();
  }, 10000);
}); 