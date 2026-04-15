import { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MailFlow - Email Marketing Platform",
  description: "Self-hosted email marketing platform powered by Amazon SES",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
