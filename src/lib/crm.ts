interface CRMPayload {
  type: "lead" | "application";
  data: Record<string, unknown>;
  timestamp: string;
}

export interface CRMResult {
  status: "sent" | "failed" | "skipped";
  response?: string;
}

export async function forwardToCRM(payload: CRMPayload): Promise<CRMResult> {
  const url = process.env.CRM_API_URL;
  const key = process.env.CRM_API_KEY;

  if (!url || !key) {
    console.warn("CRM not configured — skipping forward");
    return { status: "skipped", response: "CRM_API_URL or CRM_API_KEY not set" };
  }

  const maxRetries = 3;
  let lastError = "Unknown error";

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        return { status: "sent", response: `HTTP ${res.status}` };
      }
      lastError = `HTTP ${res.status}`;
      console.error(`CRM attempt ${attempt} failed: ${res.status}`);
    } catch (err) {
      lastError = err instanceof Error ? err.message : String(err);
      console.error(`CRM attempt ${attempt} error:`, err);
    }
    if (attempt < maxRetries) {
      await new Promise((r) => setTimeout(r, 1000 * Math.pow(2, attempt)));
    }
  }

  return { status: "failed", response: lastError };
}
