# Micro AI Studios Frontend

This is a Next.js frontend application for Micro AI Studios, connecting to the EXECAI Platform API.

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
git clone https://github.com/gnoscenti/microaistudios-frontend.git
cd microaistudios-frontend
npm install
npm run dev   # local preview
```

The application will be available at `http://localhost:3000`.

### Development

Edit `app/page.tsx` (or add pages/components) to build your UI.

### API Integration

To call the API, use:

```typescript
fetch('https://execai-platform-api.onrender.com/api/knowledge/domains')
  .then(res => res.json())
  .then(data => console.log(data));
```

### Deployment

Push changes to main—Vercel auto‑deploys.

### Custom Domain (Optional)

- `microaistudios.com` can point to Vercel for the front end 
- `api.microaistudios.com` (CNAME to execai-platform-api.onrender.com) for the API
- In Vercel's Settings → Domains, add microaistudios.com and follow the DNS instructions
- In Render, keep api.microaistudios.com (or stay with the default Render subdomain)

## Related Repositories

- Backend API: https://github.com/Gnoscenti/execai-platform-api

## Tech Stack

- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- EXECAI Platform API

