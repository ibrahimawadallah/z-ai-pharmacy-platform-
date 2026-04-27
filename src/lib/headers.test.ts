import { describe, it, expect } from "vitest";

describe("Security Headers Implementation", () => {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  it("should return the X-Content-Type-Options: nosniff header on API routes", async () => {
    // Testing the health endpoint as a baseline for security headers
    const response = await fetch(`${baseUrl}/api/health`);
    
    const contentTypeOptions = response.headers.get("x-content-type-options");
    
    expect(contentTypeOptions).toBe("nosniff");
  });
});