import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/ses";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      campaignId,
      to,
      subject,
      htmlContent,
      textContent,
      fromName,
      fromEmail,
      replyTo,
    } = body;

    if (!to || !subject || !htmlContent || !fromEmail) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const from = `${fromName} <${fromEmail}>`;

    // Send email via SES
    const messageId = await sendEmail({
      to: Array.isArray(to) ? to : [to],
      subject,
      bodyHtml: htmlContent,
      bodyText: textContent || htmlContent.replace(/<[^>]*>/g, ""),
      from,
      replyTo,
    });

    // Update campaign_contacts record
    if (campaignId) {
      await supabaseAdmin
        .from("campaign_contacts")
        .update({
          status: "sent",
          sent_at: new Date().toISOString(),
          ses_message_id: messageId,
        })
        .eq("campaign_id", campaignId)
        .in(
          "contact_id",
          (
            await supabaseAdmin
              .from("campaign_contacts")
              .select("contact_id")
              .eq("campaign_id", campaignId)
              .eq("status", "pending")
          ).data?.map((r: any) => r.contact_id) || []
        );
    }

    return NextResponse.json({
      success: true,
      messageId,
      recipients: Array.isArray(to) ? to.length : 1,
    });
  } catch (error: any) {
    console.error("Error sending campaign:", error);
    return NextResponse.json(
      { error: error.message || "Failed to send campaign" },
      { status: 500 }
    );
  }
}
