# Monika Medico Pvt. Ltd. — Fullstack Website

A complete Next.js 14 + Supabase fullstack website for Monika Medico Pvt. Ltd.

## Features

- 🏪 **Product Catalog** — Browse all products with search & category filters
- 🛒 **Shopping Cart** — Persistent cart with Zustand (localStorage)
- 📦 **Order Placement** — Full checkout form saved to Supabase
- 📞 **Contact Form** — Messages saved to Supabase
- 🖥️ **Admin Dashboard** — View orders, stats, and revenue at `/admin`
- 📱 **Fully Responsive** — Mobile, tablet, and desktop optimized
- ⚡ **Fast** — Next.js App Router with Server Components

---

## 🚀 Deploy in 3 Steps

### Step 1: Set up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. In the SQL editor, run the contents of `supabase/migrations/001_initial_schema.sql`
3. Copy your **Project URL** and **Anon Key** from Settings → API

### Step 2: Deploy to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import from GitHub
3. Add these Environment Variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
   ```
4. Click **Deploy** — done! ✅

### Step 3: (Optional) Local Development

```bash
npm install
cp .env.local.example .env.local
# Fill in your Supabase credentials in .env.local
npm run dev
```

---

## Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage with hero, categories, featured products |
| `/products` | Full product catalog with search & filter |
| `/products/[slug]` | Individual product detail page |
| `/cart` | Shopping cart + checkout form |
| `/contact` | Contact form (saves to Supabase) |
| `/admin` | Admin dashboard — orders & stats |

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Row Level Security)
- **State**: Zustand with persistence
- **Hosting**: Vercel (frontend) + Supabase (database)
- **Fonts**: Playfair Display + Lora (Google Fonts)

## Customization

- **Logo/Brand**: Update colors in `tailwind.config.js` → `forest` and `crimson`
- **Products**: Add/edit products directly in Supabase Table Editor
- **Contact info**: Update in `Footer.tsx` and `contact/page.tsx`
- **Phone number**: Search for `+977` and replace with actual number
