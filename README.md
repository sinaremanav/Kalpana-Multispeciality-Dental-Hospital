# 🦷 Kalpana Multispeciality Dental Clinic — Full-Stack Platform

A modern, production-ready dental clinic management and patient portal platform built with **React**, **Vite**, **Tailwind CSS**, **Framer Motion**, **Lucide Icons**, **Express**, and **Supabase (PostgreSQL, Auth, Storage & Row Level Security)**.

---

## 🌟 Architecture & Features

### 🏥 Patient Portal (Public Website)
- **Home**: Dynamic Hero section, clinic stats, lead surgeon highlight, featured dental treatments, patient reviews, and upcoming camp alerts.
- **About**: Hospital background, mission/vision, class-B sterilization standards, and doctor credentials.
- **Doctors**: Clinical specialist profiles, qualifications, and direct booking shortcuts.
- **Services**: Full dental procedure catalog, transparent pricing, and key treatment highlights.
- **Events & Camps (`/events`)**: Community screening camps, oral hygiene workshops, categorized into Upcoming vs. Past initiatives.
- **Gallery**: Visual tour of operatories, digital RVG sensors, sterilization units, and restored smiles with fullscreen lightbox.
- **Testimonials**: 5-star patient reviews and verified clinical feedback.
- **FAQs**: Accordion answering frequent patient queries.
- **Appointment Booking**: Real-time scheduling with Supabase persistence and instant WhatsApp notification.
- **Contact Us**: Patient inquiry submission linked to Supabase and WhatsApp.

### 🛡️ Admin & Doctor Portal (`/admin`)
- **Supabase Authentication**: Secure email/password login with role-based access control (`admin` vs `doctor`).
- **Dashboard**: Real-time counters for pending/confirmed appointments, active doctors, treatments, upcoming events, and unread inquiries.
- **Appointments Manager**: Status management (`pending`, `confirmed`, `completed`, `cancelled`), patient details modal, and WhatsApp message trigger.
- **Doctors Manager**: Add, edit, activate/deactivate, delete doctors, and upload profile photos.
- **Doctor Self-Profile (`/admin/profile`)**: Logged-in doctors can update their own clinical qualifications, bio, and profile photo without modifying other doctors.
- **Services Manager**: Add and modify dental procedures, pricing tags, and bulleted highlights.
- **Events & Camps Manager**: Schedule and publish community dental screening drives.
- **Testimonials Manager**: Publish, unpublish, edit patient reviews, and set star ratings.
- **Gallery Manager**: Upload clinic photos directly to Supabase Storage (`clinic-images` bucket).
- **Messages Manager**: Review incoming patient inquiries and mark as read/replied.
- **Clinic Settings Manager**: Dynamically update clinic name, phone numbers, WhatsApp, address, opening hours, and social media links.

---

## 📁 Repository Structure

```
kalpana-dental-clinic/
├── backend/
│   ├── routes/api.js             # Express API routes
│   ├── server.js                 # Express server entry
│   └── package.json
├── frontend/
│   ├── public/
│   │   └── _redirects            # SPA redirect rules for static hosts
│   ├── src/
│   │   ├── admin/                # Admin & Doctor Management Portal
│   │   │   ├── components/       # Layout, Navbar, Sidebar, Modals, Tables, ImageUploader
│   │   │   ├── context/          # AuthContext (Supabase Auth & Profiles)
│   │   │   └── pages/            # Dashboard, Doctors, Profile, Services, Appointments, etc.
│   │   ├── components/           # Public components (Navbar, Footer, EventCard, etc.)
│   │   ├── config/               # Fallback clinic configuration
│   │   ├── data/                 # Initial mock & fallback datasets
│   │   ├── lib/                  # supabaseClient.js initialization
│   │   ├── pages/                # Public pages (Home, Services, Events, Contact, etc.)
│   │   ├── services/             # Modular data services (auth, doctor, service, appointment, etc.)
│   │   ├── App.jsx               # Route definitions
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── vercel.json
├── supabase/
│   └── migrations/               # PostgreSQL schema, RLS policies, seed data & storage SQL
│       ├── 001_profiles.sql
│       ├── 002_doctors.sql
│       ├── 003_services.sql
│       ├── 004_appointments.sql
│       ├── 005_contact_messages.sql
│       ├── 006_testimonials.sql
│       ├── 007_gallery.sql
│       ├── 008_events.sql
│       ├── 009_clinic_settings.sql
│       ├── 010_rls_policies.sql
│       ├── 011_seed_data.sql
│       ├── 012_storage_setup.sql
│       └── all_migrations_combined.sql
├── .env.example
├── .gitignore
├── vercel.json                   # Root Vercel deployment configuration
├── package.json                  # Root Monorepo workspaces configuration
└── README.md
```

