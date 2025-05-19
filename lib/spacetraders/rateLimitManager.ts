import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

/**
 * RateLimitManager (Singleton)
 *
 * This class manages a global (IP-based) rate limit for the SpaceTraders API using Upstash Redis.
 * The rate limit state is stored in Redis, making it effective across all serverless instances and deployments.
 *
 * Usage:
 *   await RateLimitManager.getInstance().waitIfRateLimited();
 *   await RateLimitManager.getInstance().setGlobalRateLimitReset(resetTime);
 *
 * This ensures that all users and all app instances respect the same global rate limit window.
 */
class RateLimitManager {
  private static instance: RateLimitManager;
  private static GLOBAL_RATE_LIMIT_KEY = 'globalRateLimitReset';

  private constructor() {}

  public static getInstance(): RateLimitManager {
    if (!RateLimitManager.instance) {
      RateLimitManager.instance = new RateLimitManager();
    }
    return RateLimitManager.instance;
  }

  public async setGlobalRateLimitReset(resetTime: number) {
    const current = await redis.get<number>(RateLimitManager.GLOBAL_RATE_LIMIT_KEY);
    if (!current || resetTime > current) {
      await redis.set(RateLimitManager.GLOBAL_RATE_LIMIT_KEY, resetTime);
    }
  }

  public async clearGlobalRateLimitReset() {
    await redis.del(RateLimitManager.GLOBAL_RATE_LIMIT_KEY);
  }

  public async getGlobalRateLimitReset(): Promise<number | null> {
    const value = await redis.get<number>(RateLimitManager.GLOBAL_RATE_LIMIT_KEY);
    return value ?? null;
  }

  public async waitIfRateLimited() {
    const reset = await this.getGlobalRateLimitReset();
    if (reset && Date.now() < reset) {
      const waitTime = reset - Date.now();
      if (waitTime > 0) {
        await new Promise(res => setTimeout(res, waitTime));
      }
      await this.clearGlobalRateLimitReset();
    }
  }
}

export default RateLimitManager; 