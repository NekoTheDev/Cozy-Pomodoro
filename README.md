# 🔮 COZY FOCUS | Digital Sanctuary

![License](https://img.shields.io/badge/license-BSD_3--Clause-blue.svg)
![React](https://img.shields.io/badge/react-v18.3.1-61DAFB.svg)
![TypeScript](https://img.shields.io/badge/typescript-v5.0-3178C6.svg)
![Vite](https://img.shields.io/badge/vite-v5.0-646CFF.svg)
![State](https://img.shields.io/badge/state-Zustand-orange.svg)

> **"Find stillness in deep work."**
> A premium, high-performance productivity environment blending Cyberpunk aesthetics with cozy, ambient focus tools.

---

## 📖 Overview

**Cozy Focus** is a sophisticated Single Page Application (SPA) designed to elevate the productivity experience. It moves beyond simple time tracking by creating an immersive "Sanctuary" for the user. 

Built with **React 18** and **TypeScript**, it features a simulated backend environment, complex state management via **Zustand**, and smooth, hardware-accelerated animations using **Framer Motion**.

## ⚡ Key Features

### 🕰️ The Chronometer (Timer)
- **Fluid Visuals**: SVG-based progress ring with real-time smooth interpolation.
- **Modes**: Intelligent switching between Focus (Amber), Short Break (Sage), and Long Break (Indigo).
- **Auto-Flow**: Configurable auto-start options for seamless session transitioning.

### 📋 Mission Control (Tasks)
- **Task Management**: Create, edit, and prioritize tasks (Low/Medium/High).
- **Estimation**: Assign "Pomodoro" estimates and track actual completion vs. predicted effort.
- **Deep Focus Integration**: Pin a specific task to the timer view to maintain context.

### 📊 Neural Analytics (Stats)
- **Data Visualization**: Interactive Recharts graphs showing focus distribution over time.
- **Metrics**: Track daily streaks, total focus hours, and session completion rates.
- **CSV Export**: Download your productivity data for external analysis.

### 🎨 Atmosphere & Customization
- **Visual Environments**: Switch between preset wallpapers or upload your own local image (stored in browser memory).
- **Zen Mode**: One-click UI decluttering for absolute minimalism.
- **Ambience**: Toggle soothing background sounds (simulated).

### 🔐 Simulated Identity System
- **Mock Auth**: A robust fake-backend service simulating JWT tokens, latency, and session persistence.
- **Profile Management**: Update user details, avatar, and credentials locally.

---

## 🛠️ Technology Stack

| Domain | Technology | Usage |
| :--- | :--- | :--- |
| **Core** | React 18, TypeScript | Component architecture and type safety. |
| **Build** | Vite | Lightning-fast HMR and bundling. |
| **State** | Zustand | Global state management (Auth, Timer, Tasks). |
| **Styling** | Tailwind CSS | Utility-first styling with custom configuration. |
| **Motion** | Framer Motion | Layout transitions, micro-interactions, and physics. |
| **Routing** | React Router v6 | Client-side routing with protected guards. |
| **Data** | LocalStorage API | Persisting state between reloads (simulating DB). |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/cozy-focus.git
   cd cozy-focus
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Ignite the server**
   ```bash
   npm run dev
   ```

4. **Access the Sanctuary**
   Open `http://localhost:5173` in your browser.

---

## 🔐 Mock Credentials (Development)

The application uses a sophisticated mock service layer (`src/services/fakeBackend.ts`) to simulate network requests. While you can register a new account, you can also use the pre-seeded developer profile:

- **Email**: `nekothedev@nekoterminal.com`
- **Password**: `password` (or any string)

*Note: Data is persisted to your browser's LocalStorage. To wipe data, go to Settings > Danger Zone > Factory Reset.*

---

## 📂 Architecture Structure

```text
src/
├── api/                # API definition interfaces
├── components/         # Shared UI atoms (Buttons, Cards, Inputs)
│   └── ui/             # Cyberpunk specific UI kit
├── features/           # Complex business logic components
│   ├── Timer.tsx       # Core timer logic & SVG rendering
│   ├── TaskBoard.tsx   # Task management system
│   └── StatsBoard.tsx  # Analytics visualization
├── hooks/              # Custom React hooks
├── layouts/            # Main application wrappers
├── pages/              # Route views (Dashboard, Login, Settings)
├── services/           # Mock Backend & Data Seeding
├── store/              # Zustand global state definitions
└── types/              # TypeScript interfaces
```

## 🎨 Design Philosophy

The UI follows a **"Warm Stone & Neon"** palette. Unlike harsh cyberpunk themes, Cozy Focus uses:
- **Backgrounds**: Deep warm grays (`#1c1917`) instead of pure black.
- **Accents**: 
  - *Amber* (`#fbbf24`) for Focus/Primary.
  - *Cyan* (`#06b6d4`) for Tech/Data.
  - *Rose* (`#fda4af`) for Alerts.
- **Glassmorphism**: Heavy use of `backdrop-blur` and translucent borders to create depth.

---

## 🔮 Future Roadmap

- [ ] **Soundscapes**: Integration with Howler.js for real rain/cafe sounds.
- [ ] **PWA Support**: Offline capabilities and mobile installation.
- [ ] **Teams**: Shared task boards for collaborative sessions.
- [ ] **Keyboard Shortcuts**: Global hotkeys for timer control.

---

<div align="center">

**CRAFTED WITH INTENTION.**  
*System Status: Online*

</div>
