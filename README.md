# Vautly 💳

> A UPI-Inspired Digital Payment Application with Integrated Goal-Based Vaults.
🌐 **Live Demo:** https://vautly.vercel.app/
Vautly transforms everyday payment experiences by integrating **Goal-Based Money Vaults** directly into digital UPI payment flows. Users can send money, pay via UPI IDs, scan QR codes, request payments, and use their saved Goal Vaults as payment sources.

---

## 🌟 Key Features

### 1. ⚡ UPI Digital Payment Core
* **Scan & Pay QR**: Realistic QR camera viewfinder simulation with pre-filled sample merchant QRs (ABC Store, Coffee House, Tech Accessories Hub, City Supermarket).
* **Peer-to-Peer Payments**: Instant money transfers to contacts or any UPI ID (`rahul@vautly`, `ananya@vautly`).
* **Request Money**: Send payment requests with notes and reference tracking.
* **Personal QR Code**: Display and share your personal payment QR (`siri@vautly`) with 1-click copy for your UPI ID.
* **4-Digit Vautly PIN**: Interactive keypad simulation for secure payment confirmation with confetti celebrations.

### 2. 🛡️ Goal-Based Money Vaults
* **Earmarked Capital**: Set aside money into dedicated vaults (Laptop Fund, Vacation, Pet Care, Emergency Fund, Education, Shopping).
* **Vault-Integrated Payments**: Choose to pay directly from your **Vautly Main Balance** OR any eligible **Goal Vault** during checkout.
* **Dynamic Balances**: Paying from a vault automatically deducts from that vault's reserved funds, updates target progress percentages, and logs the source in the transaction receipt.
* **Rule-Based Smart Insights**: Calculated goal forecasts estimating weekly contribution needs and completion timelines without fake AI gimmicks.

### 3. 📊 Activity & Financial Analytics
* **Real-time Receipts**: Click any transaction to view full payment receipts (Tx ID `VTL-XXXXXX`, status, date/time, payee, payment source).
* **Spending Breakdown**: Category breakdown across Groceries, Travel, Tech, and Essentials.
* **Filter & Search**: Instant filtering by Sent, Received, or Vault Transfers.

### 4. 🔒 Security & Preferences
* **App Lock Screen**: 4-digit PIN lock overlay (Default demo PIN: `1234`).
* **Multi-Currency Support**: Switch between INR (₹), USD ($), EUR (€), GBP (£), JPY (¥), and AED.
* **Light / Dark Mode**: Modern aesthetic with smooth color tokens and responsive mobile bottom navigation (`BottomNav`).

---

## ⚠️ Simulated Environment Disclosure

> **Portfolio & Demo Notice:** Vautly operates entirely within a simulated local environment. It does **not** connect to real bank accounts or actual UPI payment rails. All balances, transaction records, and QR scans run locally in browser state for portfolio demonstration purposes.

---

## 🚀 Tech Stack

* **Frontend**: React 19, TypeScript, Vite
* **Styling**: Tailwind CSS (Vanilla CSS utilities, dark mode, custom glassmorphism)
* **Icons**: Lucide React
* **Animations & FX**: Canvas Confetti, Framer Motion

---

## 📦 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

### 3. Build for Production
```bash
npm run build
```

---

## 📱 Navigation Structure

* **Home**: Hero Balance HUD (Available ₹12,450), Quick Actions, Top Vaults, Recent Activity, Smart Insights.
* **Pay**: Dedicated Payment Hub with Scan QR banner, UPI ID input, and Recent Contacts grid.
* **Vaults**: Goal Vault overview, progress bars, category tabs, and forecast insights.
* **Activity**: Filterable transaction log and receipt drawer.
* **Profile**: User identity, Security App Lock settings, Theme, Currency, and State Reset.
