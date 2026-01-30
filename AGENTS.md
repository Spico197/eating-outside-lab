# AGENTS.md

This file contains essential information for AI coding agents working on this project.

## Project Overview

**今天吃什么？** (What to eat today?) is a beautiful, interactive web application that helps users randomly select a restaurant for lunch or dinner. It features a responsive card-based layout with filtering by category, star ratings, pricing, and wait times.

The app automatically generates category filters from restaurant data and provides a fun 4-second selection animation with randomized highlighting.

## Technology Stack

- **Framework**: Next.js 15.1.6 (App Router)
- **React**: Version 19
- **Language**: TypeScript 5
- **Build Output**: Static export (`dist/` directory)
- **Package Manager**: npm
- **Styling**: Inline CSS-in-JSX (no CSS modules or frameworks)

## Project Structure

```
eating-outside-lab/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Root layout (zh-CN language)
│   ├── page.tsx             # Main page with restaurant selector
│   └── globals.css          # Global styles with animations
├── public/                   # Static assets
│   ├── data.json            # Restaurant data (auto-loaded)
│   └── map.jpg              # Original map image (unused in UI)
├── dist/                     # Build output (static export)
├── .gitignore               # Git ignore rules
├── next.config.js           # Next.js configuration (static export)
├── tsconfig.json            # TypeScript configuration
├── package.json             # Dependencies and scripts
├── update_restaurants.py    # Python script for bulk updates
├── README.md                # User documentation
└── LICENSE                  # License file
```

## Build and Development Commands

```bash
# Install dependencies
npm install

# Start development server (http://localhost:3000)
npm run dev

# Build for production (static export to dist/)
npm run build

# The dist/ folder is ready for deployment
```

## Key Configuration Files

### next.config.js
```javascript
{
  output: 'export',        // Static site generation
  distDir: 'dist',         // Output directory
  images: { unoptimized: true }  // Required for static export
}
```

### tsconfig.json
- Strict TypeScript mode enabled
- Path alias: `@/*` maps to `./*`
- Target: ES2017
- Module resolution: bundler

## Data Structure

### Restaurant Data Format (public/data.json)

```typescript
interface Restaurant {
  id: number;              // Unique identifier
  name: string;            // Restaurant name (Chinese)
  category: string;        // Category (快餐, 面食, 火锅, etc.)
  location: string;        // Physical location (e.g., "B1层", "2层")
  price: string;           // Price range (e.g., "¥30-50")
  rating: number;          // Rating 1-5 (e.g., 4.2)
  waitTime: string;        // Estimated wait time (e.g., "5-10分钟")
  tags: string[];          // Array of feature tags
  image: string;           // Emoji icon (e.g., "🍔")
  description: string;     // Brief description
}
```

### Current Restaurants (18 total)

| Category | Count | Examples |
|----------|-------|----------|
| 面食 | 5 | 陈香贵, 西安面, 遇见小面, 吉祥馄饨, 成都三样面 |
| 快餐 | 3 | 麦当劳, 肯德基, 老乡鸡 |
| 其他 | 各1 | 轻食, 火锅, 日料, 米饭, 烧腊, 炒菜, 家常菜, 小吃, 冒菜, 私房菜 |

## Features

### 1. Auto-Generated Category Filters
- Filters are automatically generated from restaurant `category` values
- Sorted by restaurant count (most popular first)
- Shows count badge for each category (e.g., "面食 (5)")

### 2. Category Icon Mapping
Common categories have predefined icons:
```typescript
{
  '快餐': '🍔', '面食': '🍜', '米饭': '🍚',
  '火锅': '🍲', '轻食': '🥗', '日料': '🍣',
  '烧腊': '🦆', '炒菜': '🥘', '家常菜': '🍛',
  '小吃': '🥟', '冒菜': '🌶️', '私房菜': '👨‍🍳'
}
```
New categories default to 🍽️.

### 3. Selection Animation
- **Duration**: 4 seconds total
- **Phase 1 (3.2s)**: Fast blinking (every 80ms)
- **Phase 2 (0.8s)**: Slow blinking (every 250ms)
- **Final**: Random restaurant selected

### 4. UI Design
- **Background**: Warm orange gradient (#ff9a56 → #ff6b35 → #ff4e50)
- **Cards**: White with rounded corners, emoji icons
- **Selected state**: Orange highlight with scale animation
- **Active state**: Gold glow effect

## Code Organization

### app/page.tsx
Main application component (~600 lines):
- `Restaurant` interface definition
- `FilterConfig` interface for auto-generated filters
- `categoryIcons` mapping object
- React state management:
  - `restaurants`: Loaded from data.json
  - `filters`: Auto-generated from categories
  - `activeFilter`: Currently selected category filter
  - `isSpinning`, `activeId`, `selectedId`, `showResult`: Animation states
- `useEffect`: Loads data and generates filters on mount
- `useMemo`: Filters restaurants by active category
- `startSpin`: Selection animation logic
- Inline styles object (`styles`) for all UI elements

### app/layout.tsx
Root layout with Chinese (zh-CN) metadata and HTML lang attribute.

### app/globals.css
Global animations and keyframes:
- `@keyframes spin`: Loading spinner
- `@keyframes pulse`: Button text animation
- `@keyframes modalPop`: Modal entrance animation

## Development Conventions

### Language
- **UI text**: Chinese (Simplified)
- **Code**: English (variables, interfaces, comments)

### Styling Approach
- **Inline styles** via JSX `style` prop
- No CSS modules or external frameworks
- Responsive grid: `grid-template-columns: repeat(auto-fill, minmax(160px, 1fr))`

### State Management
- React hooks only: `useState`, `useEffect`, `useMemo`, `useCallback`
- No external state management library

### Data Loading
- Data fetched from `/data.json` on client-side
- No server-side rendering for data

## Testing

No testing framework is currently configured. The project has no test files.

## Deployment

### Static Export
After `npm run build`, the `dist/` folder contains:
- `index.html` (main page)
- `data.json` (restaurant data)
- `_next/` (JS/CSS assets)

### Vercel Deployment
Build settings:
| Setting | Value |
|---------|-------|
| Framework Preset | Next.js |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install` |

## Adding or Modifying Restaurants

### Method 1: Edit data.json

Add a new restaurant entry to `public/data.json`:

```json
{
  "id": 19,
  "name": "新餐厅",
  "category": "火锅",
  "location": "2层",
  "price": "¥40-60",
  "rating": 4.2,
  "waitTime": "10-15分钟",
  "tags": ["辣", "自助"],
  "image": "🍲",
  "description": "餐厅简介"
}
```

The new category will automatically appear in the filter bar.

### Method 2: Use Python Script

For bulk updates, use `update_restaurants.py`:

```bash
python update_restaurants.py
```

This script updates all restaurants' prices and ratings in `public/data.json`.

## Important Notes

- The original map image (`public/map.jpg`) is kept for reference but not used in the UI
- Restaurant cards use a responsive grid layout (not map-based positioning)
- Category filters are auto-generated - no manual filter configuration needed
- The app is optimized for mobile, tablet, and desktop viewing
- External links:
  - GitHub repo: https://github.com/Spico197/eating-outside-lab
  - Reviews: https://aicarrier.feishu.cn/wiki/ItwHwWAJuiWZPSkAELIcauqGnrg
  - Games: https://platform.feedscription.com/

## License

See LICENSE file for details.
