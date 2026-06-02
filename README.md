# 🎮 iPad版 戦略MG (mg-ipad-app)

iPad-optimized UI for the MG Management Game based on React + Vite.

## 🎯 Overview

This project extends the mobile version (`mg-mobile-app`) with an iPad-first design, leveraging the larger screen real estate for a dashboard layout with sidebar navigation.

**Target Devices**: iPad Pro (12.9", 11"), iPad (10.9", 10.2"), iPad Mini (7")  
**Responsive**: Landscape (sidebar + content) and Portrait (stacked) layouts

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm/yarn
- Git

### Installation

```bash
git clone https://github.com/zukkyyoshida-arch/mg-ipad-app.git
cd mg-ipad-app
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your iPad browser.

### Build for Production

```bash
npm run build
```

Output: `dist/index.html` (single-file bundle)

## 📁 Project Structure

```
src/
├── components/
│   ├── Layout/
│   │   ├── TopBar.jsx          # Top navigation bar
│   │   ├── Sidebar.jsx         # Left sidebar (landscape)
│   │   └── MainContent.jsx     # Content area
│   ├── Dashboard/              # Dashboard components
│   ├── FinancialStatements/    # Financial reports (optimized for iPad)
│   └── ...
├── styles/
│   ├── index.css               # Global styles & responsive
│   ├── layout.css              # iPad layout CSS
│   └── responsive.css          # Media queries
├── utils/
├── hooks/
├── App.jsx                     # Main app component
├── main.jsx                    # Entry point
└── index.css                   # Global CSS variables
```

## 🎨 Design System

### Layout Breakpoints
- **1366px+**: iPad Pro 12.9"
- **1194px+**: iPad Pro 11"
- **1024px+**: iPad (10.9", 10.2")
- **768px+**: iPad Mini

### Color Palette
```
Primary: var(--color-accent) #2A84FF
Success: var(--mg-green)     #10B981
Warning: #EF4444 (Red)
```

### Responsive Modes
- **Landscape**: Sidebar (200-240px) + Main Content (flexible)
- **Portrait**: Stacked layout with bottom sidebar

## 🔧 Tech Stack

- **Frontend**: React 19, Vite 8
- **Backend**: Firebase (shared with mg-mobile-app)
- **Styling**: CSS + CSS Variables
- **Build**: Vite with singlefile plugin
- **Testing**: Playwright

## 📦 Dependencies

### Core
- `react@^19` - UI library
- `react-dom@^19` - DOM rendering
- `react-router-dom@^7` - Routing

### UI/UX
- `framer-motion@^12` - Animations
- `lucide-react@^1` - Icons
- `react-use@^17` - Utilities

### Backend
- `firebase@^12` - BaaS (auth, DB, storage)

## 🧪 Testing

```bash
npm run test              # Run tests
npm run test:ui          # Interactive test runner
npm run test:debug       # Debug mode
npm run test:report      # View test report
```

## 📝 Development Guidelines

- **Commit Format**: `<type>: <description>` (feat, fix, refactor, docs, test)
- **Code Style**: ESLint configured
- **Test Coverage**: 80%+ required

## 🌐 Deployment

Deployed to Vercel: [ipad-mg-app.vercel.app](https://ipad-mg-app.vercel.app)

### Deploy Steps
1. Push to `main` branch
2. Vercel auto-deploys via GitHub Actions
3. Preview available immediately

## 📚 Resources

- [Vite Docs](https://vitejs.dev/)
- [React Docs](https://react.dev/)
- [Firebase Docs](https://firebase.google.com/docs)

## 👤 Author

**Kazuki Yoshida** (ずっきーさん)  
Antigravty Co., Ltd.

## 📄 License

MIT
