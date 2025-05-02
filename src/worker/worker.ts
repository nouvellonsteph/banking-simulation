import { default as handler } from "../../.open-next/worker.js";

// Define CloudflareEnv interface to include the API_BASE_URL
interface CloudflareEnv {
  API_BASE_URL?: string;
  [key: string]: unknown;
}

// Default API base URL if not set in environment
const DEFAULT_API_BASE_URL = 'https://virgin.justalittlebyte.ovh/api';

export default {
  fetch: handler.fetch,

  /**
   * Scheduled Handler
   *
   * Can be tested with:
   * - `wrangler dev --test-scheduled`
   * - `curl "http://localhost:8787/__scheduled?cron=*+*+*+*+*"`
   * @param event
   */
  async scheduled(event, env: CloudflareEnv) {
    console.log("Scheduled event", event);
    
    // Get API base URL from environment or use default
    const apiBaseUrl = env?.API_BASE_URL || DEFAULT_API_BASE_URL;
    console.log(`Using API base URL: ${apiBaseUrl}`);
    
    // Test GET /api/user-profile without API key first
    console.log("\n===== Testing GET /api/user-profile without API key =====");
    await testUserProfileWithoutApiKey(apiBaseUrl);
    
    // API Testing with entropy
    await testApiWithEntropy(apiBaseUrl);
  },
} satisfies ExportedHandler<CloudflareEnv>;

/**
 * Test the API with entropy in request volume, API tokens, and routes/verbs
 * @param apiBaseUrl - The base URL for the API endpoints
 */
