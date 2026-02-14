# NFC Business Card System MVP

A premium digital business card platform with built-in analytics.

## Features
- **Public Profiles**: Minimalist, premium design for professionals.
- **Analytics**: Tracks scans, country, IP, and device type.
- **Dashboard**: Visual charts and recent activity logs.
- **Instant Sharing**: NFC-ready URL structure.

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel

## Setup Instructions

### 1. Prerequisites
- Node.js 18+
- Supabase Account
- Vercel Account (for deployment)

### 2. Database Setup (Supabase)
1. Create a new Supabase project.
2. Go to the **SQL Editor** in Supabase dashboard.
3. Copy and run the contents of [`supabase_schema.sql`](./supabase_schema.sql).
4. Go to **Project Settings > API** and copy your:
   - `Project URL`
   - `anon public` key

### 3. Environment Variables
Rename `.env.local.example` to `.env.local` and add your keys:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 4. Run Locally
```bash
npm install
npm run dev
```
Visit `http://localhost:3000` to see the landing page.
Visit `http://localhost:3000/u/your_username` to see a profile (create a user in Supabase first!).

## Deployment (Vercel)

### Step 1: Push to Git
Initialize git and push to GitHub/GitLab/Bitbucket.
```bash
git init
git add .
git commit -m "Initial commit"
# git remote add origin ...
# git push -u origin main
```

### Step 2: Import to Vercel
1. Go to [Vercel Dashboard](https://vercel.com/new).
2. Import your repository.
3. In **Environment Variables** section, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Click **Deploy**.

### Step 3: Domain Config (Optional)
Connect your custom domain in Vercel settings for a professional link (e.g., `nfc.yourname.com`).

## How it Works
1. **QR/NFC Tag**: Write the URL `https://your-domain.com/u/username` to an NFC tag.
2. **Scan**: When someone taps the tag, they are directed to the profile page.
3. **Log**: The server records the visit (IP, Country, Device) in Supabase.
4. **View**: The user logs in to the dashboard to see their stats.

## Troubleshooting Vercel Deployment

If you encounter `Invalid supabaseUrl` errors:
1. Go to **Settings > Environment Variables** in Vercel.
2. Ensure `NEXT_PUBLIC_SUPABASE_URL` is set to your full URL (e.g., `https://xyz.supabase.co`).
3. Ensure there are no spaces or trailing whitespace in the values.
4. Redeploy the project.

The application now includes safe fallbacks to prevent build crashes even if these keys are missing during the build phase.
