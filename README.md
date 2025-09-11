# Contracted Rooftops Dashboard

A modern dashboard for managing and monitoring contracted rooftops built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Comprehensive Rooftops Table**: View and manage all contracted rooftops with detailed information
- **Advanced Filtering**: Filter by stage, POC, media type, SLA status, product, type, sub-type, and region
- **Search Functionality**: Quick search across rooftop names, team IDs, and enterprise IDs
- **Real-time Metrics**: Track total rooftops count, ARR, and average progress
- **Interactive Interface**: Sortable columns, dropdown filters, and responsive design
- **Progress Tracking**: Visual progress bars and status indicators

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn

### Installation

1. Navigate to the project directory:
   ```bash
   cd "Contract rooftops"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the dashboard.

## Project Structure

```
Contract rooftops/
├── app/
│   ├── globals.css             # Global styles
│   ├── layout.tsx              # Root layout component
│   ├── page.tsx                # Main dashboard page
│   └── types.ts                # TypeScript type definitions
├── components/
│   └── Common-rooftops-table/
│       ├── rooftops-table.tsx        # Main table component
│       ├── rooftops-table-header.tsx # Table header component
│       ├── rooftops-table-row.tsx    # Table row component
│       └── rooftops-table-filters.tsx # Filter components
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── next.config.js
```

## Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React useState hooks
- **UI Components**: Custom components with responsive design

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Data Structure

The dashboard works with rooftop data that includes:
- Basic information (name, dealer group)
- Onboarding progress and metrics
- POC and stage information
- Product and media configurations
- SLA tracking and regional data

## Customization

To customize the dashboard:
1. Modify table columns in the header component
2. Adjust filtering options in the filters component
3. Update styling using Tailwind CSS classes
4. Configure API endpoints in `app/services/api.ts`