async function testApiWithEntropy(apiBaseUrl = DEFAULT_API_BASE_URL) {
  // API tokens available to use
  const API_TOKENS = {
    STANDARD: "vm-api-demo-key-123456",
    PREMIUM: "vm-api-premium-key-789012",
    ADMIN: "vm-api-admin-key-345678"
  };
  
  // API endpoints to test
  const ENDPOINTS = [
    { path: "/api/accounts", supportsBody: true },
    { path: "/api/transactions", supportsBody: true },
    { path: "/api/user-profile", supportsBody: true },
    { path: "/api/payment-methods", supportsBody: true }
  ];
  
  // HTTP methods to test
  const METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"];
  
  // Generate random number of requests (between 10-30)
  const requestCount = Math.floor(Math.random() * 21) + 10;
  console.log(`Executing ${requestCount} API test requests with entropy`);
  
  // Test summary stats
  const stats = {
    totalRequests: requestCount,
    byToken: { standard: 0, premium: 0, admin: 0 } as Record<string, number>,
    byEndpoint: {} as Record<string, number>,
    byMethod: {} as Record<string, number>,
    successCount: 0,
    errorCount: 0
  };
  
  // Initialize stats counters
  ENDPOINTS.forEach(endpoint => {
    stats.byEndpoint[endpoint.path] = 0;
  });
  
  METHODS.forEach(method => {
    stats.byMethod[method] = 0;
  });
  
  // Mock request bodies for different endpoints
  type RequestBodyValue = string | number | boolean;
  const mockRequestBodies: Record<string, Record<string, RequestBodyValue>> = {
    "/api/accounts": { name: "Test Account" },
    "/api/transactions": { accountId: "acc-001", amount: -25.50, description: "Test Transaction" },
    "/api/user-profile": { name: "Test User", email: "test@example.com" },
    "/api/payment-methods": { type: "Card", last4: "1234", expiry: "12/25" }
  };
  
  // Execute requests
  for (let i = 0; i < requestCount; i++) {
    try {
      // Add some randomized delay between requests (0-500ms)
      if (i > 0) {
        const delay = Math.floor(Math.random() * 500);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
      
      // Randomly select token, endpoint, and method
      const tokenType = randomChoice(Object.keys(API_TOKENS));
      const selectedToken = API_TOKENS[tokenType as keyof typeof API_TOKENS];
      const endpoint = randomChoice(ENDPOINTS);
      const method = randomChoice(METHODS);
      
      // Update stats
      stats.byToken[tokenType.toLowerCase()] += 1;
      stats.byEndpoint[endpoint.path] += 1;
      stats.byMethod[method] += 1;
      
      // Build mock request
      const headers = new Headers();
      headers.set("api-key", selectedToken);
      headers.set("Content-Type", "application/json");
      
      const requestInit: RequestInit = {
        method,
        headers
      };
      
      // Add body for methods that support it and if the endpoint supports it
      if ((method === "POST" || method === "PUT" || method === "PATCH") && endpoint.supportsBody) {
        requestInit.body = JSON.stringify(mockRequestBodies[endpoint.path]);
      }
      
      // Log the request being made
      console.log(`[Test ${i+1}/${requestCount}] ${method} ${endpoint.path} with ${tokenType} token`);
      
      // Execute the request (real network request to generate traffic)
      const response = await simulateApiRequest(endpoint.path, requestInit, apiBaseUrl);
      
      if (response.status >= 200 && response.status < 300) {
        stats.successCount += 1;
      } else {
        stats.errorCount += 1;
      }
      
      // Log the response
      console.log(`  Response: ${response.status} ${response.statusText}`);
      
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(`Error executing test request: ${errorMessage}`);
      stats.errorCount += 1;
    }
  }
  
  // Log final test summary
  console.log("\n===== API Test Summary =====");
  console.log(`Total Requests: ${stats.totalRequests}`);
  console.log(`Success: ${stats.successCount}, Errors: ${stats.errorCount}`);
  console.log("\nBy Token:");
  Object.entries(stats.byToken).forEach(([token, count]: [string, number]) => {
    console.log(`  ${token}: ${count} (${Math.round(count/stats.totalRequests*100)}%)`);
  });
  
  console.log("\nBy Endpoint:");
  Object.entries(stats.byEndpoint).forEach(([endpoint, count]: [string, number]) => {
    if (count > 0) {
      console.log(`  ${endpoint}: ${count} (${Math.round(count/stats.totalRequests*100)}%)`);
    }
  });
  
  console.log("\nBy Method:");
  Object.entries(stats.byMethod).forEach(([method, count]: [string, number]) => {
    if (count > 0) {
      console.log(`  ${method}: ${count} (${Math.round(count/stats.totalRequests*100)}%)`);
    }
  });
  console.log("============================");
}

/**
 * Send an actual API request to generate real traffic
 * This makes real fetch calls to the API endpoints
 */
async function simulateApiRequest(endpoint: string, requestInit: RequestInit, baseUrl = DEFAULT_API_BASE_URL): Promise<Response> {
  try {
    // Determine the full URL for the API request
    // If endpoint already starts with http, use it as is, otherwise prepend API base URL
    const url = endpoint.startsWith('http') ? endpoint : `${baseUrl}${endpoint}`;
    
    // Log the actual request being sent
    console.log(`Sending real request to: ${url.toString()}`);
    console.log(`Method: ${requestInit.method}`);
    console.log(`Headers: ${JSON.stringify(Object.fromEntries((requestInit.headers as Headers).entries()))}`);
    
    if (requestInit.body) {
      console.log(`Body: ${requestInit.body}`);
    }
    
    // Make the actual fetch request to the API endpoint
    // Using String(url) to handle both URL objects and string endpoints
    const response = await fetch(String(url), requestInit);
    
    // Log the actual response
    console.log(`Received response: ${response.status} ${response.statusText}`);
    
    // Clone the response to be able to read its body while still returning the response
    const clonedResponse = response.clone();
    try {
      const responseData = await clonedResponse.json();
      console.log(`Response data: ${JSON.stringify(responseData)}`);
    } catch (e) {
      console.log(`Could not parse response as JSON: ${e}`);
    }
    
    return response;
  } catch (error) {
    console.error(`Error making API request: ${error instanceof Error ? error.message : String(error)}`);
    
    // Return a fallback response in case of network errors
    return new Response(JSON.stringify({ 
      error: "Failed to make API request", 
      details: error instanceof Error ? error.message : String(error) 
    }), { 
      status: 500,
      statusText: "Internal Server Error",
      headers: { "Content-Type": "application/json" }
    });
  }
}

/**
 * Test GET /api/user-profile endpoint without an API key
 * This specifically tests the public access to user profile data
 * @param apiBaseUrl - The base URL for the API endpoints
 */
async function testUserProfileWithoutApiKey(apiBaseUrl = DEFAULT_API_BASE_URL): Promise<void> {
  try {
    // Configure request without API key
    const headers = new Headers();
    headers.set("Content-Type", "application/json");
    
    const requestInit: RequestInit = {
      method: "GET",
      headers
    };
    
    console.log("Sending GET request to /api/user-profile without API key");
    
    // Execute the request
    const response = await simulateApiRequest("/api/user-profile", requestInit, apiBaseUrl);
    
    // Log results
    if (response.status >= 200 && response.status < 300) {
      console.log("✅ GET /api/user-profile without API key succeeded");
      console.log(`Response status: ${response.status} ${response.statusText}`);
      
      // Clone the response to read the body
      const clonedResponse = response.clone();
      try {
        const responseData = await clonedResponse.json();
        console.log(`Response data: ${JSON.stringify(responseData)}`);
      } catch (e) {
        console.log(`Could not parse response as JSON: ${e}`);
      }
    } else {
      console.log("❌ GET /api/user-profile without API key failed");
      console.log(`Response status: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`Error testing user profile without API key: ${errorMessage}`);
  }
  
  console.log("===== End of User Profile Test =====\n");
}

/**
 * Randomly select an item from an array
 */
function randomChoice<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export { DOQueueHandler, DOShardedTagCache } from "../../.open-next/worker.js";
