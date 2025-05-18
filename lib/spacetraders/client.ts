import * as Sentry from '@sentry/nextjs';
import RateLimitManager from '@/lib/spacetraders/rateLimitManager';

/**
 * SpaceTradersClient
 *
 * This file provides a client for interacting with the SpaceTraders API.
 * It manages authentication, request queuing, and distributed rate limiting automatically.
 *
 * Key features:
 * - Authenticates requests using a bearer token (token can be updated at runtime)
 * - Queues requests to ensure they are processed in order
 * - Handles API rate limiting (per token and global/IP) by pausing and resuming requests as needed
 * - Global rate limiting is distributed and enforced using Upstash Redis, making it robust for serverless and multi-instance deployments
 * - Captures errors and exceptions with Sentry for observability
 *
 * Usage:
 *   const client = new SpaceTradersClient('YOUR_TOKEN');
 *   client.setToken('NEW_TOKEN'); // Change token at runtime
 *   const data = await client.request('/my/ships');
 *
 * This client is designed for use in the CommandNet project to automate and interact with the SpaceTraders game API.
 */

export class SpaceTradersClient {
  // Queue to hold pending requests
  private requestQueue: Array<() => void> = [];
  private processing = false;

  // Rate limiting state (timestamp in ms)
  private rateLimitReset: number | null = null;

  // API token for authentication
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  /**
   * Update the authentication token for future requests.
   * @param newToken The new bearer token to use.
   */
  public setToken(newToken: string) {
    this.token = newToken;
  }

  /**
   * Make an authenticated request to the SpaceTraders API.
   * @param endpoint The API endpoint (e.g., '/my/ships')
   * @param options Fetch options (method, body, etc.)
   */
  public async request(endpoint: string, options: RequestInit = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      const task = async () => {
        try {
          const result = await this._doRequest(endpoint, options);
          resolve(result);
        } catch (err) {
          reject(err);
        }
      };
      this.requestQueue.push(task);
      this._processQueue();
    });
  }

  // Private: Actually perform the fetch
  private async _doRequest(endpoint: string, options: RequestInit): Promise<any> {
    // Wait for global (IP-based) rate limit if active
    await RateLimitManager.getInstance().waitIfRateLimited();

    const url = `https://api.spacetraders.io/v2${endpoint}`;
    const headers = {
      ...(options.headers || {}),
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    };
    let response;
    try {
      response = await fetch(url, { ...options, headers });
    } catch (err) {
      // Network or fetch error
      Sentry.captureException(err, {
        extra: {
          endpoint,
          options,
        },
      });
      throw err;
    }

    // Check for rate limit headers
    const rateLimitResetHeader = response.headers.get('X-RateLimit-Reset');
    if (rateLimitResetHeader) {
      // The header is a unix timestamp (seconds), convert to ms
      const resetTime = parseInt(rateLimitResetHeader, 10) * 1000;
      if (!isNaN(resetTime)) {
        this.rateLimitReset = resetTime;
      }
    }

    if (response.status === 429) {
      // Rate limit hit, set a delay based on header or fallback to 1s
      let resetMs = this.rateLimitReset && this.rateLimitReset > Date.now()
        ? this.rateLimitReset
        : Date.now() + 1000;
      this.rateLimitReset = resetMs;
      // Update global rate limit as well
      await RateLimitManager.getInstance().setGlobalRateLimitReset(resetMs);
      Sentry.captureException(new Error('Rate limit exceeded'), {
        extra: {
          endpoint,
          status: response.status,
          headers: Object.fromEntries(response.headers.entries()),
        },
      });
      throw new Error('Rate limit exceeded');
    }

    if (!response.ok) {
      // Log other API errors
      const error = new Error(`API error: ${response.status}`);
      Sentry.captureException(error, {
        extra: {
          endpoint,
          status: response.status,
          headers: Object.fromEntries(response.headers.entries()),
        },
      });
      throw error;
    }

    return response.json();
  }

  // Private: Process the request queue
  private async _processQueue() {
    if (this.processing) return;
    this.processing = true;
    while (this.requestQueue.length > 0) {
      // Wait for global (IP-based) rate limit if active
      await RateLimitManager.getInstance().waitIfRateLimited();
      if (this.rateLimitReset && Date.now() < this.rateLimitReset) {
        // Wait until rate limit resets
        await new Promise(res => setTimeout(res, this.rateLimitReset! - Date.now()));
        this.rateLimitReset = null;
      }
      const task = this.requestQueue.shift();
      if (task) {
        await task();
      }
    }
    this.processing = false;
  }
} 