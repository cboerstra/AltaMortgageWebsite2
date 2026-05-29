import { NextRequest, NextResponse } from "next/server";
import { leadSchema } from "@/lib/schemas";
import { forwardToCRM } from "@/lib/crm";
import { sendLeadNotification } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = leadSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: "Validation failed", details: result.error.flatten() }, { status: 400 });
    }

    const lead = result.data;
    const timestamp = new Date().toISOString();

    // Forward to CRM and send email in parallel
    const crmPromise = forwardToCRM({ type: "lead", data: lead, timestamp });
    const emailPromise = sendLeadNotification({ ...lead, timestamp });

    await Promise.allSettled([crmPromise, emailPromise]);

    return NextResponse.json({ success: true, message: "Lead received successfully" });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
