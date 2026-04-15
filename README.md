# MailFlow - Email Marketing Platform on Vercel

A self-hosted email marketing platform built with Next.js, powered by Amazon SES.

## Features

- 📧 **Campaign Management** - Create, schedule, and send email campaigns
- 👥 **Contact Management** - Import, segment, and manage subscribers
- 📝 **Email Templates** - Reusable templates with variables
- 📊 **Analytics** - Track opens, clicks, bounces, and unsubscribes
- 🏷️ **Segments** - Group contacts for targeted campaigns
- 🔗 **SES Integration** - Reliable email delivery via Amazon SES
- 📡 **Real-time Tracking** - Open/click tracking via SNS webhooks

## Tech Stack

- **Frontend**: Next.js 14 (App Router) + React + TypeScript
- **Styling**: Tailwind CSS + Lucide Icons
- **Charts**: Recharts
- **Database**: Supabase (PostgreSQL)
- **Email Delivery**: Amazon SES
- **Webhooks**: Amazon SNS
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- Supabase account (free tier works)
- AWS account with SES access
- Vercel account (free tier works)

### 1. Clone & Install

```bash
cd mailtrain-vercel
npm install
```

### 2. Set up Supabase

1. Create a new project at [Supabase](https://supabase.com)
2. Go to SQL Editor and run the schema from `supabase-schema.sql`
3. Get your project URL and API keys from Settings > API

### 3. Set up Amazon SES

1. Go to [AWS SES Console](https://console.aws.amazon.com/ses)
2. Verify your sending domain or email
3. Create an IAM user with SES and SNS permissions
4. Create a Configuration Set for tracking:
   - Go to SES > Configuration Sets
   - Create a new set with Open and Click event tracking
   - Set SNS as the destination for events

### 4. Configure Environment Variables

Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
cp .env.example .env.local
```

### 5. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deploy to Vercel

### Option 1: Vercel Dashboard

1. Push this repo to GitHub
2. Go to [Vercel](https://vercel.com)
3. Click **New Project** and import your repo
4. Add environment variables from `.env.example`
5. Click **Deploy**

### Option 2: Vercel CLI

```bash
npm i -g vercel
vercel
```

### Set up SNS Webhook URL

After deploying, configure your SES Configuration Set:

1. Go to AWS SES Console > Configuration Sets
2. Edit your configuration set
3. Add SNS topic with destination: `https://your-app.vercel.app/api/webhooks/ses`
4. Ensure the webhook is subscribed to SNS topics

## Project Structure

```
mailtrain-vercel/
├── src/
│   ├── app/
│   │   ├── dashboard/
│   │   │   ├── page.tsx          # Dashboard overview
│   │   │   ├── layout.tsx        # Dashboard layout with sidebar
│   │   │   ├── contacts/         # Contact management
│   │   │   ├── segments/         # Audience segmentation
│   │   │   ├── templates/        # Email templates
│   │   │   ├── campaigns/        # Campaign CRUD
│   │   │   │   └── new/          # Campaign creation wizard
│   │   │   ├── analytics/        # Reports & analytics
│   │   │   └── settings/         # Platform settings
│   │   ├── api/
│   │   │   ├── campaigns/send/   # Send campaign API
│   │   │   └── webhooks/ses/     # SES SNS webhook handler
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   └── sidebar.tsx           # Navigation sidebar
│   └── lib/
│       ├── supabase.ts           # Supabase client
│       ├── ses.ts                # AWS SES client
│       └── utils.ts              # Utility functions
├── supabase-schema.sql           # Database schema
├── .env.example                  # Environment variables template
└── package.json
```

## Database Schema

The platform uses these main tables:

| Table | Description |
|-------|-------------|
| `users` | User accounts |
| `contacts` | Email subscribers |
| `segments` | Contact groups |
| `templates` | Email templates |
| `campaigns` | Email campaigns |
| `campaign_contacts` | Campaign recipients |
| `campaign_events` | Tracking events |

## AWS SES Setup Guide

### 1. Verify Identity

```
SES Console > Verified Identities > Create Identity
- Choose Domain or Email
- Follow DNS verification steps
```

### 2. Create Configuration Set

```
SES Console > Configuration Sets > Create Configuration Set
- Name: mailflow-tracking
- Add Event Destination:
  - Types: Send, Delivery, Open, Click, Bounce, Complaint
  - Destination: SNS Topic
```

### 3. Create IAM User

```
IAM Console > Users > Create User
- Name: mailflow-ses
- Attach Policy: AmazonSESFullAccess (or custom policy)
- Create Access Keys
```

### 4. Custom IAM Policy (Recommended)

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ses:SendEmail",
        "ses:SendBulkTemplatedEmail",
        "ses:GetSendStatistics"
      ],
      "Resource": "*"
    }
  ]
}
```

## Cost Estimate

| Service | Cost |
|---------|------|
| Vercel | Free (Hobby) / $20/mo (Pro) |
| Supabase | Free tier (500MB) / $25/mo (Pro) |
| Amazon SES | $0.10 per 1,000 emails |
| **Total** | ~$0 for small scale |

## Next Steps

- [ ] Add NextAuth for user authentication
- [ ] Implement CSV contact import
- [ ] Add A/B testing for campaigns
- [ ] Build email template drag-and-drop editor
- [ ] Add scheduled sends with Vercel Cron
- [ ] Implement bounce handling automation
- [ ] Add list hygiene features

## License

MIT

---

Built with ❤️ for email marketing on Vercel
