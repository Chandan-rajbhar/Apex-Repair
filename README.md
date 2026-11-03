# Apex Appliance Repair — Mobile-First Web App

A production-quality, mobile-first web app in React (JavaScript) mirroring the luxury aesthetic, frosted glass surfaces, and layout of the BeautyOasisRx design reference, customized specifically for **Apex Appliance Repair** (Precision Diagnostics & Repair).

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start local development server
npm run dev
```

App is accessible at **`http://localhost:5173/`**.

---

## 🔑 Demo Account Credentials

A pre-seeded demo account is ready out of the box (or autofill with one click on the Sign In sheet):

- **Email:** `demo@apex.com`
- **Password:** `Demo@123`
- **Client Name:** Saurabh Yadav
- **Initials:** SY
- **Active Repair ID:** `#AR-1024` (Samsung Refrigerator • En Route with live animated GPS route map)

> **Guest Mode Supported:** Users can book appointments, chat live with support, and look up repairs using Booking ID + Phone without logging in.

---

## 🌟 Key Features & Architectural Highlights

### 1. Luxury Design System & Glassmorphism (Section 3)
- **Design Tokens (`tokens.css`):**
  - `--grad-primary`: Emerald gradient `linear-gradient(135deg, #2FA67C 0%, #1E7B5A 55%, #145A42 100%)`
  - `--grad-navy`: Dark navy `linear-gradient(135deg, #0F2A44 0%, #17405F 50%, #1E7B5A 120%)`
  - `--grad-hero`: Navy to emerald diagonal gradient with top radial highlight
  - `--grad-cta`: High-contrast orange gradient `linear-gradient(135deg, #FF7A3D, #E8541E 60%, #C73E10)`
  - `--grad-mint`: Soft mint cards `linear-gradient(160deg, #F2FBF7, #DDF3E8)`
- **Glass Surfaces (`effects.css`):**
  - Frosted glass `.glass`, `.glass-strong`, `.glass-dark` with `backdrop-filter: blur(16px) saturate(160%)` and inner highlight inset shadows.
  - Fallback solid semi-opaque styling for older browsers via `@supports not (backdrop-filter: ...)`.
- **Gloss & Shine Sweep:**
  - Continuous 4-second automatic moving shine sweep on primary buttons and hero cards via `::after`.
  - Top-edge gloss (`::before`) on cards for depth.
  - Pulsing glow rings on active step nodes and center Book button.
  - Floating decorative background color blobs slowly moving behind content.
  - Desktop pointer-follow light highlight via `--mx, --my` CSS variables.
  - Accessible: `prefers-reduced-motion` fully respected.

---

### 2. Feature A: Enquiry Live Chat (`/`)
- Floating glass chat trigger button placed bottom-right, strictly above bottom nav and sticky bars.
- Frosted glass bottom sheet drawer.
- **Rule-Based Triage Bot:**
  - Conversational triage: Appliance → Brand → Symptom → Diagnostic Fee ($79 waived with repair) → **"Convert to Booking"** button that navigates directly to `/book` prefilled.
  - FAQ auto-answers: Pricing, service areas, 90-day warranty, hours (7am-9pm 7 days a week).
  - "Talk to a technician": Simulates live human master technician Marcus Vance joining the chat.
  - Pinned booking chip when opened with "Chat about booking #AR-1024".
- **Real-Time Feel:**
  - Animated typing indicator, sent / delivered / seen checkmark ticks, timestamps.
  - Photo and document attachments with thumbnail previews.
  - Downloadable chat transcript (`.txt`).
  - Web Audio API chimes for send and receive with mute toggle (no external audio files).

---

### 3. Feature B: Order & Repair Tracking (`/track`)
- **9-Step Diagnostic & Repair Progression Engine:**
  1. *Request received*
  2. *Booking confirmed*
  3. *Technician assigned*
  4. *Technician on the way* (triggers interactive animated SVG GPS route map)
  5. *Diagnosis in progress*
  6. *Quote approval needed* (renders interactive Quote Card with Approve / Decline)
  7. *Repair in progress*
  8. *Completed*
  9. *Payment done*
- **Interactive Animated SVG GPS Map:** Pure SVG & CSS animated moving vehicle, route trail, customer pin, and live ETA countdown (no external map API required).
- **Interactive Quote Card:** Full breakdown of parts, labor, and diagnostic fee credit (-$79). Decline modal includes reasons.
- **Simulation Engine:**
  - Auto-advance every 25 seconds (toggleable in Settings).
  - Manual "Simulate Step" button for instant testing.
  - Synced across tabs via `window.addEventListener('storage', ...)`.
- **Customer Actions:**
  - Reschedule modal with date strip and 3-hour arrival window.
  - Printable official PDF invoice (`window.print`).
  - Mock payment modal (Credit Card, Apple Pay, Cash to Tech).
  - 5-Star technician review modal.

---

### 4. 2-Step Booking Flow (`/book`)
- **Step 1:** Appliance category selection, brand chips, symptom chips, date strip, and 3-hour time slot.
- **Step 2:** Customer contact, service address, access instructions, and appliance label photo upload.
- **Sticky Frosted Glass Bar:** Clear diagnostic fee callout ($79 waived with repair) and lock-in button.
- **Success Screen:** Newly generated Booking ID (e.g. `AR-1048`), instant copy button, and one-click transition to live tracking.

---

### 5. Pages & Views
- **Home (`/`):** Frosted hero banner with shine sweep, serif typography, "ASSURED" warranty ribbon, 4 trust tiles, recommended appliance repair grid, emergency call CTA.
- **Services (`/services`):** Mirroring BeautyOasis screenshot 4 with filter chips ("Refrigeration", "Laundry", "Cooking", etc.), search bar, service cards with diagnostic pricing, and comprehensive detail sheet.
- **Book (`/book`):** 2-step booking flow with sticky confirmation bar.
- **Track (`/track`):** Live 9-step tracking, SVG map, quote card, technician card, and customer action center.
- **More (`/more`):** Mirroring BeautyOasis screenshot 3 with profile summary card, 4 quick tiles, dark navy AI Diagnostic Scanner feature banner, search bar, and grouped "Appointments & History" list.
- **Customer Portal (`/portal`):** Mirroring BeautyOasis screenshot 1 with initials avatar, Edit Profile modal, info card, active order card with "[dot] Track Live >", 4 quick tiles, and appliances under care.

---

## 🔌 How to Replace Mock Services with a Real Backend

All data access is isolated strictly in `src/services/`:

1. **`authService.js`:**
   - Replace localStorage read/write with Supabase Auth (`supabase.auth.signInWithPassword`), Firebase Auth, or a custom JWT endpoint (`fetch('/api/auth/login')`).
2. **`bookingService.js`:**
   - Replace `storageService.get('apex_bookings')` with REST or GraphQL endpoints (`POST /api/bookings`, `GET /api/bookings/:id`).
3. **`trackingService.js`:**
   - Replace the timer progression simulator with Supabase Realtime subscriptions (`supabase.channel('bookings')`) or WebSockets (`socket.io`).
4. **`chatService.js`:**
   - Swap the bot response logic with an LLM streaming endpoint (e.g. Gemini 1.5 Flash via Server-Sent Events) or connect to Twilio/LiveChat API.

The UI components only consume the React Contexts (`useAuth`, `useBooking`, `useChat`, `useToast`), so switching to a live backend requires **zero changes to the UI layer**.
