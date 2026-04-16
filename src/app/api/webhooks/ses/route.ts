import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

/**
 * Handles SNS notifications from Amazon SES
 * This endpoint receives events for: sent, delivered, opened, clicked, bounced, complained
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Handle SNS subscription confirmation
    if (body.Type === "SubscriptionConfirmation") {
      const { SubscribeURL } = body;
      // Auto-confirm subscription
      if (SubscribeURL) {
        await fetch(SubscribeURL);
      }
      return NextResponse.json({ message: "Subscription confirmed" });
    }

    // Handle notification
    if (body.Type === "Notification") {
      const message = JSON.parse(body.Message);
      const eventType = message.eventType || message.notificationType;
      const mail = message.mail;
      const messageId = mail?.messageId;

      if (!messageId) {
        return NextResponse.json({ error: "No messageId found" }, { status: 400 });
      }

      // Find the campaign contact by SES message ID
      const { data: campaignContact } = await supabaseAdmin
        .from("campaign_contacts")
        .select("id, campaign_id, contact_id, status")
        .eq("ses_message_id", messageId)
        .single();

      if (campaignContact) {
        let newStatus = campaignContact.status;
        const eventData = {
          timestamp: new Date().toISOString(),
          ...message,
        };

        switch (eventType) {
          case "Send":
            newStatus = "sent";
            break;
          case "Delivery":
            newStatus = "delivered";
            break;
          case "Open":
            newStatus = "opened";
            break;
          case "Click":
            newStatus = "clicked";
            break;
          case "Bounce":
            newStatus = "bounced";
            // Also update contact status
            await supabaseAdmin
              .from("contacts")
              .update({ status: "bounced" })
              .eq("id", campaignContact.contact_id);
            break;
          case "Complaint":
            newStatus = "complained";
            // Also update contact status to prevent future emails to complaining users
            await supabaseAdmin
              .from("contacts")
              .update({ status: "complained" })
              .eq("id", campaignContact.contact_id);
            break;
          case "Unsubscribe":
            newStatus = "unsubscribed";
            // Also update contact status
            await supabaseAdmin
              .from("contacts")
              .update({ status: "unsubscribed" })
              .eq("id", campaignContact.contact_id);
            break;
        }

        // Update campaign contact status
        const updateData: Record<string, any> = { status: newStatus };
        if (newStatus === "sent") updateData.sent_at = new Date().toISOString();
        if (newStatus === "opened") updateData.opened_at = new Date().toISOString();
        if (newStatus === "clicked") updateData.clicked_at = new Date().toISOString();

        await supabaseAdmin
          .from("campaign_contacts")
          .update(updateData)
          .eq("id", campaignContact.id);

        // Log the event
        await supabaseAdmin.from("campaign_events").insert({
          campaign_id: campaignContact.campaign_id,
          contact_id: campaignContact.contact_id,
          event_type: eventType.toLowerCase(),
          event_data: eventData,
          ip_address: message.open?.ipAddress || message.delivery?.ipAddress || null,
          user_agent: message.open?.userAgent || message.delivery?.reportingMTA || null,
        });
      }

      return NextResponse.json({ message: "Event processed" });
    }

    return NextResponse.json({ message: "Unknown notification type" });
  } catch (error: any) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process webhook" },
      { status: 500 }
    );
  }
}

// SNS sends a GET request to verify the endpoint
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const token = searchParams.get("token");

  if (token) {
    // SNS subscription verification
    return NextResponse.json({ token });
  }

  return NextResponse.json({ status: "ok" });
}
