# Kalpana Multispeciality Dental Clinic

Modern Full-Stack Dental Clinic Web Application with decoupled **Frontend** (Vite + React 19 + Tailwind CSS) and **Backend** (Node.js + Express REST API).

---

## 📁 Directory Structure

```text
kalpana-dental-clinic/
├── frontend/                 # Client SPA (React 19, Vite, Tailwind CSS, Lucide Icons)
│   ├── public/               # Static assets & favicon
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── config/           # Clinic configuration
│   │   ├── data/             # Local data & fallbacks
│   │   ├── pages/            # Page views (Home, Services, Appointment, Contact, etc.)
│   │   └── services/         # API Service module for backend REST calls
│   ├── index.html
│   ├── package.json
│   └── vite.config.js        # Vite dev server with proxy settings (/api -> http://localhost:5000)
│
├── backend/                  # Server REST API (Node.js, Express)
│   ├── data/                 # Server data store & models
│   ├── routes/               # API routes (/api/appointments, /api/contact, /api/health, etc.)
│   ├── .env.example          # Environment variables template
│   ├── package.json
│   └── server.js             # Express server entry point
│
├── package.json              # Root workspace orchestrator (runs dev server concurrently)
└── README.md
```

---

## 🚀 Getting Started

### 1. Install Dependencies

Install dependencies for the root, frontend, and backend packages:

```bash
npm run install:all
```

Or install manually in each folder:

```bash
# Backend dependencies
cd backend && npm install

# Frontend dependencies
cd ../frontend && npm install
```

---

### 2. Running in Development Mode

Run both **Frontend** and **Backend** concurrently with a single command from the root directory:

```bash
npm run dev
```

This will launch:
- **Express Backend API**: `http://localhost:5000`
- **Vite React Frontend**: `http://localhost:5173`

---

### 3. Running Services Separately

If you want to run the frontend or backend individually:

- **Run Backend Only**:
  ```bash
  npm run dev:backend
  ```

- **Run Frontend Only**:
  ```bash
  npm run dev:frontend
  ```

---

## 🔌 Backend REST API Endpoints

- `GET /api/health` - Check backend service status
- `GET /api/clinic` - Get clinic details and working hours
- `GET /api/services` - Get list of dental treatments & services
- `GET /api/doctors` - Get list of doctors & specialists
- `GET /api/gallery` - Get clinic photo gallery items
- `GET /api/testimonials` - Get patient reviews
- `GET /api/faq` - Get frequently asked questions
- `POST /api/appointments` - Submit appointment booking request
- `POST /api/contact` - Submit contact inquiry form
