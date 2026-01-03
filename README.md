# Candidate Filtering & Ranking System

Rule-based candidate filtering and scoring system built with Next.js 15, TypeScript, and Tailwind CSS.

## Quick Start

```bash
# Clone and install
git clone https://github.com/prathamamritkar/candidate-filtering-and-ranking-system.git
cd candidate-filtering-and-ranking-system
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Features

**4-Step Workflow:**
1. **Job Description** - Paste job posting, extract requirements automatically
2. **Upload Candidates** - JSON format with skills, experience, education
3. **Set Filters** - Adjust min experience, skills, locations, salary range
4. **View Results** - Ranked candidates with scores and match details

**Scoring Algorithm:**
- Required skills: 35% (70% of skill weight)
- Preferred skills: 15% (30% of skill weight)
- Experience match: 25%
- Education match: 10%
- Resume similarity: 15%

Hard filters eliminate candidates not meeting experience, skills, location, or salary requirements.

## Project Structure

```
app/
├── api/rank/          # Backend API endpoint
├── globals.css        # Global styles
├── layout.tsx         # Root layout
└── page.tsx           # Main entry point

components/
├── ui/                # shadcn/ui components
├── candidate-dashboard.tsx
├── candidate-list.tsx
├── candidate-upload.tsx
├── job-description-input.tsx
└── results-table.tsx

lib/
└── candidate-engine.ts  # Core filtering & ranking logic

types/
└── candidate.ts         # TypeScript interfaces
```

## Tech Stack

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui + Radix UI

## Sample Data

Click "Load Sample Data" to populate with 4 pre-configured candidates demonstrating different skill sets and experience levels.

## License

Created for assignment/demonstration purposes.
