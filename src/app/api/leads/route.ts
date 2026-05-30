import { NextRequest, NextResponse } from "next/server";
import { leadSchema } from "@/lib/schemas";
import { forwardToCRM } from "@/lib/crm";
import { sendLeadNotification } from "@/lib/email";
import { insertLead, updateDeliveryStatus } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = leadSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const lead = result.data;
    const timestamp = new Date().toISOString();

    // 1. Save to database FIRST so we never lose a lead, even if CRM/email fail.
    const leadId = await insertLead({
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      loanPurpose: lead.loanPurpose,
      estimatedAmount: lead.estimatedAmount,
      preferredContact: lead.preferredContact,
      bestTimeToCall: lead.bestTimeToCall,
      propertyType: (body.propertyType as string | undefined) ?? undefined,
      propertyZip: (body.propertyZip as string | undefined) ?? undefined,
      firstTimeBuyer: (body.firstTimeBuyer as string | undefined) ?? undefined,
      timeline: (body.timeline as string | undefined) ?? undefined,
      source: lead.source,
      utm: lead.utm as Record<string, string> | undefined,
      rawPayload: body,
    });

    // 2. Forward to CRM and send email in parallel.
    const [crmResult, emailResult] = await Promise.all([
      forwardToCRM({ type: "lead", data: lead, timestamp }),
      sendLeadNotification({ ...lead, timestamp }),
    ]);

    // 3. Persist delivery outcomes so failed deliveries can be retried.
    if (leadId) {
      await updateDeliveryStatus("leads", leadId, crmResult, emailResult);
    }

    return NextResponse.json({
      success: true,
      message: "Lead received successfully",
      persisted: leadId !== null,
    });
  } catch (err) {
    console.error("/api/leads error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
