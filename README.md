# CanteenBites — Smart Campus Food Ordering Platform

> **"Your Campus Cravings, Without the Queue."**

CanteenBites is a production-ready, full-stack food ordering, queue tracking, and hostel room delivery platform designed specifically for college campuses. It allows students to order food without waiting in counter crowds, lets canteen staff manage kitchen prep queues, and powers door-to-door hostel deliveries.

Live URL: [https://canteen-bites-ufe9.vercel.app/](https://canteen-bites-ufe9.vercel.app/)

---

## 🚀 Key Features

### 1. Student Experience
- **Live Canteen Menus**: Browse menus across campus canteens (Main Canteen, Food Court, Hostel Canteen) with real-time availability and verified vegetarian/non-vegetarian indicators.
- **Instant Ordering & 1-Tap Add**: Zero-friction menu browsing with immediate cart updates, persistent cart storage (`localStorage`), and optional cooking customization notes.
- **Dietary & Budget Filters**: Quick chips for Veg Only, Top Rated (4.8+), and price sorting.
- **Express Counter Pickup & Hostel Room Delivery**: Separate flows for Hostellers (with room numbers and floor delivery) and Day Scholars (counter pickup default).
- **Payment Options**: Instant Paytm UPI, Google Pay, PhonePe, and Cash on Counter.

### 2. Live Preparation & Queue Tracking
- Dynamic queue position countdown (`#7 in queue → #4 → READY`).
- Smart preparation-time estimation based on active kitchen load and item counts.
- Real-time in-app notifications when cooking starts, delays occur, or food is ready.

### 3. Canteen Kitchen Management Dashboard
- Kitchen display for canteen managers to accept, prepare, delay, or complete orders.
- Room delivery accept/reject with automatic delivery fee refund and student notification if delivery is declined.
- Real-time menu stock toggle (mark items available/unavailable instantly).

### 4. Bites AI Assistant
- Grounded assistant that answers student dietary queries, finds budget-friendly meals, suggests popular dishes, and checks active order statuses.
- Guardrails against prompt injection and cross-user data leakage.

### 5. Multi-Role Campus Portal
- **Student**: Hosteller & Day Scholar accounts with profile history.
- **Canteen Staff**: Kitchen order processing and queue control.
- **Delivery Partner**: Hostel floor delivery dispatch.
- **Administrator**: Analytics, menu control, and campus settings.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom Dark-Navy theme (`#0B1220`, `#151F32`, `#FFB454`)
- **Icons**: Lucide React
- **Database**: Local JSON persistence (`canteen_bites_db.json`) with in-memory caching and real-time SSE event broadcast
- **Deployment**: Vercel

---

## 📦 Project Structure

```
├── src/
│   ├── app/                    # Next.js App Router pages & APIs
│   │   ├── page.tsx            # Main root router (PublicLanding & Role App)
│   │   ├── layout.tsx          # Root layout with metadata & theme
│   │   ├── globals.css         # Global styles & dark-navy tokens
│   │   ├── menu/               # Full menu explorer
│   │   ├── canteens/           # Campus canteen directory
│   │   ├── offers/             # Student coupons & promos
│   │   ├── bites-ai/           # Dedicated Bites AI chat page
│   │   ├── login/ & register/  # Authentication pages
│   │   └── api/                # Backend API endpoints
│   │       ├── orders/         # Order creation & status transitions
│   │       ├── menu/           # Menu query & filtering
│   │       ├── canteens/       # Canteen directory
│   │       ├── auth/           # Login, register, OTP verification
│   │       └── ai/             # Bites AI tool execution
│   ├── components/             # Modular UI components
│   │   ├── common/             # Navbar, Footer, Logo, Toast
│   │   ├── public/             # PublicLanding homepage & FAQs
│   │   ├── student/            # StudentHome, Search, Cart, Orders, Profile
│   │   ├── canteen/            # Canteen kitchen dashboard
│   │   ├── delivery/           # Hostel delivery portal
│   │   ├── admin/              # Administrator dashboard
│   │   └── ai/                 # BitesAIAssistant widget
│   ├── context/                # AppContext (global state, auth, cart)
│   ├── lib/                    # Database, calculations, seed data
│   └── types/                  # TypeScript data models & schemas
├── public/                     # Static food images & icons
├── test-suite.mjs              # 23-point automated verification test suite
├── .env.example                # Safe environment variable template
└── package.json
```

---

## 💻 Local Development Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yashvardhan026/CanteenBites.git
   cd CanteenBites
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   ```bash
   cp .env.example .env.local
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the application.

5. **Run tests**:
   ```bash
   node test-suite.mjs
   ```

6. **Build for production**:
   ```bash
   npm run build
   ```

---

## 🚢 Deployment

The project is configured for zero-configuration continuous deployment on Vercel:
- Production Branch: `main`
- Build Command: `npm run build`
- Output Directory: Next.js default (`.next`)

---

## 📄 License
Swami Vivekanand Institute of Engineering & Technology (SVIET) — Campus Internal Project.
