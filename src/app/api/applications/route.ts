import { NextRequest, NextResponse } from "next/server";
import { applicationSchema } from "@/lib/schemas";
import { forwardToCRM } from "@/lib/crm";
import { sendApplicationNotification } from "@/lib/email";
import { generateRefNumber } from "@/lib/utils";
import { insertApplication, updateDeliveryStatus } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = applicationSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 400 }
      );
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

    // 1. Save to database FIRST. SSN is stored only as last 4 — never full.
    const ssnLast4 = application.ssn ? application.ssn.slice(-4) : undefined;
    const payloadForStorage = { ...application, ssn: undefined, referenceNumber };

    const applicationId = await insertApplication({
      refNumber: referenceNumber,
      loanPurpose: application.loanPurpose,
      propertyType: application.propertyType,
      propertyUse: application.propertyUse,
      purchasePrice: application.purchasePrice,
      loanAmount: application.loanAmount,
      downPayment: application.downPayment,
      currentBalance: application.currentBalance,
      firstName: application.firstName,
      middleName: application.middleName,
      lastName: application.lastName,
      suffix: application.suffix,
      dateOfBirth: application.dateOfBirth,
      ssnLast4,
      maritalStatus: application.maritalStatus,
      phone: application.phone,
      email: application.email,
      currentStreet: application.currentAddress?.street,
      currentCity: application.currentAddress?.city,
      currentState: application.currentAddress?.state,
      currentZip: application.currentAddress?.zip,
      yearsAtAddress: application.yearsAtAddress,
      housingStatus: application.housingStatus,
      monthlyHousingPayment: application.monthlyHousingPayment,
      employmentStatus: application.employmentStatus,
      employerName: application.employerName,
      jobTitle: application.jobTitle,
      yearsAtJob: application.yearsAtJob,
      monthlyIncome: application.monthlyIncome,
      creditScoreRange: application.creditScoreRange,
      usCitizen: application.usCitizen,
      veteran: application.veteran,
      firstTimeBuyer: application.firstTimeBuyer,
      rawPayload: payloadForStorage,
    });

    // 2. Forward to CRM and send email in parallel.
    const [crmResult, emailResult] = await Promise.all([
      forwardToCRM({ type: "application", data: crmData, timestamp }),
      sendApplicationNotification(crmData, referenceNumber),
    ]);

    // 3. Persist delivery outcomes.
    if (applicationId) {
      await updateDeliveryStatus("applications", applicationId, crmResult, emailResult);
    }

    return NextResponse.json({
      success: true,
      referenceNumber,
      persisted: applicationId !== null,
    });
  } catch (err) {
    console.error("/api/applications error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
