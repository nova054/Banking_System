# NovaBank - Banking System Frontend

Modern banking system frontend built with React, TypeScript, and Tailwind CSS.

## Technologies Used

This project is built with:

- **Vite** - Fast build tool and development server
- **React** - UI library
- **TypeScript** - Type-safe JavaScript
- **shadcn-ui** - High-quality component library
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

```sh
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
frontend/
├── src/
│   ├── components/     # Reusable React components
│   ├── contexts/       # React context providers
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utility functions
│   ├── pages/          # Page components
│   └── services/       # API service layer
├── public/             # Static assets
└── index.html          # HTML template
```

## Development

The development server will start on `http://localhost:3000` by default.

## Building for Production

Run `npm run build` to create an optimized production build in the `dist/` directory.
