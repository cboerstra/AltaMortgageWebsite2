import { NextRequest, NextResponse } from "next/server";
import { applicationSchema } from "@/lib/schemas";
import { forwardToCRM } from "@/lib/crm";
import { sendApplicationNotification } from "@/lib/email";
import { generateRefNumber } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = applicationSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: "Validation failed", details: result.error.flatten() }, { status: 400 });
    }

    const application = result.data;
    const referenceNumber = generateRefNumber();
    const timestamp = new Date().toISOString();

    // Redact SSN for CRM (send only last 4 if provided)
    const crmData = {
      ...application,
      ssn: application.ssn ? `***-**-${application.ssn.slice(-4)}` : undefined,
      referenceNumber,
      timestamp,
    };

    const crmPromise = forwardToCRM({ type: "application", data: crmData, timestamp });
    const emailPromise = sendApplicationNotification(crmData, referenceNumber);

    await Promise.allSettled([crmPromise, emailPromise]);

    return NextResponse.json({ success: true, referenceNumber });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
