import { SESClient, SendEmailCommand, SendBulkTemplatedEmailCommand } from "@aws-sdk/client-ses";

const awsAccessKeyId = process.env.AWS_ACCESS_KEY_ID || "";
const awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || "";
const awsRegion = process.env.AWS_REGION || "us-east-1";

export const sesClient = new SESClient({
  region: awsRegion,
  credentials: {
    accessKeyId: awsAccessKeyId,
    secretAccessKey: awsSecretAccessKey,
  },
});

export async function sendEmail({
  to,
  subject,
  bodyHtml,
  bodyText,
  from,
  replyTo,
}: {
  to: string[];
  subject: string;
  bodyHtml: string;
  bodyText: string;
  from: string;
  replyTo?: string;
}) {
  const command = new SendEmailCommand({
    Destination: { ToAddresses: to },
    Message: {
      Subject: { Data: subject, Charset: "UTF-8" },
      Body: {
        Html: { Data: bodyHtml, Charset: "UTF-8" },
        Text: { Data: bodyText, Charset: "UTF-8" },
      },
    },
    Source: from,
    ReplyToAddresses: replyTo ? [replyTo] : undefined,
    ConfigurationSetName: process.env.SES_CONFIGURATION_SET_NAME,
  });

  const response = await sesClient.send(command);
  return response.MessageId;
}

export async function sendBulkTemplatedEmail({
  destinations,
  template,
  defaultTemplateData,
  from,
  replyTo,
}: {
  destinations: {
    Destination: { ToAddresses: string[] };
    ReplacementTemplateData?: string;
  }[];
  template: string;
  defaultTemplateData: Record<string, string>;
  from: string;
  replyTo?: string;
}) {
  const command = new SendBulkTemplatedEmailCommand({
    Destinations: destinations.map((d) => ({
      Destination: d.Destination,
      ReplacementTemplateData: d.ReplacementTemplateData,
    })),
    Template: template,
    DefaultTemplateData: JSON.stringify(defaultTemplateData),
    Source: from,
    ReplyToAddresses: replyTo ? [replyTo] : undefined,
    ConfigurationSetName: process.env.SES_CONFIGURATION_SET_NAME,
  });

  const response = await sesClient.send(command);
  return response;
}