---

## 🗄️ Database Setup in Supabase

### 1. Execute SQL Migration in Supabase
1. Open your Supabase Dashboard: [https://supabase.com/dashboard/project/wbcifzwxlboepvjumori](https://supabase.com/dashboard/project/wbcifzwxlboepvjumori)
2. Go to **SQL Editor** from the left sidebar.
3. Open `supabase/migrations/all_migrations_combined.sql` in this repo, copy all contents, paste into the SQL Editor, and click **Run**.
4. This will create all 9 database tables (`profiles`, `doctors`, `services`, `appointments`, `contact_messages`, `testimonials`, `gallery`, `events`, `clinic_settings`), configure triggers, enable Row Level Security (RLS) policies, and seed default clinic data.

### 2. Configure Storage Bucket
1. In Supabase Dashboard, click **Storage**.
2. If `clinic-images` is not already listed, click **New Bucket**, name it `clinic-images`, and enable **Public Bucket**.
3. Under Policies, ensure read access is public and upload/delete access is restricted to authenticated users (this is automatically configured if you ran `012_storage_setup.sql` or `all_migrations_combined.sql`).

---

## 👤 Creating Your First Admin Account

1. In the Supabase Dashboard, navigate to **Authentication -> Users**.
2. Click **Add User** -> **Create User**.
3. Enter your email (e.g. `admin@kalpanadental.com`) and a strong password. Enable **Auto Confirm User**.
4. In the **SQL Editor**, run the following query to grant the `admin` role:

```sql
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'admin@kalpanadental.com';
```

5. You can now log in at `/admin/login` using this email and password.

---

## 🔑 Environment Variables

Copy `.env.example` into `frontend/.env` (and root `.env` if needed):

```env
# Frontend Supabase Public Configuration (Vite)
VITE_SUPABASE_URL=https://wbcifzwxlboepvjumori.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_publishable_key_here

# Backend Optional Configuration (Server-Only, Never Expose to Browser)
PORT=5000
SUPABASE_URL=https://wbcifzwxlboepvjumori.supabase.co
SUPABASE_SECRET_KEY=your_supabase_service_role_key_here
```

> [!SECURITY NOTE]
> Never expose `SUPABASE_SECRET_KEY` or `SUPABASE_SERVICE_ROLE_KEY` to the browser or commit them to GitHub. The React frontend strictly uses `VITE_SUPABASE_PUBLISHABLE_KEY`.

---

## 🚀 Running Locally

1. **Install Dependencies**:
```bash
npm run install:all
```

2. **Start Frontend & Backend Development Servers**:
```bash
npm run dev
```

- **Frontend Website**: `http://localhost:5173`
- **Admin Portal**: `http://localhost:5173/admin`
- **Backend API Server**: `http://localhost:5000`

---

## ☁️ Deployment to Vercel

1. Push this repository to GitHub.
2. In Vercel, click **Add New Project** and select this repository.
3. Configure the environment variables in Vercel:
   - `VITE_SUPABASE_URL`: `https://wbcifzwxlboepvjumori.supabase.co`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`: *(Your Supabase anon public key)*
4. Set the Build & Output settings:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (or `frontend`)
   - **Build Command**: `npm run build:frontend` (or `npm run build`)
   - **Output Directory**: `frontend/dist` (or `dist`)
5. Click **Deploy**. Vercel will automatically handle client-side routing via `vercel.json`.
