interface CRMPayload {
  type: "lead" | "application";
  data: Record<string, unknown>;
  timestamp: string;
}

export async function forwardToCRM(payload: CRMPayload): Promise<boolean> {
  const url = process.env.CRM_API_URL;
  const key = process.env.CRM_API_KEY;

  if (!url || !key) {
    console.warn("CRM not configured — skipping forward");
    return false;
  }

  const maxRetries = 3;
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
      if (res.ok) return true;
      console.error(`CRM attempt ${attempt} failed: ${res.status}`);
    } catch (err) {
      console.error(`CRM attempt ${attempt} error:`, err);
    }
    if (attempt < maxRetries) {
      await new Promise((r) => setTimeout(r, 1000 * Math.pow(2, attempt)));
    }
  }
  return false;
}
