# HR Fun & Flow Hub

This project is a React application for HR tasks, built with Vite and TypeScript.

## Getting Started

### Prerequisites

- Node.js (v20 or higher recommended)
- npm

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

### Local Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

### Building for Production
 
To create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory.

## Deployment

This project is configured to automatically deploy to **GitHub Pages** using GitHub Actions.

### Setup

1. Go to your repository **Settings**.
2. Navigate to **Pages** in the sidebar.
3. Under **Build and deployment** > **Source**, ensure **GitHub Actions** is selected.
4. Push your changes to the `main` branch.
5. The deployment workflow will trigger automatically.

## Project Structure

- `src/`: Source code
- `public/`: Static assets
- `dist/`: Build output (not committed)
